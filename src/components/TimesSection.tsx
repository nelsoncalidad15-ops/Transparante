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
      estimatedTime: '3 a 7 días hábiles',
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
      estimatedTime: '7 a 15 días hábiles',
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
      estimatedTime: '15 a 30 días hábiles',
      whenStarts: 'Al ingresar el legajo oficial en el Registro Seccional según el domicilio fiscal.',
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
      name: 'Coordinación de Turno',
      estimatedTime: '1 a 3 días hábiles',
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
    <div className="space-y-6 pb-10 animate-in fade-in duration-200">
      {/* Executive Header (Frosted Glass) */}
      <div className="bg-gradient-to-r from-[#0B2265]/95 via-blue-950/95 to-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Estimaciones Referenciales</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tiempos Orientativos por Etapa
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-normal">
            Los plazos se expresan en días hábiles administrativos y pueden variar según organismos externos.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-xs text-blue-100 flex items-center space-x-2 shrink-0">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>Días hábiles administrativos</span>
        </div>
      </div>

      {/* Grid of Stages with Pastel Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {timeStages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-md border border-slate-200/80 hover:border-blue-400 rounded-3xl p-4 shadow-xs transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-blue-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4 text-blue-700" />
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${stage.pastelBadge}`}>
                    ⏱️ {stage.estimatedTime}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-900 transition-colors">
                    {stage.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">{stage.whenStarts}</p>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-200/70 space-y-1">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Factores que influyen:
                  </div>
                  <ul className="space-y-0.5 text-[11px] text-slate-600">
                    {stage.keyFactors.map((f, i) => (
                      <li key={i} className="flex items-center space-x-1.5">
                        <span className="text-blue-600">•</span>
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
                <button
                  onClick={() => onSelectStage(stage.id)}
                  className="flex items-center space-x-1 hover:text-blue-900 cursor-pointer"
                >
                  <span>Ver etapa</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory Note */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-4 shadow-xs flex items-center space-x-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          <strong>Compromiso Autosol:</strong> Cada cliente cuenta con un gestor y asesor asignado que le comunica el avance formal en cada hito del proceso.
        </span>
      </div>
    </div>
  );
};
