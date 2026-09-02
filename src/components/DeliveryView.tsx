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
    <div className="space-y-6 pb-10 animate-in fade-in duration-200">
      {/* Executive Header (Frosted Glass) */}
      <div className="bg-gradient-to-r from-[#0B2265]/95 via-blue-950/95 to-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 text-teal-200 px-3 py-1 rounded-full text-xs font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Retiro de tu 0km</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Entrega del Vehículo
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-normal">
            Conocé el proceso de alistamiento técnico en taller (PDI), coordinación de turno y checklist para el día del retiro.
          </p>
        </div>
      </div>

      {/* 4 Steps Timeline Cards (Pastel Highlights) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {deliverySteps.map((item) => (
          <div
            key={item.step}
            className="bg-white/90 backdrop-blur-md border border-slate-200/80 hover:border-teal-400 rounded-3xl p-4 shadow-xs transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-xl bg-teal-900 text-white text-xs font-black flex items-center justify-center">
                  {item.step}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${item.pastelBadge}`}>
                  ⏱️ {item.time}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-teal-900 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center text-[10px] font-bold text-teal-800">
              <ShieldCheck className="w-3 h-3 mr-1" />
              <span>Protocolo oficial de calidad</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Checklist for Delivery Day */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <KeyRound className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-black text-slate-900">
              Checklist interactivo: ¿Qué traer el día de la entrega?
            </h3>
          </div>
          <span className="text-[10px] font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded-md">
            Marcá lo que ya tenés
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {clientChecklist.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 ${
                  isChecked
                    ? 'bg-teal-50 border-teal-300 text-teal-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isChecked ? 'bg-teal-700 text-white' : 'border border-slate-400 bg-white'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
