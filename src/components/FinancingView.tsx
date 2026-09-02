import React, { useState } from 'react';
import {
  CreditCard,
  Building,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  BadgePercent,
  Sparkles,
} from 'lucide-react';

interface FinancingViewProps {
  onNavigateToArticle: (slug: string) => void;
  onOpenAssistant: (query?: string) => void;
}

export const FinancingView: React.FC<FinancingViewProps> = ({
  onNavigateToArticle,
  onOpenAssistant,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'prendario' | 'plan' | 'contado'>('prendario');

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-200">
      {/* Executive Header (Frosted Glass) */}
      <div className="bg-gradient-to-r from-[#0B2265]/95 via-blue-950/95 to-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 text-amber-200 px-3 py-1 rounded-full text-xs font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Opciones Claras y Seguras</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Financiación y Pagos
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-normal">
            Conocé cómo operan los créditos prendarios, planes de ahorro y transferencias oficiales en Autosol.
          </p>
        </div>
      </div>

      {/* Modality Selector Cards (Pastel Highlights) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Modality 1: Crédito Prendario */}
        <div
          onClick={() => setSelectedMethod('prendario')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedMethod === 'prendario'
              ? 'bg-amber-50/90 border-amber-300 shadow-xs ring-2 ring-amber-400/30'
              : 'bg-white/90 backdrop-blur-md border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <BadgePercent className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                Tasa Fija
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900">Crédito Prendario</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Financiación bancaria en pesos con inscripción de prenda sobre la unidad.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-bold text-amber-800">
            {selectedMethod === 'prendario' ? '● Seleccionado' : 'Hacé clic para ver detalles →'}
          </div>
        </div>

        {/* Modality 2: Autoahorro VW */}
        <div
          onClick={() => setSelectedMethod('plan')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedMethod === 'plan'
              ? 'bg-sky-50/90 border-sky-300 shadow-xs ring-2 ring-sky-400/30'
              : 'bg-white/90 backdrop-blur-md border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black bg-sky-100 text-sky-900 px-2 py-0.5 rounded-md border border-sky-200">
                Adjudicación
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900">Autoahorro Volkswagen</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Planes en cuotas mensuales sin interés bancario, adjudicados por sorteo o licitación.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-bold text-sky-800">
            {selectedMethod === 'plan' ? '● Seleccionado' : 'Hacé clic para ver detalles →'}
          </div>
        </div>

        {/* Modality 3: Transferencia Bancaria */}
        <div
          onClick={() => setSelectedMethod('contado')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedMethod === 'contado'
              ? 'bg-emerald-50/90 border-emerald-300 shadow-xs ring-2 ring-emerald-400/30'
              : 'bg-white/90 backdrop-blur-md border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-200">
                Canal Directo
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-900">Transferencia Oficial</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Cancelación de saldos exclusivamente en cuentas bancarias a nombre de Autosol S.A.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-bold text-emerald-800">
            {selectedMethod === 'contado' ? '● Seleccionado' : 'Hacé clic para ver detalles →'}
          </div>
        </div>
      </div>

      {/* Active Modality Detail Panel */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        {selectedMethod === 'prendario' && (
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-900">
              ¿Cómo funciona el Crédito Prendario?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              El banco o financiera abona el saldo restante del vehículo directamente a la concesionaria. El vehículo queda inscripto a tu nombre en el Registro Automotor con una <strong>reserva de dominio prendaria</strong> hasta completar las cuotas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                <strong className="text-slate-900 block font-black">1. Aprobación Crediticia</strong>
                <span className="text-slate-500 text-[11px]">Presentación de ingresos y scoring crediticio bancario.</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                <strong className="text-slate-900 block font-black">2. Firma de Contrato</strong>
                <span className="text-slate-500 text-[11px]">Suscripción del mutuo prendario y formularios 01/03.</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                <strong className="text-slate-900 block font-black">3. Inscripción Registral</strong>
                <span className="text-slate-500 text-[11px]">DNRPA inscribe el dominio y la prenda simultáneamente.</span>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'plan' && (
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-900">
              ¿Cómo funciona la Adjudicación de Autoahorro?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Al salir adjudicado por sorteo o licitación, se realiza la solicitud de pedido a fábrica (pedido de unidad), el cambio de modelo si lo deseas, y la integración de cuotas correspondientes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                <strong className="text-slate-900 block font-black">1. Acto de Adjudicación</strong>
                <span className="text-slate-500 text-[11px]">Resultado oficial de sorteo o licitación mensual.</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                <strong className="text-slate-900 block font-black">2. Aceptación y Pedido</strong>
                <span className="text-slate-500 text-[11px]">Elección de color, modelo y firma de aceptación.</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                <strong className="text-slate-900 block font-black">3. Facturación Terminal</strong>
                <span className="text-slate-500 text-[11px]">Volkswagen emite la factura y asigna el chasis.</span>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'contado' && (
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-900">
              Transferencias Bancarias Seguras
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Para tu total seguridad, todos los pagos se realizan de forma bancarizada mediante transferencia o depósito en cuentas corrientes oficiales registradas a nombre de <strong>Autosol S.A.</strong> (CUIT: 30-68194452-9).
            </p>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Nunca realices transferencias a cuentas de personas físicas ni asesores comerciales independientes.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
