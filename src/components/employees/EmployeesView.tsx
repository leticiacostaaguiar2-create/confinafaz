import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { Employee } from '../../types';
import {
  Users,
  Plus,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit,
  X
} from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    currentUser,
    showToast,
  } = useFarm();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Operador de Curral' as Employee['role'],
    accessLevel: 'Operador' as Employee['accessLevel'],
    phone: '',
    email: '',
    status: 'Ativo' as Employee['status'],
  });

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      role: 'Operador de Curral',
      accessLevel: 'Operador',
      phone: '(64) 9',
      email: '',
      status: 'Ativo',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      role: emp.role,
      accessLevel: emp.accessLevel,
      phone: emp.phone,
      email: emp.email,
      status: emp.status,
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Preencha os campos obrigatórios!', 'error');
      return;
    }

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, {
        name: formData.name,
        role: formData.role,
        accessLevel: formData.accessLevel,
        phone: formData.phone,
        email: formData.email,
        status: formData.status,
      });
    } else {
      addEmployee({
        name: formData.name,
        role: formData.role,
        accessLevel: formData.accessLevel,
        phone: formData.phone,
        email: formData.email,
        status: formData.status,
        registrationDate: new Date().toISOString().split('T')[0],
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-800" />
            Equipe & Controle de Acesso
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Gerenciamento de funcionários, veterinários, operadores e permissões de segurança
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-950/20"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Funcionário
        </button>
      </div>

      {/* Access Level Summary Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-stone-500">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Administrador</span>
          </div>
          <p className="text-xs text-stone-600 mt-2">
            Acesso irrestrito a todos os módulos, configurações da fazenda e lançamentos financeiros.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-stone-500">
            <Shield className="w-4 h-4 text-amber-600" />
            <span>Gerente</span>
          </div>
          <p className="text-xs text-stone-600 mt-2">
            Acesso a animais, lotes, dietas, pesagens, saúde e estoque.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-stone-500">
            <Shield className="w-4 h-4 text-sky-600" />
            <span>Operador</span>
          </div>
          <p className="text-xs text-stone-600 mt-2">
            Lançamento operacional autorizado no brete, balança eletrônica e vagão misturador.
          </p>
        </div>
      </div>

      {/* Employees Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 overflow-hidden flex items-center justify-center text-indigo-800 font-bold text-base">
                  {emp.avatarUrl ? (
                    <img src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
                  ) : (
                    emp.name.substring(0, 2).toUpperCase()
                  )}
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    emp.accessLevel === 'Administrador'
                      ? 'bg-emerald-100 text-emerald-800'
                      : emp.accessLevel === 'Gerente'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}
                >
                  {emp.accessLevel}
                </span>
              </div>

              <div className="mt-3">
                <h4 className="font-extrabold text-stone-900 text-sm">{emp.name}</h4>
                <p className="text-xs text-indigo-700 font-medium">{emp.role}</p>
              </div>

              <div className="mt-3 space-y-1 text-xs text-stone-500">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>{emp.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{emp.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-stone-400">Desde: {emp.registrationDate}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleOpenEditModal(emp)}
                  className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-800"
                  title="Editar Funcionário"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                {emp.id !== currentUser?.id && (
                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="p-1 rounded hover:bg-rose-50 text-stone-400 hover:text-rose-700"
                    title="Excluir Funcionário"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200">
            <h3 className="font-bold text-base text-stone-900 mb-1">
              {editingEmployee ? 'Editar Funcionário' : 'Cadastrar Funcionário'}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Defina as permissões de acesso ao sistema do confinamento
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nome Completo:</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Cargo / Função:</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Gerente de Confinamento">Gerente de Confinamento</option>
                    <option value="Médico Veterinário">Médico Veterinário</option>
                    <option value="Zootecnista">Zootecnista</option>
                    <option value="Operador de Curral">Operador de Curral</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Nível de Acesso:</label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Administrador">Administrador (Total)</option>
                    <option value="Gerente">Gerente</option>
                    <option value="Operador">Operador (Restrito)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">E-mail Corporativo:</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Telefone / WhatsApp:</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  {editingEmployee ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
