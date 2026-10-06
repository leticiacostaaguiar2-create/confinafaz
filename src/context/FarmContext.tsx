import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Animal,
  Lot,
  Diet,
  InventoryItem,
  HealthTreatment,
  FeedingLog,
  FinancialTransaction,
  SaleRecord,
  Employee,
  FarmConfig,
  NotificationItem,
  AtypicalAlert,
  WeighingRecord,
  StockMovement,
} from '../types';
import {
  initialAnimals,
  initialLots,
  initialDiets,
  initialInventory,
  initialFeedingLogs,
  initialFinancialTransactions,
  initialSales,
  initialEmployees,
  initialFarmConfig,
  initialNotifications,
  initialAtypicalAlerts,
} from '../data/mockData';

export type NavigationTab =
  | 'dashboard'
  | 'animais'
  | 'lotes'
  | 'pesagens'
  | 'alimentacao'
  | 'saude'
  | 'estoque'
  | 'financeiro'
  | 'vendas'
  | 'relatorios'
  | 'funcionarios'
  | 'configuracoes';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ElectronicScaleState {
  connected: boolean;
  liveWeight: number;
  isStable: boolean;
  scannedRfid: string | null;
  lastLockedWeight: number | null;
  mode: 'idle' | 'weighing' | 'locked';
}

interface FarmContextType {
  // Navigation & User
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  currentUser: Employee | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;

  // Farm Data
  config: FarmConfig;
  updateConfig: (newConfig: Partial<FarmConfig>) => void;
  animals: Animal[];
  lots: Lot[];
  diets: Diet[];
  inventory: InventoryItem[];
  movements: StockMovement[];
  feedingLogs: FeedingLog[];
  healthTreatments: HealthTreatment[];
  atypicalAlerts: AtypicalAlert[];
  transactions: FinancialTransaction[];
  sales: SaleRecord[];
  employees: Employee[];
  notifications: NotificationItem[];

  // CRUD & Operations
  addAnimal: (animal: Omit<Animal, 'id' | 'weighings' | 'treatments'>) => void;
  updateAnimal: (id: string, animal: Partial<Animal>) => void;
  deleteAnimal: (id: string) => void;
  transferAnimalLot: (animalId: string, newLotId: string) => void;

  addLot: (lot: Omit<Lot, 'id'>) => void;
  updateLot: (id: string, lot: Partial<Lot>) => void;
  deleteLot: (id: string) => void;

  recordWeighing: (data: {
    animalId: string;
    weight: number;
    responsible: string;
    origin?: 'Balança Eletrônica' | 'Manual';
    notes?: string;
  }) => void;

  addFeedingLog: (data: Omit<FeedingLog, 'id'>) => void;

  addHealthTreatment: (data: Omit<HealthTreatment, 'id'>) => void;
  completeHealthTreatment: (id: string) => void;
  resolveAtypicalAlert: (id: string) => void;

  addStockMovement: (
    itemId: string,
    type: 'Entrada' | 'Saída',
    qty: number,
    responsible: string,
    reason: string
  ) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;

  addFinancialTransaction: (data: Omit<FinancialTransaction, 'id'>) => void;
  deleteFinancialTransaction: (id: string) => void;

