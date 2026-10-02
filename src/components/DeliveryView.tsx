import React, { useState } from 'react';
import {
  Car,
  CalendarCheck,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';

interface DeliveryViewProps {
  onNavigateToArticle: (slug: string) => void;
  onOpenAssistant: (query?: string) => void;
}

export const DeliveryView: React.FC<DeliveryViewProps> = ({
  onNavigateToArticle,
  onOpenAssistant,
}) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deliverySteps = [
    {
      step: 1,
      title: 'Alistamiento PDI (Taller)',
      time: '2 a 3 días hábiles',
      desc: 'Lavado integral, retiro de protecciones de fábrica y checklist computarizado de 45 puntos mecánicos.',
      pastelBadge: 'bg-teal-100 text-teal-800 border-teal-200',
    },
    {
      step: 2,
      title: 'Recepción de Placas',
      time: '1 a 2 días hábiles',
      desc: 'El Registro Seccional emite las chapas patente físicas y el título digital del automotor.',
      pastelBadge: 'bg-sky-100 text-sky-800 border-sky-200',
    },
    {
      step: 3,
      title: 'Coordinación de Turno',
      time: '24 a 48 hs',
      desc: 'Tu asesor te contacta para agendar día y hora exacta en la sala exclusiva de entregas.',
      pastelBadge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
    {
      step: 4,
      title: 'Retiro y Llave en Mano',
      time: 'Aprox. 45 min',
      desc: 'Explicación del equipamiento, entrega de 2 llaves con código, manuales y firma de conformidad.',
      pastelBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
  ];

  const clientChecklist = [
    { id: 'dni', text: 'DNI original vigente del titular (y cónyuge si aplica)' },
    { id: 'seguro', text: 'Certificado de póliza de seguro automotor emitido' },
    { id: 'pago', text: 'Comprobante de saldo o gastos administrativos cancelados' },
    { id: 'app', text: 'App "Mi Argentina" descargada para visualizar cédula digital' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Editorial Volkswagen */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-[0_5px_20px_rgba(7,30,58,0.05)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[36px] border-[#e6e6e6]/60" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-black uppercase">
              Retiro y Día de la Entrega
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.05em] text-black">
              Entrega del Vehículo
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl">
              Conocé el proceso de alistamiento técnico en taller (PDI), coordinación de turno y checklist para el día del retiro.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pasos de Preparación y Entrega */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {deliverySteps.map((item) => (
          <div
            key={item.step}
            className="bg-white border border-slate-200/80 hover:border-[#a0a3aa] rounded-2xl p-5 shadow-[0_5px_18px_rgba(23,59,87,0.05)] hover:shadow-[0_12px_28px_rgba(23,97,137,0.1)] hover:-translate-y-1 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#002244] text-white text-xs font-bold flex items-center justify-center">
                  0{item.step}
                </span>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#ece5db] text-slate-600 border border-slate-200">
                  ⏱️ {item.time}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#002244] group-hover:text-[#002244] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-[#002244]">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#002244]" />
              <span>Protocolo oficial de calidad</span>
            </div>
          </div>
        ))}
      </div>

      {/* Checklist Interactivo para el Retiro */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-[0_5px_20px_rgba(7,30,58,0.04)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e6e6e6] text-[#002244] flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-[#002244]" strokeWidth={1.6} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold tracking-[-0.03em] text-[#002244]">
                Checklist interactivo: ¿Qué traer el día de la entrega?
              </h3>
              <p className="text-xs text-slate-500">Marcá cada elemento para verificar que tu legajo esté completo</p>
            </div>
          </div>
          <span className="text-xs font-semibold bg-[#e6e6e6] text-[#002244] px-3 py-1 rounded-full self-start sm:self-auto">
            Verificación Rápida
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {clientChecklist.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  isChecked
                    ? 'bg-[#ece5db] border-[#002244] text-[#002244] font-semibold shadow-2xs'
                    : 'bg-white border-slate-200/80 text-slate-600 hover:border-[#a0a3aa]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isChecked ? 'bg-[#002244] text-white' : 'border border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className="text-xs sm:text-sm leading-relaxed">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
