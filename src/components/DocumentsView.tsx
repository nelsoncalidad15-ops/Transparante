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
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  onNavigateToArticle,
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
      title: 'Formularios e Inscripción',
      desc: 'Gestoría prepara la presentación inicial y verificación física según corresponda a tu caso.',
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
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Editorial Volkswagen */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-[0_5px_20px_rgba(7,30,58,0.05)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[36px] border-[#e6e6e6]/60" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-black uppercase">
              Requisitos Oficiales y Gestoría
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.05em] text-black">
              Documentación y Trámites
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl">
              Conocé los papeles necesarios para patentar y retirar tu 0km sin demoras ni trámites confusos.
            </p>
          </div>

          {/* Selector de Perfil Segmentado */}
          <div className="bg-[#ece5db] p-1.5 rounded-full flex items-center gap-1 border border-slate-200/80 self-start md:self-auto shrink-0">
            <button
              onClick={() => setProfileType('fisica')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                profileType === 'fisica'
                  ? 'bg-[#002244] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#002244]'
              }`}
            >
              Persona Física
            </button>
            <button
              onClick={() => setProfileType('juridica')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                profileType === 'juridica'
                  ? 'bg-[#002244] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#002244]'
              }`}
            >
              Persona Jurídica
            </button>
          </div>
        </div>
      </div>

      {/* Requisitos en Grilla Minimalista */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex items-start gap-3 text-xs sm:text-sm text-slate-600">
        <FileText className="w-5 h-5 text-[#002244] shrink-0" />
        <p className="leading-relaxed">La documentación mostrada en esta guía es orientativa. Los requisitos pueden variar según el titular, modalidad de compra, financiación, jurisdicción y características particulares de la operación. El equipo de Autosol confirmará qué documentación corresponde en cada caso.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentDocs.map((doc, idx) => {
          const Icon = doc.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 hover:border-[#a0a3aa] rounded-2xl p-5 shadow-[0_5px_18px_rgba(23,59,87,0.05)] hover:shadow-[0_12px_28px_rgba(23,97,137,0.1)] hover:-translate-y-1 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#e6e6e6] text-[#002244] flex items-center justify-center transition-transform group-hover:scale-105">
                    <Icon className="w-5 h-5 text-[#002244]" strokeWidth={1.6} />
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#ece5db] text-[#002244] border border-slate-200">
                    {doc.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#002244] group-hover:text-[#002244] transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{doc.desc}</p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-[#002244]">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-[#002244]" />
                <span>Gestoría Autosol incluida</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tarjeta de Asesoramiento Oficial */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-[0_5px_20px_rgba(7,30,58,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#e6e6e6] text-[#002244] flex items-center justify-center shrink-0 border border-[#e6e6e6]">
            <ShieldCheck className="w-6 h-6 text-[#002244]" strokeWidth={1.6} />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#002244]">
              ¿Quién confecciona la documentación oficial?
            </div>
            <div className="text-xs text-slate-600 mt-0.5 max-w-xl leading-relaxed">
              Nuestro equipo de Gestoría prepara la presentación registral y los trámites aplicables a tu caso. Solo te solicitamos la firma o certificación que corresponda a la operación.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
