import React from 'react';
import {
  Clock,
  ReceiptText,
  FolderCheck,
  ShieldCheck,
  Wrench,
  CalendarCheck,
  Car,
  Info,
  ChevronRight,
  Sparkles,
  FileSignature,
} from 'lucide-react';
import { ProcessStageId } from '../types';

interface TimesSectionProps {
  onSelectStage: (stageId: ProcessStageId) => void;
  onNavigateToArticle: (slug: string) => void;
}

export const TimesSection: React.FC<TimesSectionProps> = ({
  onSelectStage,
  onNavigateToArticle,
}) => {
  const timeStages = [
    {
      id: 'cierre' as ProcessStageId,
      name: 'Cierre de Operación',
      estimatedTime: '1 a 3 días hábiles',
      whenStarts: 'Firma de boleto de reserva, seña y validación comercial inicial.',
      keyFactors: [
        'Acreditación de seña bancaria',
        'Aprobaciones crediticias previas',
        'Validación de datos del titular',
      ],
      icon: FileSignature,
      pastelBadge: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      id: 'facturacion' as ProcessStageId,
      name: 'Facturación & Chasis',
      estimatedTime: 'Según validaciones administrativas',
      whenStarts: 'Tras la aprobación de fábrica y acreditación del pago inicial o adjudicación.',
      keyFactors: [
        'Disponibilidad de cupo en terminal',
        'Acreditación de transferencias',
        'Certificados de fabricación',
      ],
      icon: ReceiptText,
      pastelBadge: 'bg-sky-100 text-sky-800 border-sky-200',
    },
    {
      id: 'gestoria' as ProcessStageId,
      name: 'Gestoría Administrativa',
      estimatedTime: 'Según legajo y jurisdicción',
      whenStarts: 'Al recibir la factura emitida con chasis y la documentación firmada del titular.',
      keyFactors: [
        'Liquidación de sellos en Rentas provinciales',
        'Certificaciones notariales de firmas',
        'Control UIF y constancias CUIT',
      ],
      icon: FolderCheck,
      pastelBadge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
    {
      id: 'patentamiento' as ProcessStageId,
      name: 'Patentamiento DNRPA',
      estimatedTime: 'Sujeto al Registro Seccional',
      whenStarts: 'Al ingresar el legajo oficial en el Registro Seccional correspondiente al domicilio o guarda habitual del titular.',
      keyFactors: [
        'Turnos del Registro Seccional por CP',
        'Entrega de chapas patente físicas',
        'Emisión del título digital y cédula',
      ],
      icon: ShieldCheck,
      pastelBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: 'preparacion' as ProcessStageId,
      name: 'Preparación Técnica (PDI)',
      estimatedTime: '2 a 5 días hábiles',
      whenStarts: 'Con la unidad en el concesionario y las placas patentes recibidas.',
      keyFactors: [
        'Inspección computarizada de 45 puntos',
        'Instalación de accesorios solicitados',
        'Acondicionamiento estético final',
      ],
      icon: Wrench,
      pastelBadge: 'bg-teal-100 text-teal-800 border-teal-200',
    },
    {
      id: 'turno' as ProcessStageId,
      name: 'Coordinación de entrega',
      estimatedTime: 'Según disponibilidad y planificación',
      whenStarts: 'Tras la aprobación completa del control de calidad del taller.',
      keyFactors: [
        'Disponibilidad horaria del cliente',
        'Capacidad de bahía de entrega',
      ],
      icon: CalendarCheck,
      pastelBadge: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'entrega' as ProcessStageId,
      name: 'Retiro en Concesionario',
      estimatedTime: '45 a 60 minutos',
      whenStarts: 'El día pactado para la entrega en el salón oficial.',
      keyFactors: [
        'Explicación técnica de la unidad',
        'Verificación de documentación y garantía',
      ],
      icon: Car,
      pastelBadge: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Editorial Volkswagen */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-[0_5px_20px_rgba(7,30,58,0.05)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[36px] border-[#e6e6e6]/60" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] text-[#0040c4] uppercase">
              Estimaciones Referenciales
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.05em] text-[#001e50]">
              Tiempos Orientativos por Etapa
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Los plazos se expresan en días hábiles administrativos y pueden variar según turnos registrales y organismos externos.
            </p>
          </div>

          <div className="bg-[#ece5db] px-4 py-2.5 rounded-full border border-slate-200/80 text-xs font-semibold text-[#001e50] flex items-center gap-2 shrink-0 self-start md:self-auto">
            <Clock className="w-4 h-4 text-[#0040c4]" />
            <span>Días hábiles administrativos</span>
          </div>
        </div>
      </div>

      {/* Grilla de Tiempos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {timeStages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 hover:border-[#a0a3aa] rounded-2xl p-5 shadow-[0_5px_18px_rgba(23,59,87,0.05)] hover:shadow-[0_12px_28px_rgba(23,97,137,0.1)] hover:-translate-y-1 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#e6e6e6] text-[#0040c4] flex items-center justify-center transition-transform group-hover:scale-105">
                    <Icon className="w-5 h-5 text-[#0040c4]" strokeWidth={1.6} />
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#ece5db] text-slate-600 border border-slate-200">
                    ⏱️ {stage.estimatedTime}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#001e50] group-hover:text-[#0040c4] transition-colors">
                    {stage.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{stage.whenStarts}</p>
                </div>

                <div className="bg-[#ece5db] rounded-xl p-3 border border-slate-100 space-y-1.5">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Factores que influyen:
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {stage.keyFactors.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#0040c4] font-bold">•</span>
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0040c4]">
                <button
                  onClick={() => onSelectStage(stage.id)}
                  className="flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Ver etapa completa</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nota de Acompañamiento */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex items-center gap-3 text-xs sm:text-sm text-slate-600">
        <Info className="w-5 h-5 text-[#0040c4] shrink-0" />
        <span className="leading-relaxed">
          <strong className="text-[#001e50]">Acompañamiento formal Autosol:</strong> Cada cliente cuenta con un gestor y asesor asignado que le comunica el avance de cada hito en tiempo y forma.
        </span>
      </div>
    </div>
  );
};
