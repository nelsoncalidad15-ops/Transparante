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
}

export const FinancingView: React.FC<FinancingViewProps> = ({
  onNavigateToArticle,
}) => {
  // Modo actual: 100% Venta Convencional / Tradicional
  const [selectedMethod, setSelectedMethod] = useState<'prendario' | 'contado'>('prendario');

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Editorial Volkswagen */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-[0_5px_20px_rgba(7,30,58,0.05)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[36px] border-[#e6e6e6]/60" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-black uppercase">
              Venta Tradicional Convencional • Canales Oficiales
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.05em] text-black">
              Financiación y Pagos
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl">
              Conocé cómo operan los créditos prendarios y las transferencias bancarias oficiales para la adquisición de tu 0km en Autosol.
            </p>
          </div>
        </div>
      </div>

      {/* Selector de Modalidad - Venta Convencional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Modalidad 1: Crédito Prendario */}
        <div
          onClick={() => setSelectedMethod('prendario')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedMethod === 'prendario'
              ? 'bg-[#ece5db] border-[#002244] shadow-[0_8px_24px_rgba(14,71,104,0.09)] ring-2 ring-[#e6e6e6]'
              : 'bg-white border-slate-200/80 hover:border-[#a0a3aa] shadow-[0_5px_18px_rgba(23,59,87,0.04)] hover:-translate-y-0.5'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#e6e6e6] text-[#002244] flex items-center justify-center">
                <BadgePercent className="w-5 h-5 text-[#002244]" strokeWidth={1.6} />
              </div>
              <span className="text-[11px] font-semibold bg-white text-[#002244] px-3 py-1 rounded-full border border-slate-200">
                Condiciones según propuesta crediticia vigente
              </span>
            </div>
            <h3 className="text-base font-semibold text-[#002244]">Crédito Prendario Bancario</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Financiación prendaria sujeta a aprobación y a las condiciones de la entidad financiera interviniente.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-200/70 text-xs font-semibold text-[#002244]">
            {selectedMethod === 'prendario' ? '● Seleccionado actualmente' : 'Ver requisitos y pasos →'}
          </div>
        </div>

        {/* Modalidad 2: Transferencia Bancaria Contado */}
        <div
          onClick={() => setSelectedMethod('contado')}
          className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedMethod === 'contado'
              ? 'bg-[#ece5db] border-[#002244] shadow-[0_8px_24px_rgba(14,71,104,0.09)] ring-2 ring-[#e6e6e6]'
              : 'bg-white border-slate-200/80 hover:border-[#a0a3aa] shadow-[0_5px_18px_rgba(23,59,87,0.04)] hover:-translate-y-0.5'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#e6e6e6] text-[#002244] flex items-center justify-center">
                <Landmark className="w-5 h-5 text-[#002244]" strokeWidth={1.6} />
              </div>
              <span className="text-[11px] font-semibold bg-white text-[#002244] px-3 py-1 rounded-full border border-slate-200">
                Cuentas Oficiales
              </span>
            </div>
            <h3 className="text-base font-semibold text-[#002244]">Transferencia Oficial (Contado)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Las transferencias vinculadas a la operación deben realizarse utilizando los datos bancarios oficiales informados por Autosol.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-200/70 text-xs font-semibold text-[#002244]">
            {selectedMethod === 'contado' ? '● Seleccionado actualmente' : 'Ver requisitos y pasos →'}
          </div>
        </div>
      </div>

      {/* Detalle de la Modalidad Seleccionada */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-[0_5px_20px_rgba(7,30,58,0.04)] space-y-5">
        {selectedMethod === 'prendario' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.03em] text-[#002244]">
                ¿Cómo funciona el Crédito Prendario?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                La financiación prendaria está sujeta a aprobación y a las condiciones de la entidad financiera interviniente. El vehículo queda afectado a una prenda hasta la cancelación del crédito.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#ece5db] p-4 rounded-2xl border border-slate-200/70 text-xs space-y-1">
                <strong className="text-[#002244] block font-semibold text-sm">1. Aprobación Crediticia</strong>
                <span className="text-slate-600 text-xs leading-relaxed">La entidad puede solicitar documentación adicional sobre ingresos, estado civil o un cotitular, según cada caso.</span>
              </div>
              <div className="bg-[#ece5db] p-4 rounded-2xl border border-slate-200/70 text-xs space-y-1">
                <strong className="text-[#002244] block font-semibold text-sm">2. Firma de Contrato</strong>
                <span className="text-slate-600 text-xs leading-relaxed">Firma de la documentación crediticia y registral que corresponda.</span>
              </div>
              <div className="bg-[#ece5db] p-4 rounded-2xl border border-slate-200/70 text-xs space-y-1">
                <strong className="text-[#002244] block font-semibold text-sm">3. Inscripción Registral</strong>
                <span className="text-slate-600 text-xs leading-relaxed">DNRPA inscribe el dominio a tu nombre y la prenda simultáneamente.</span>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'contado' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.03em] text-[#002244]">
                Transferencias Bancarias Seguras
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                Las transferencias vinculadas a la operación deben realizarse utilizando los datos bancarios oficiales informados por <strong>Autosol S.R.L.</strong> La cuenta de origen debe corresponder a uno de los titulares. Si los fondos provienen de un tercero, consultá previamente con Administración, ya que puede requerirse documentación respaldatoria adicional.
              </p>
            </div>
            <div className="p-4 bg-[#ece5db] border border-[#a0a3aa]/80 rounded-2xl text-xs text-[#002244] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#002244] shrink-0" strokeWidth={1.6} />
              <span className="leading-relaxed">
                No realices transferencias a cuentas personales de asesores o terceros que no hayan sido informadas oficialmente por Autosol.
              </span>
            </div>
          </div>
        )}

        {selectedMethod === 'prendario' && (
          <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h3 className="text-lg font-semibold text-[#002244]">Si tu financiación es con VW Financial</h3>
            <p>En las operaciones financiadas mediante VW Financial, la entidad puede solicitar documentación adicional de acuerdo con el análisis crediticio y la situación particular del solicitante.</p>
            <p>Al momento de la entrega se informa al cliente la documentación y los datos necesarios para gestionar el pago de su financiación, según las condiciones vigentes de su contrato.</p>
            <p>VW Financial dispone de canales digitales para que el cliente consulte información relacionada con su crédito, vencimientos, pagos, seguro y medios de contacto.</p>
            <p>El seguro deberá ajustarse a las condiciones previstas para esa financiación.</p>
          </div>
        )}

        {/* 
          MÓDULO AUTORAHORRO VOLKSWAGEN (DESACTIVADO TEMPORALMENTE - RESERVADO PARA FASE 2)
          Nota técnica: El código para la modalidad 'plan' (adjudicación mensual, licitación, cambio de modelo y facturación terminal)
          se mantiene preservado en el repositorio para cuando se active el módulo especializado de planes de ahorro.
        */}
      </div>
    </div>
  );
};
