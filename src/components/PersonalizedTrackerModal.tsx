import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  X,
  Car,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  FileText,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ClientOperation, ProcessStageId } from '../types';

interface PersonalizedTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToStage: (stageId: ProcessStageId) => void;
  onOpenAssistant: (query: string) => void;
}

export const PersonalizedTrackerModal: React.FC<PersonalizedTrackerModalProps> = ({
  isOpen,
  onClose,
  onNavigateToStage,
  onOpenAssistant,
}) => {
  const { operations, stages, getStageById } = useData();
  const [searchInput, setSearchInput] = useState('AS-84920');
  const [selectedOperation, setSelectedOperation] = useState<ClientOperation | null>(
    operations[0] || null
  );
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const q = searchInput.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = operations.find((op) => {
      const opNum = op.orderNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      const dni = op.documentNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      const name = op.clientName.toLowerCase();
      return (
        opNum.includes(q) ||
        dni.includes(q) ||
        name.includes(searchInput.trim().toLowerCase())
      );
    });

    if (found) {
      setSelectedOperation(found);
    } else {
      setErrorMsg('No encontramos una operación con ese número de boleto o DNI de prueba.');
    }
  };

  const currentStageInfo = selectedOperation
    ? getStageById(selectedOperation.currentStageId)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">Mi Operación Personalizada</h2>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Portal del Cliente
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                Seguimiento real de tu unidad y vinculación con las explicaciones transparentes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search / Demo Selector Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 space-y-3 shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ingresá tu N° de orden / boleto (ej: AS-84920) o DNI..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs"
            >
              Consultar
            </button>
          </form>

          {/* Quick Demo Selector Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto text-[11px] scrollbar-thin">
            <span className="text-slate-400 font-semibold shrink-0">Clientes de prueba:</span>
            {operations.map((op) => (
              <button
                key={op.orderNumber}
                onClick={() => {
                  setSelectedOperation(op);
                  setSearchInput(op.orderNumber);
                  setErrorMsg('');
                }}
                className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-colors ${
                  selectedOperation?.orderNumber === op.orderNumber
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {op.clientName} ({op.vehicleModel})
              </button>
            ))}
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium animate-in fade-in">{errorMsg}</p>
          )}
        </div>

        {/* Main Content Body */}
        {selectedOperation ? (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Top Greeting & Active Status Card */}
            <div className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-3xl p-6 text-white shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs text-blue-300 font-medium">Boleto N° {selectedOperation.orderNumber}</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Hola, {selectedOperation.clientName} 👋
                  </h3>
                  <p className="text-xs text-blue-100">
                    DNI {selectedOperation.documentNumber} • {selectedOperation.vehicleModel} ({selectedOperation.vehicleVersion})
                  </p>
                </div>

                <div className="bg-blue-900/80 border border-blue-400/40 rounded-2xl p-3.5 text-left sm:text-right shrink-0">
                  <div className="text-[11px] text-blue-200 font-medium">Fecha estimada de entrega</div>
                  <div className="text-sm sm:text-base font-extrabold text-white mt-0.5 flex items-center sm:justify-end space-x-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>{selectedOperation.estimatedDeliveryDate}</span>
                  </div>
                </div>
              </div>

              {/* Active Stage Highlight */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {currentStageInfo?.stepNumber}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                        Etapa actual en curso
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-base font-bold text-white">{currentStageInfo?.name}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onNavigateToStage(selectedOperation.currentStageId);
                    onClose();
                  }}
                  className="bg-white hover:bg-blue-50 text-blue-950 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm self-stretch sm:self-auto justify-center"
                >
                  <span>¿Qué significa esta etapa?</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-700" />
                </button>
              </div>
            </div>

            {/* Visual Process Progress Stepper */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Progreso de tu operación (7 etapas)
                </h4>
                <span className="text-xs font-semibold text-blue-600">
                  Etapa {currentStageInfo?.stepNumber} de 7
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
                {stages.map((stage, idx) => {
                  const isCompleted = selectedOperation.completedStages.includes(stage.id);
                  const isCurrent = selectedOperation.currentStageId === stage.id;
                  return (
                    <div
                      key={stage.id}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isCurrent
                          ? 'bg-blue-50 border-blue-400 shadow-xs ring-2 ring-blue-200'
                          : isCompleted
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isCompleted ? '✓' : stage.stepNumber}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                            Actual
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">{stage.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{stage.estimatedTime}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vehicle Details & Assigned Advisor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Unit Info Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Car className="w-4 h-4 text-blue-600" />
                  <span>Datos de la unidad</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Modelo:</span>
                    <strong className="text-slate-800">{selectedOperation.vehicleModel}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Versión:</span>
                    <span className="text-slate-700 font-medium">{selectedOperation.vehicleVersion}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Color asignado:</span>
                    <span className="text-slate-700 font-medium">{selectedOperation.vehicleColor}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Chasis (VIN):</span>
                    <span className="font-mono text-slate-700 font-medium">{selectedOperation.vinMasked}</span>
                  </div>
                </div>
              </div>

              {/* Advisor Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Asesor comercial & Sucursal</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Asesor asignado:</span>
                    <strong className="text-slate-900 text-sm">{selectedOperation.advisorName}</strong>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-700 font-medium">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedOperation.advisorPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{selectedOperation.concessionaireBranch}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transparent Note / Internal Observation for Customer */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-blue-950">
              <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Nota de seguimiento de tu unidad:</strong>
                <span>{selectedOperation.notes}</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <span>Autosol Transparente • Sistema Complementario de Orientación</span>
          <button
            onClick={onClose}
            className="bg-white hover:bg-slate-200 text-slate-800 font-bold px-4 py-1.5 rounded-xl border border-slate-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