  recordSale: (sale: Omit<SaleRecord, 'id'>) => void;

  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type: NotificationItem['type'], linkTab?: string) => void;

  // Modals & Selectors
  selectedAnimalId: string | null;
  setSelectedAnimalId: (id: string | null) => void;
  selectedLotId: string | null;
  setSelectedLotId: (id: string | null) => void;
  isScaleModalOpen: boolean;
  setIsScaleModalOpen: (open: boolean) => void;

  // Electronic Scale Live Stream
  scaleState: ElectronicScaleState;
  connectScale: () => void;
  disconnectScale: () => void;
  simulateAnimalOnScale: (rfid?: string, targetWeight?: number) => void;
  resetScaleReading: () => void;

  // Offline / Connectivity
  isOnline: boolean;
  toggleSimulatedOffline: () => void;
  pendingSyncCount: number;
  syncOfflineQueue: () => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;

  // Reset demo
  resetToInitialData: () => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [isScaleModalOpen, setIsScaleModalOpen] = useState<boolean>(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const saved = localStorage.getItem('valeforte_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialEmployees[0];
      }
    }
    return initialEmployees[0]; // Default logged-in admin for fast test/demo
  });

  // App Data with LocalStorage Persistence
  const [config, setConfig] = useState<FarmConfig>(() => {
    const saved = localStorage.getItem('valeforte_config');
    return saved ? JSON.parse(saved) : initialFarmConfig;
  });

  const [animals, setAnimals] = useState<Animal[]>(() => {
    const saved = localStorage.getItem('valeforte_animals');
    return saved ? JSON.parse(saved) : initialAnimals;
  });

  const [lots, setLots] = useState<Lot[]>(() => {
    const saved = localStorage.getItem('valeforte_lots');
    return saved ? JSON.parse(saved) : initialLots;
  });

  const [diets] = useState<Diet[]>(initialDiets);

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('valeforte_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('valeforte_movements');
    return saved ? JSON.parse(saved) : [];
  });

  const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>(() => {
    const saved = localStorage.getItem('valeforte_feeding');
    return saved ? JSON.parse(saved) : initialFeedingLogs;
  });

  const [healthTreatments, setHealthTreatments] = useState<HealthTreatment[]>(() => {
    const saved = localStorage.getItem('valeforte_health');
    return saved ? JSON.parse(saved) : [
      initialAnimals[14]?.treatments[0],
      initialAnimals[22]?.treatments[0],
    ].filter(Boolean) as HealthTreatment[];
  });

  const [atypicalAlerts, setAtypicalAlerts] = useState<AtypicalAlert[]>(() => {
    const saved = localStorage.getItem('valeforte_atypical');
    return saved ? JSON.parse(saved) : initialAtypicalAlerts;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('valeforte_finances');
    return saved ? JSON.parse(saved) : initialFinancialTransactions;
  });

  const [sales, setSales] = useState<SaleRecord[]>(() => {
    const saved = localStorage.getItem('valeforte_sales');
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('valeforte_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('valeforte_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Offline Management
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // Electronic Scale Simulator
  const [scaleState, setScaleState] = useState<ElectronicScaleState>({
    connected: true,
    liveWeight: 0,
    isStable: false,
    scannedRfid: null,
    lastLockedWeight: null,
    mode: 'idle',
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('valeforte_animals', JSON.stringify(animals));
  }, [animals]);

  useEffect(() => {
    localStorage.setItem('valeforte_lots', JSON.stringify(lots));
  }, [lots]);

  useEffect(() => {
    localStorage.setItem('valeforte_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('valeforte_finances', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('valeforte_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('valeforte_health', JSON.stringify(healthTreatments));
  }, [healthTreatments]);

  useEffect(() => {
    localStorage.setItem('valeforte_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('valeforte_config', JSON.stringify(config));
  }, [config]);

  // Auth Functions
  const login = (email: string, _pass: string) => {
    const found = employees.find((e) => e.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('valeforte_user', JSON.stringify(found));
      showToast(`Bem-vindo, ${found.name}!`, 'success');
      return true;
    }
    // Fallback: login as first admin if demo
    const defaultUser = employees[0];
    setCurrentUser(defaultUser);
    localStorage.setItem('valeforte_user', JSON.stringify(defaultUser));
    showToast(`Conectado como ${defaultUser.name} (Modo Demonstração)`, 'info');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('valeforte_user');
    showToast('Sessão encerrada com segurança.', 'info');
  };

  const updateConfig = (newConfig: Partial<FarmConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
    showToast('Configurações da fazenda atualizadas.', 'success');
  };

  // Animal Operations
  const addAnimal = (data: Omit<Animal, 'id' | 'weighings' | 'treatments'>) => {
    const id = `anim-${Date.now()}`;
    const initialWeighing: WeighingRecord = {
      id: `w-${Date.now()}`,
      animalId: id,
      date: data.entryDate,
      weight: data.entryWeight,
      weightGain: 0,
      adg: 0,
      responsible: currentUser?.name || 'Administrador',
      origin: 'Balança Eletrônica',
      notes: 'Pesagem inicial de entrada no confinamento.',
    };

    const newAnimal: Animal = {
      ...data,
      id,
      currentWeight: data.entryWeight,
      weighings: [initialWeighing],
      treatments: [],
    };

    setAnimals((prev) => [newAnimal, ...prev]);

    // Recalculate lot averages
    updateLotAverages(data.lotId);

    showToast(`Animal ${data.earringNumber} cadastrado com sucesso!`, 'success');
    addNotification(
      'Novo Bovino Cadastrado',
      `Animal ${data.earringNumber} (${data.breed}) alocado ao ${lots.find((l) => l.id === data.lotId)?.name || 'lote'}.`,
      'info',
      'animais'
    );
  };

  const updateAnimal = (id: string, updatedFields: Partial<Animal>) => {
    setAnimals((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...updatedFields };
          return updated;
        }
        return a;
      })
    );
    showToast('Dados do animal atualizados.', 'success');
  };

  const deleteAnimal = (id: string) => {
    const target = animals.find((a) => a.id === id);
    setAnimals((prev) => prev.filter((a) => a.id !== id));
    if (target?.lotId) {
      updateLotAverages(target.lotId);
    }
    showToast(`Animal ${target?.earringNumber || ''} removido do sistema.`, 'info');
  };

  const transferAnimalLot = (animalId: string, newLotId: string) => {
    const animal = animals.find((a) => a.id === animalId);
    if (!animal) return;
    const oldLotId = animal.lotId;
    setAnimals((prev) =>
      prev.map((a) => (a.id === animalId ? { ...a, lotId: newLotId } : a))
    );
    updateLotAverages(oldLotId);
    updateLotAverages(newLotId);
    showToast(`Animal ${animal.earringNumber} transferido com sucesso!`, 'success');
  };

  // Helper to recompute Lot weights
  const updateLotAverages = (lotId: string) => {
    setLots((prevLots) =>
      prevLots.map((lot) => {
        if (lot.id !== lotId) return lot;
        const lotAnimals = animals.filter(
          (a) => a.lotId === lotId && a.status === 'Confinado'
        );
        if (lotAnimals.length === 0) return lot;
        const totalWeight = lotAnimals.reduce((acc, a) => acc + a.currentWeight, 0);
        const avg = Math.round(totalWeight / lotAnimals.length);
        return {
          ...lot,
          currentAvgWeight: avg,
        };
      })
    );
  };

  // Lot Operations
  const addLot = (lotData: Omit<Lot, 'id'>) => {
    const id = `lot-${Date.now()}`;
    const newLot: Lot = { ...lotData, id };
    setLots((prev) => [...prev, newLot]);
    showToast(`Lote ${lotData.name} criado com sucesso!`, 'success');
  };

  const updateLot = (id: string, lotFields: Partial<Lot>) => {
    setLots((prev) => prev.map((l) => (l.id === id ? { ...l, ...lotFields } : l)));
    showToast('Dados do lote atualizados.', 'success');
  };

  const deleteLot = (id: string) => {
    const lotName = lots.find((l) => l.id === id)?.name;
    setLots((prev) => prev.filter((l) => l.id !== id));
    showToast(`Lote ${lotName || ''} excluído.`, 'info');
  };

  // Weighing Operations
  const recordWeighing = ({
    animalId,
    weight,
    responsible,
    origin = 'Balança Eletrônica',
    notes,
  }: {
    animalId: string;
    weight: number;
    responsible: string;
    origin?: 'Balança Eletrônica' | 'Manual';
    notes?: string;
  }) => {
    const animal = animals.find((a) => a.id === animalId);
    if (!animal) return;

    const lastWeighing = animal.weighings[animal.weighings.length - 1];
    const prevWeight = lastWeighing ? lastWeighing.weight : animal.entryWeight;
    const gain = Math.round((weight - prevWeight) * 10) / 10;

    // Calculate days between weighings
    let days = 1;
    if (lastWeighing) {
      const d1 = new Date(lastWeighing.date);
      const d2 = new Date();
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
    const adg = +(gain / days).toFixed(2);

    const newRecord: WeighingRecord = {
      id: `w-${Date.now()}`,
      animalId,
      date: new Date().toISOString().split('T')[0],
      weight,
      weightGain: gain,
      adg: adg > 0 ? adg : 0,
      responsible,
      origin,
      notes,
    };

    setAnimals((prev) =>
      prev.map((a) => {
        if (a.id === animalId) {
          return {
            ...a,
            currentWeight: weight,
            weighings: [...a.weighings, newRecord],
          };
        }
        return a;
      })
    );

    // If offline, increment pending sync
    if (!isOnline) {
      setPendingSyncCount((p) => p + 1);
    }

    // Check if GMD is critically low (trigger atypical alert)
    if (adg < 0.6 && days > 14) {
      const alertId = `alert-${Date.now()}`;
      setAtypicalAlerts((prev) => [
        {
          id: alertId,
          animalId,
          earringNumber: animal.earringNumber,
          lotId: animal.lotId,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          type: 'Queda de Ganho de Peso',
          severity: 'alta',
          description: `GMD registrado de apenas ${adg} kg/dia na última pesagem. Abaixo da meta de 1.40 kg/dia.`,
          resolved: false,
        },
        ...prev,
      ]);
      addNotification(
        'Alerta Zootécnico: Baixo Desempenho',
        `Animal ${animal.earringNumber} apresentou ganho crítico (${adg} kg/dia). Verifique saúde ruminal.`,
        'alerta',
        'saude'
      );
    }

    updateLotAverages(animal.lotId);
    showToast(`Pesagem registrada: ${animal.earringNumber} - ${weight} kg (+${gain} kg)`, 'success');
  };

  // Feeding logs
  const addFeedingLog = (data: Omit<FeedingLog, 'id'>) => {
    const newLog: FeedingLog = { ...data, id: `fl-${Date.now()}` };
    setFeedingLogs((prev) => [newLog, ...prev]);

    // Recalculate feed consumption cost in financial transactions
    const feedCost = Math.round((data.amountKg * 1.1) * 100) / 100; // ~R$ 1.10/kg
    const autoTransaction: FinancialTransaction = {
      id: `ft-feed-${Date.now()}`,
      date: data.date,
      type: 'Despesa',
      category: 'Alimentação',
      description: `Trato diário - ${lots.find((l) => l.id === data.lotId)?.name || 'Lote'} (${data.amountKg} kg)`,
      amount: feedCost,
      lotId: data.lotId,
      status: 'Pago',
      paymentMethod: 'Boleto',
    };
    setTransactions((prev) => [autoTransaction, ...prev]);

    showToast(`Trato de ${data.amountKg} kg registrado com sucesso!`, 'success');
  };

  // Health Treatments
  const addHealthTreatment = (data: Omit<HealthTreatment, 'id'>) => {
    const id = `treat-${Date.now()}`;
    const newTreatment: HealthTreatment = { ...data, id };
    setHealthTreatments((prev) => [newTreatment, ...prev]);

    // Put animal into 'Em tratamento' status
    setAnimals((prev) =>
      prev.map((a) => (a.id === data.animalId ? { ...a, status: 'Em tratamento' } : a))
    );

    // If withdrawal period is active, add alert
    if (data.withdrawalDays > 0) {
      setAtypicalAlerts((prev) => [
        {
          id: `alert-with-${Date.now()}`,
          animalId: data.animalId,
          earringNumber: data.earringNumber,
          lotId: animals.find((a) => a.id === data.animalId)?.lotId || '',
          date: data.date,
          type: 'Período de Carência Ativo',
          severity: 'alta',
          description: `Medicamento ${data.medicine} exige carência de ${data.withdrawalDays} dias até ${data.withdrawalEndDate}. Abate proibido.`,
          resolved: false,
        },
        ...prev,
      ]);
    }

    showToast(`Tratamento registrado para ${data.earringNumber}.`, 'success');
  };

  const completeHealthTreatment = (id: string) => {
    setHealthTreatments((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Concluído' } : t))
    );
    const treat = healthTreatments.find((t) => t.id === id);
    if (treat) {
      setAnimals((prev) =>
        prev.map((a) =>
          a.id === treat.animalId && a.status === 'Em tratamento'
            ? { ...a, status: 'Confinado' }
            : a
        )
      );
    }
    showToast('Tratamento concluído! Animal liberado para lote normal.', 'success');
  };

  const resolveAtypicalAlert = (id: string) => {
    setAtypicalAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
    showToast('Alerta zootécnico resolvido.', 'info');
  };

  // Inventory movements
  const addStockMovement = (
    itemId: string,
    type: 'Entrada' | 'Saída',
    qty: number,
    responsible: string,
    reason: string
  ) => {
    const item = inventory.find((i) => i.id === itemId);
    if (!item) return;

    const newStock = type === 'Entrada' ? item.currentStock + qty : item.currentStock - qty;

    setInventory((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          return {
            ...i,
            currentStock: Math.max(0, newStock),
            lastEntryDate: type === 'Entrada' ? new Date().toISOString().split('T')[0] : i.lastEntryDate,
            lastExitDate: type === 'Saída' ? new Date().toISOString().split('T')[0] : i.lastExitDate,
          };
        }
        return i;
      })
    );

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      itemId,
      itemName: item.name,
      type,
      quantity: qty,
      unit: item.unit,
      date: new Date().toISOString().split('T')[0],
      responsible,
      reason,
    };
    setMovements((prev) => [movement, ...prev]);

    // Check minimum threshold
    if (newStock < item.minimumStock) {
      addNotification(
        `Alerta de Estoque: ${item.name}`,
        `Estoque atual (${newStock} ${item.unit}) atingiu nível abaixo do mínimo de segurança (${item.minimumStock} ${item.unit}).`,
        'alerta',
        'estoque'
      );
    }

    showToast(`Movimentação de ${type} registrada: ${qty} ${item.unit} de ${item.name}`, 'success');
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const id = `inv-${Date.now()}`;
    setInventory((prev) => [...prev, { ...itemData, id }]);
    showToast(`Insumo ${itemData.name} cadastrado com sucesso!`, 'success');
  };

  const updateInventoryItem = (id: string, itemFields: Partial<InventoryItem>) => {
    setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, ...itemFields } : i)));
    showToast('Item de estoque atualizado.', 'success');
  };

  // Finances
  const addFinancialTransaction = (data: Omit<FinancialTransaction, 'id'>) => {
    const id = `ft-${Date.now()}`;
    setTransactions((prev) => [{ ...data, id }, ...prev]);
    showToast(`Transação financeira registrada (${data.type}): R$ ${data.amount.toLocaleString('pt-BR')}`, 'success');
  };

  const deleteFinancialTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Lançamento financeiro removido.', 'info');
  };

  // Sales
  const recordSale = (saleData: Omit<SaleRecord, 'id'>) => {
    const id = `sale-${Date.now()}`;
    const newSale = { ...saleData, id };
    setSales((prev) => [newSale, ...prev]);

    // Mark animals as 'Vendido' if earrings match
    if (saleData.animalEarrings && saleData.animalEarrings.length > 0) {
      setAnimals((prev) =>
        prev.map((a) => {
          if (saleData.animalEarrings.includes(a.earringNumber)) {
            return { ...a, status: 'Vendido' };
          }
          return a;
        })
      );
    }

    // Add Revenue transaction
    const revenueTrans: FinancialTransaction = {
      id: `ft-sale-${Date.now()}`,
      date: saleData.saleDate,
      type: 'Receita',
      category: 'Venda de Animais',
      description: `Faturamento Venda ${saleData.animalCount} animais - ${saleData.buyer} (${saleData.invoiceNumber})`,
      amount: saleData.totalAmount,
      lotId: saleData.lotId,
      status: 'Recebido',
      paymentMethod: 'Transferência Bancária',
    };
    setTransactions((prev) => [revenueTrans, ...prev]);

    showToast(`Venda registrada com sucesso! Faturamento: R$ ${saleData.totalAmount.toLocaleString('pt-BR')}`, 'success');
    addNotification(
      'Venda para Frigorífico Faturada',
      `${saleData.animalCount} bovinos vendidos para ${saleData.buyer}. Total: R$ ${saleData.totalAmount.toLocaleString('pt-BR')}`,
      'sucesso',
      'vendas'
    );
  };

  // Employees
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const id = `emp-${Date.now()}`;
    setEmployees((prev) => [...prev, { ...empData, id }]);
    showToast(`Funcionário ${empData.name} cadastrado!`, 'success');
  };

  const updateEmployee = (id: string, empFields: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...empFields } : e)));
    showToast('Dados do funcionário atualizados.', 'success');
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    showToast('Funcionário removido.', 'info');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Todas notificações marcadas como lidas.', 'info');
  };

  const addNotification = (
    title: string,
    message: string,
    type: NotificationItem['type'],
    linkTab?: string
  ) => {
    const item: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Agora',
      read: false,
      linkTab,
    };
    setNotifications((prev) => [item, ...prev]);
  };

  // Scale Functions
  const connectScale = () => {
    setScaleState((prev) => ({ ...prev, connected: true }));
    showToast('Balança Tru-Test conectada via Bluetooth/Serial.', 'success');
  };

  const disconnectScale = () => {
    setScaleState((prev) => ({ ...prev, connected: false, mode: 'idle', liveWeight: 0 }));
    showToast('Balança desconectada.', 'info');
  };

  const simulateAnimalOnScale = (rfid?: string, targetWeight?: number) => {
    const weight = targetWeight || 450 + Math.floor(Math.random() * 80);
    const tag = rfid || `982.000109${Math.floor(1000 + Math.random() * 9000)}`;

    setScaleState({
      connected: true,
      liveWeight: weight - 15, // Starts oscillating
      isStable: false,
      scannedRfid: tag,
      lastLockedWeight: null,
      mode: 'weighing',
    });

    // Simulate stabilization oscillation in 1.5 seconds
    setTimeout(() => {
      setScaleState((prev) => ({
        ...prev,
        liveWeight: weight - 4,
      }));
    }, 600);

    setTimeout(() => {
      setScaleState((prev) => ({
        ...prev,
        liveWeight: weight,
        isStable: true,
        lastLockedWeight: weight,
        mode: 'locked',
      }));
      showToast(`Peso travado na balança: ${weight} kg (RFID: ${tag.substring(0, 12)}...)`, 'success');
    }, 1500);
  };

  const resetScaleReading = () => {
    setScaleState((prev) => ({
      ...prev,
      liveWeight: 0,
      isStable: false,
      scannedRfid: null,
      lastLockedWeight: null,
      mode: 'idle',
    }));
  };

  // Offline Simulator
  const toggleSimulatedOffline = () => {
    setIsOnline((prev) => {
      const next = !prev;
      if (!next) {
        showToast('Modo Campo Ativo (Offline). Registros serão gravados localmente.', 'warning');
      } else {
        showToast('Conexão restabelecida! Sincronizando dados...', 'success');
        setPendingSyncCount(0);
      }
      return next;
    });
  };

  const syncOfflineQueue = () => {
    setPendingSyncCount(0);
    showToast('Todos os registros offline foram sincronizados com sucesso!', 'success');
  };

  // Reset demo
  const resetToInitialData = () => {
    localStorage.clear();
    setAnimals(initialAnimals);
    setLots(initialLots);
    setInventory(initialInventory);
    setTransactions(initialFinancialTransactions);
    setSales(initialSales);
    setEmployees(initialEmployees);
    setNotifications(initialNotifications);
    setAtypicalAlerts(initialAtypicalAlerts);
    setConfig(initialFarmConfig);
    showToast('Dados de demonstração restaurados.', 'info');
  };

  return (
    <FarmContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        currentUser,
        login,
        logout,
        config,
        updateConfig,
        animals,
        lots,
        diets,
        inventory,
        movements,
        feedingLogs,
        healthTreatments,
        atypicalAlerts,
        transactions,
        sales,
        employees,
        notifications,
        addAnimal,
        updateAnimal,
        deleteAnimal,
        transferAnimalLot,
        addLot,
        updateLot,
        deleteLot,
        recordWeighing,
        addFeedingLog,
        addHealthTreatment,
        completeHealthTreatment,
        resolveAtypicalAlert,
        addStockMovement,
        addInventoryItem,
        updateInventoryItem,
        addFinancialTransaction,
        deleteFinancialTransaction,
        recordSale,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        selectedAnimalId,
        setSelectedAnimalId,
        selectedLotId,
        setSelectedLotId,
        isScaleModalOpen,
        setIsScaleModalOpen,
        scaleState,
        connectScale,
        disconnectScale,
        simulateAnimalOnScale,
        resetScaleReading,
        isOnline,
        toggleSimulatedOffline,
        pendingSyncCount,
        syncOfflineQueue,
        toasts,
        showToast,
        resetToInitialData,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
