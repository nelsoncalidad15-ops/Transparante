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
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Editorial Volkswagen */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-[0_5px_20px_rgba(7,30,58,0.05)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[36px] border-[#e6e6e6]/60" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-black uppercase">
              Opciones Claras y Canales Oficiales
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.05em] text-black">
              Financiación y Pagos
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl">
              Conocé cómo operan los créditos prendarios, planes de ahorro y transferencias bancarias oficiales en Autosol.
            </p>
          </div>
        </div>
      </div>

      {/* Selector de Modalidad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Modalidad 1: Crédito Prendario */}
        <div
          onClick={() => setSelectedMethod('prendario')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedMethod === 'prendario'
              ? 'bg-[#ece5db] border-[#0040c4] shadow-[0_8px_24px_rgba(14,71,104,0.09)] ring-2 ring-[#e6e6e6]'
              : 'bg-white border-slate-200/80 hover:border-[#a0a3aa] shadow-[0_5px_18px_rgba(23,59,87,0.04)] hover:-translate-y-0.5'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#e6e6e6] text-[#0040c4] flex items-center justify-center">
                <BadgePercent className="w-5 h-5 text-[#0040c4]" strokeWidth={1.6} />
              </div>
              <span className="text-[11px] font-semibold bg-white text-[#001e50] px-3 py-1 rounded-full border border-slate-200">
                Tasa Fija en Pesos
              </span>
            </div>
            <h3 className="text-base font-semibold text-[#001e50]">Crédito Prendario</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Financiación bancaria directa con cuotas fijas e inscripción de prenda sobre la unidad.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-200/70 text-xs font-semibold text-[#0040c4]">
            {selectedMethod === 'prendario' ? '● Seleccionado actualmente' : 'Ver requisitos y pasos →'}
          </div>
        </div>

        {/* Modalidad 2: Autoahorro VW */}
        <div
          onClick={() => setSelectedMethod('plan')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedMethod === 'plan'
              ? 'bg-[#ece5db] border-[#0040c4] shadow-[0_8px_24px_rgba(14,71,104,0.09)] ring-2 ring-[#e6e6e6]'
              : 'bg-white border-slate-200/80 hover:border-[#a0a3aa] shadow-[0_5px_18px_rgba(23,59,87,0.04)] hover:-translate-y-0.5'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#e6e6e6] text-[#0040c4] flex items-center justify-center">
                <Building className="w-5 h-5 text-[#0040c4]" strokeWidth={1.6} />
              </div>
              <span className="text-[11px] font-semibold bg-white text-[#001e50] px-3 py-1 rounded-full border border-slate-200">
                Adjudicación Oficial
              </span>
            </div>
            <h3 className="text-base font-semibold text-[#001e50]">Autoahorro Volkswagen</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Planes en cuotas mensuales sin interés bancario, adjudicados por sorteo o licitación.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-200/70 text-xs font-semibold text-[#0040c4]">
            {selectedMethod === 'plan' ? '● Seleccionado actualmente' : 'Ver requisitos y pasos →'}
          </div>
        </div>

        {/* Modalidad 3: Transferencia Bancaria */}
        <div
          onClick={() => setSelectedMethod('contado')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedMethod === 'contado'
              ? 'bg-[#ece5db] border-[#0040c4] shadow-[0_8px_24px_rgba(14,71,104,0.09)] ring-2 ring-[#e6e6e6]'
              : 'bg-white border-slate-200/80 hover:border-[#a0a3aa] shadow-[0_5px_18px_rgba(23,59,87,0.04)] hover:-translate-y-0.5'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#e6e6e6] text-[#0040c4] flex items-center justify-center">
                <Landmark className="w-5 h-5 text-[#0040c4]" strokeWidth={1.6} />
              </div>
              <span className="text-[11px] font-semibold bg-white text-[#001e50] px-3 py-1 rounded-full border border-slate-200">
                Cuentas Oficiales
              </span>
            </div>
            <h3 className="text-base font-semibold text-[#001e50]">Transferencia Oficial</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cancelación de saldos exclusivamente en cuentas bancarias a nombre de Autosol S.A.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-200/70 text-xs font-semibold text-[#0040c4]">
            {selectedMethod === 'contado' ? '● Seleccionado actualmente' : 'Ver requisitos y pasos →'}
          </div>
        </div>
      </div>

      {/* Detalle de la Modalidad Seleccionada */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-[0_5px_20px_rgba(7,30,58,0.04)] space-y-5">
        {selectedMethod === 'prendario' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.03em] text-[#001e50]">
                ¿Cómo funciona el Crédito Prendario?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                La entidad bancaria o financiera abona el saldo del vehículo directamente a la concesionaria. La unidad queda inscripta a tu nombre en el Registro Automotor con una <strong>reserva de dominio prendaria</strong> hasta la cancelación total de las cuotas.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#ece5db] p-4 rounded-2xl border border-slate-200/70 text-xs space-y-1">
                <strong className="text-[#001e50] block font-semibold text-sm">1. Aprobación Crediticia</strong>
                <span className="text-slate-600 text-xs leading-relaxed">Presentación de recibos de sueldo/ingresos y scoring bancario.</span>
              </div>
              <div className="bg-[#ece5db] p-4 rounded-2xl border border-slate-200/70 text-xs space-y-1">
                <strong className="text-[#001e50] block font-semibold text-sm">2. Firma de Contrato</strong>
                <span className="text-slate-600 text-xs leading-relaxed">Suscripción del mutuo prendario y formularios oficiales 01 y 03.</span>
              </div>
              <div className="bg-[#ece5db] p-4 rounded-2xl border border-slate-200/70 text-xs space-y-1">
                <strong className="text-[#001e50] block font-semibold text-sm">3. Inscripción Registral</strong>
                <span className="text-slate-600 text-xs leading-relaxed">DNRPA inscribe el dominio a tu nombre y la prenda simultáneamente.</span>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'plan' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.03em] text-[#001e50]">
                ¿Cómo funciona la Adjudicación de Autoahorro?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                Al resultar adjudicado por sorteo o licitación mensual, se realiza el pedido formal a fábrica (pedido de unidad), la elección de versión o cambio de modelo si lo deseás, y la integración de las cuotas correspondientes.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#ece5db] p-4 rounded-2xl border border-slate-200/70 text-xs space-y-1">
                <strong className="text-[#001e50] block font-semibold text-sm">1. Acto de Adjudicación</strong>
                <span className="text-slate-600 text-xs leading-relaxed">Resultado del acto oficial de sorteo o licitación mensual.</span>
              </div>
              <div className="bg-[#ece5db] p-4 rounded-2xl border border-slate-200/70 text-xs space-y-1">
                <strong className="text-[#001e50] block font-semibold text-sm">2. Aceptación y Pedido</strong>
                <span className="text-slate-600 text-xs leading-relaxed">Elección de color, versión y firma del formulario de pedido.</span>
              </div>
              <div className="bg-[#ece5db] p-4 rounded-2xl border border-slate-200/70 text-xs space-y-1">
                <strong className="text-[#001e50] block font-semibold text-sm">3. Facturación Terminal</strong>
                <span className="text-slate-600 text-xs leading-relaxed">Volkswagen Argentina emite la factura y asigna número de chasis.</span>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'contado' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.03em] text-[#001e50]">
                Transferencias Bancarias Seguras
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                Para tu absoluta tranquilidad, todos los pagos y gastos administrativos se canalizan por transferencias bancarias a cuentas corrientes oficiales a nombre de <strong>Autosol S.A.</strong> (CUIT: 30-68194452-9).
              </p>
            </div>
            <div className="p-4 bg-[#ece5db] border border-[#a0a3aa]/80 rounded-2xl text-xs text-[#001e50] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0040c4] shrink-0" strokeWidth={1.6} />
              <span className="leading-relaxed">
                Por política estricta de seguridad y transparencia, nunca realices transferencias a cuentas de personas físicas ni asesores comerciales independientes.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
