import React from 'react';
import { ValidationSummaryView } from './ValidationSummaryView';

interface AdminContentViewProps {
  onExit?: () => void;
}

export const AdminContentView: React.FC<AdminContentViewProps> = ({ onExit }) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-2">
      <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-[#002244]">Ficha completa para la reunión con Administración</p>
        <p className="mt-1">Explica cada bloque de información y qué datos deben confirmarse antes de aprobarlos.</p>
        <div className="mt-3 flex flex-wrap gap-3 font-semibold text-[#002244]">
          <a className="underline" href={import.meta.env.BASE_URL + 'REVISION_PARA_ADMINISTRACION_2026-10-05.html'} target="_blank" rel="noreferrer">Abrir ficha</a>
          <a className="underline" href={import.meta.env.BASE_URL + 'REVISION_PARA_ADMINISTRACION_2026-10-05.pdf'} target="_blank" rel="noreferrer">Descargar PDF</a>
        </div>
      </div>
      <ValidationSummaryView onExit={onExit} />
    </div>
  );
};
