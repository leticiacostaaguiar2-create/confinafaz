export type AnimalStatus =
  | 'Confinado'
  | 'Em tratamento'
  | 'Vendido'
  | 'Morto'
  | 'Transferido'
  | 'Em observação';

export type AnimalBreed =
  | 'Nelore'
  | 'Angus'
  | 'Brangus'
  | 'Braford'
  | 'Senepol'
  | 'Cruzamento Industrial'
  | 'Tabapuã'
  | 'Brahman';

export type AnimalSex = 'Macho' | 'Fêmea';

export interface WeighingRecord {
  id: string;
  animalId: string;
  date: string; // ISO YYYY-MM-DD
  weight: number; // in kg
  weightGain?: number; // gain since last weight
  adg?: number; // average daily gain (kg/day)
  responsible: string;
  origin: 'Balança Eletrônica' | 'Manual';
  notes?: string;
}

export interface FeedingLog {
  id: string;
  animalId?: string;
  lotId: string;
  date: string;
  dietName: string;
  amountKg: number;
  time: string;
  troughScore?: number; // Leitura de cocho: 0 a 4
  responsible: string;
}

export interface HealthTreatment {
  id: string;
  animalId: string;
  earringNumber: string;
  date: string;
  diagnosis: string;
  medicine: string;
  dosage: string;
  route: 'Intramuscular' | 'Subcutânea' | 'Oral' | 'Tópica';
  withdrawalDays: number; // dias de carência para abate
  withdrawalEndDate: string;
  responsible: string;
  status: 'Em andamento' | 'Concluído' | 'Crítico';
  notes?: string;
}

export interface AtypicalAlert {
  id: string;
  animalId: string;
  earringNumber: string;
  lotId: string;
  date: string;
  type: 'Queda de Consumo' | 'Queda de Ganho de Peso' | 'Inatividade / Temperatura' | 'Período de Carência Ativo';
  severity: 'alta' | 'media' | 'baixa';
  description: string;
  resolved: boolean;
}

export interface Animal {
  id: string;
  earringNumber: string; // Brinco visual / SISBOV ex: VF-1042
  rfidTag?: string; // Brinco eletrônico RFID 982.000...
  animalNumber: string;
  breed: AnimalBreed;
  sex: AnimalSex;
  birthDate: string;
  origin: string; // Fazenda de cria / Compra em leilão
  entryDate: string;
  entryWeight: number; // kg
  currentWeight: number; // kg
  lotId: string;
  status: AnimalStatus;
  notes?: string;
  weighings: WeighingRecord[];
  treatments: HealthTreatment[];
}

export interface Lot {
  id: string;
  name: string; // ex: Lote 01 - Nelore Machos
  description: string;
  corralNumber: string; // Piquete / Curral do confinamento
  entryDate: string;
  projectedExitDate: string;
  dietName: string;
  targetWeight: number; // Meta de peso (ex: 540 kg)
  currentAvgWeight: number;
  initialAvgWeight: number;
  adg: number; // GMD médio (kg/dia)
  dailyIntakePerHeadKg: number;
  accumulatedCost: number;
  status: 'Ativo' | 'Em Terminação' | 'Finalizado' | 'Em Quarentena';
}

export interface Diet {
  id: string;
  name: string;
  phase: 'Adaptação' | 'Crescimento' | 'Terminação 1' | 'Terminação Intensiva';
  dryMatterPercent: number;
  costPerTon: number;
  ingredients: {
    name: string;
    percentage: number;
  }[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category:
    | 'Milho'
    | 'Soja'
    | 'Ração'
    | 'Silagem'
    | 'Feno'
    | 'Minerais'
    | 'Medicamentos'
    | 'Vacinas'
    | 'Outros';
  currentStock: number;
  unit: 'kg' | 't' | 'sacos' | 'doses' | 'frascos' | 'L';
  minimumStock: number;
  pricePerUnit: number;
  supplier: string;
  lastEntryDate: string;
  lastExitDate: string;
  location: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'Entrada' | 'Saída';
  quantity: number;
  unit: string;
  date: string;
  responsible: string;
  reason: string;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'Receita' | 'Despesa';
  category:
    | 'Venda de Animais'
    | 'Venda de Subprodutos'
    | 'Compra de Animais'
    | 'Alimentação'
    | 'Medicamentos e Sanidade'
    | 'Funcionários e Folha'
    | 'Combustível e Energia'
    | 'Manutenção'
    | 'Transporte e Frete'
    | 'Outros Custos';
  description: string;
  amount: number;
  lotId?: string;
  status: 'Pago' | 'Recebido' | 'Pendente';
  paymentMethod: 'PIX' | 'Transferência Bancária' | 'Boleto' | 'A prazo';
}

export interface SaleRecord {
  id: string;
  lotId?: string;
  animalCount: number;
  animalEarrings: string[];
  saleDate: string;
  totalWeightKg: number;
  avgWeightKg: number;
  pricePerArroba: number; // Preço da @ (15kg carcaça)
  carcassYieldPercent: number; // Rendimento de carcaça (ex: 55%)
  totalAmount: number;
  buyer: string; // Ex: Frigorífico JBS, Frigorífico Marfrig
  invoiceNumber: string;
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: 'Administrador' | 'Gerente de Confinamento' | 'Médico Veterinário' | 'Zootecnista' | 'Operador de Curral';
  accessLevel: 'Administrador' | 'Gerente' | 'Operador';
  phone: string;
  email: string;
  avatarUrl?: string;
  status: 'Ativo' | 'Férias' | 'Inativo';
  registrationDate: string;
}

export interface FarmConfig {
  name: string;
  tradeName: string;
  slogan: string;
  cnpj: string;
  stateRegistration: string;
  address: string;
  city: string;
  state: string;
  responsibleVet: string;
  crmv: string;
  currency: string;
  weightUnit: 'kg' | 'arroba';
  enableOfflineMode: boolean;
  scaleIntegration: {
    enabled: boolean;
    brand: 'Tru-Test' | 'Coimma' | 'Toledo' | 'Genérica';
    port: string;
    protocol: string;
    autoLockSeconds: number;
    connected: boolean;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alerta' | 'aviso' | 'sucesso' | 'info';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}
