import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Building,
  ChevronRight,
  FileSignature,
  FileCheck,
  Sparkles,
} from 'lucide-react';

interface DocumentsViewProps {
  onNavigateToArticle: (slug: string) => void;
  onOpenAssistant: (query?: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  onNavigateToArticle,
  onOpenAssistant,
}) => {
  const [profileType, setProfileType] = useState<'fisica' | 'juridica'>('fisica');

  const docsFisica = [
    {
      title: 'DNI Original Vigente',
      desc: 'Del titular y cónyuge si está casado/a bajo régimen ganancial.',
      status: 'Obligatorio',
      statusColor: 'bg-sky-100 text-sky-800 border border-sky-200',
      icon: UserCheck,
    },
    {
      title: 'Constancia CUIT / CUIL',
      desc: 'Emitida oficialmente por AFIP o ANSES con fecha reciente.',
      status: 'Obligatorio',
      statusColor: 'bg-sky-100 text-sky-800 border border-sky-200',
      icon: FileText,
    },
    {
      title: 'Formularios 01 y 12',
      desc: 'Inscripción y verificación impresos y certificados en el concesionario.',
      status: 'Gestoría Autosol',
      statusColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      icon: FileSignature,
    },
    {
      title: 'Declaración de Fondos UIF',
      desc: 'Solo requerido cuando la operación supera los umbrales legales fijados.',
      status: 'Según Monto',
      statusColor: 'bg-amber-100 text-amber-800 border border-amber-200',
      icon: ShieldCheck,
    },
  ];

  const docsJuridica = [
    {
      title: 'Estatuto o Contrato Social',
      desc: 'Copia certificada con constancia registral en Personas Jurídicas.',
      status: 'Obligatorio',
      statusColor: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      icon: Building,
    },
    {
      title: 'Poder o Acta de Designación',
      desc: 'Acredita la representación legal y facultades de firma.',
      status: 'Obligatorio',
      statusColor: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      icon: FileCheck,
    },
    {
      title: 'DNI del Representante Legal',
      desc: 'Documento original vigente del firmante apoderado.',
      status: 'Obligatorio',
      statusColor: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      icon: UserCheck,
    },
    {
      title: 'Formulario 01 Empresa + CUIT',
      desc: 'Constancia impositiva y firma certificada por escribano público.',
      status: 'Obligatorio',
      statusColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      icon: FileSignature,
    },
  ];

  const currentDocs = profileType === 'fisica' ? docsFisica : docsJuridica;

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-200">
      {/* Executive Header (Frosted Glass) */}
      <div className="bg-gradient-to-r from-[#0B2265]/95 via-blue-950/95 to-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 text-sky-200 px-3 py-1 rounded-full text-xs font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Requisitos Oficiales</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Documentación y Trámites
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-normal">
            Conocé los papeles necesarios para patentar y retirar tu 0km sin demoras.
          </p>
        </div>

        {/* Profile Switcher */}
        <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl flex items-center space-x-1 border border-white/15 self-start md:self-center">
          <button
            onClick={() => setProfileType('fisica')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              profileType === 'fisica'
                ? 'bg-white text-[#0B2265] shadow-xs'
                : 'text-blue-100 hover:text-white'
            }`}
          >
            👤 Persona Física
          </button>
          <button
            onClick={() => setProfileType('juridica')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              profileType === 'juridica'
                ? 'bg-white text-[#0B2265] shadow-xs'
                : 'text-blue-100 hover:text-white'
            }`}
          >
            🏢 Persona Jurídica
          </button>
        </div>
      </div>

      {/* Documents Grid (Pastel and Glass Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {currentDocs.map((doc, idx) => {
          const Icon = doc.icon;
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
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${doc.statusColor}`}>
                    {doc.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-900 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{doc.desc}</p>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center text-[10px] font-bold text-emerald-700">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                <span>Gestoría Autosol incluida</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900">
              ¿Quién confecciona los formularios oficiales?
            </div>
            <div className="text-[11px] text-slate-500">
              Nuestro equipo matriculado prepara los formularios 01, 12 y 13. Solo requerimos tu firma presencial o certificada.
            </div>
          </div>
        </div>

        <button
          onClick={() => onOpenAssistant('¿Qué papeles necesito para patentar?')}
          className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          Consultar al Asistente
        </button>
      </div>
    </div>
  );
};
