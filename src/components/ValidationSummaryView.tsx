import React, { useState } from 'react';
import {
  Printer,
  CheckCircle2,
  FileCheck2,
  Clock,
  CarFront,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  Download,
  Copy,
  Check,
  Building,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const ValidationSummaryView: React.FC = () => {
  const { stages, faqs, articles, siteTexts } = useData();
  const [copied, setCopied] = useState(false);
  const [validatedSections, setValidatedSections] = useState<{ [key: string]: boolean }>({});

  const toggleValidate = (key: string) => {
    setValidatedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const summary = `FICHA DE VALIDACIÓN OPERATIVA - AUTOSOL TRANSPARENTE
Fecha: ${new Date().toLocaleDateString('es-AR')}

1. ETAPAS DEL PROCESO (${stages.length} etapas):
${stages.map((s) => `- ${s.stepNumber}. ${s.name}: ${s.estimatedTime} (${s.shortDesc})`).join('\n')}

2. DOCUMENTACIÓN EXIGIDA:
- Personas Físicas: DNI original, Constancia CUIT/CUIL, Formularios 01 y 12, Declaración UIF.
- Personas Jurídicas: Estatuto Social certificado, Actas de designación, Poderes vigentes.

3. PREGUNTAS FRECUENTES Y BOT (${faqs.length} preguntas):
${faqs.map((f, i) => `${i + 1}. ${f.question} -> ${f.answer}`).join('\n\n')}
`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Banner with Print / Export Actions */}
      <div className="rounded-3xl bg-[#001e50] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-sky-300 bg-blue-950/80 px-3 py-1 rounded-full uppercase tracking-wider">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Ficha de Validación Operativa • Venta Tradicional</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Resumen Integral para Validación con Administración
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl font-normal leading-relaxed">
            Revisá junto al responsable administrativo punto por punto la exactitud de plazos,
            trámites de gestoría, formularios requeridos y respuestas que el cliente ve en la web para <strong>Venta Convencional (Contado y Crédito Prendario)</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleCopyText}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado' : 'Copiar Resumen'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 rounded-xl bg-[#0040c4] hover:bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar PDF</span>
          </button>
        </div>
      </div>

      {/* Scope Alert Badge */}
      <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-3 text-xs text-sky-900 print:bg-slate-50 print:border-slate-300">
        <UserCheck className="w-5 h-5 text-[#0040c4] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-bold text-sky-950 block text-xs">
            Alcance Exclusivo: Operaciones de Venta Tradicional / Convencional 0km
          </strong>
          <span className="text-slate-600 leading-relaxed block">
            Esta ficha técnica abarca exclusivamente ventas de salón bajo modalidad de pago contado/transferencia oficial y créditos prendarios bancarios. 
            Los procesos relativos a <strong>Autoahorro Volkswagen</strong> (sorteos, licitaciones y adjudicaciones) están deliberadamente separados y se gestionarán en su propio módulo independiente.
          </span>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-slate-800 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header (Visible in print) */}
        <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#0040c4] uppercase block">
              Volkswagen Autosol Jujuy • Calidad y Operaciones
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Ficha de Conformidad de Contenidos Públicos — Venta Convencional
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Fecha de emisión: {new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })} • Alcance: Venta Tradicional 0km
            </p>
          </div>
          <div className="hidden sm:block text-right text-xs text-slate-400">
            <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold">
              Versión Tradicional 2.5
            </span>
          </div>
        </div>

        {/* 1. SECCIÓN: LAS 7 ETAPAS Y PLAZOS ORIENTATIVOS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#0040c4]" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                1. Las 7 Etapas del Proceso y Plazos Informados
              </h3>
            </div>
            <button
              onClick={() => toggleValidate('etapas')}
              className={`text-xs font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                validatedSections['etapas']
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-400'
              }`}
            >
              {validatedSections['etapas'] ? 'Validado con Administrativo ✅' : 'Marcar como validado'}
            </button>
          </div>

          <div className="space-y-3">
            {stages.map((stage) => (
              <div key={stage.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#001e50] text-[10px] font-bold text-white">
                      {stage.stepNumber}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{stage.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#0040c4] bg-blue-50 px-2.5 py-0.5 rounded-md self-start sm:self-auto border border-blue-100">
                    Plazo informado: {stage.estimatedTime}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  <strong>Definición al cliente:</strong> {stage.definition}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="font-semibold text-slate-700 block">Qué sucede:</span>
                    <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5 pl-1">
                      {stage.whatHappens.map((wh, idx) => (
                        <li key={idx}>{wh}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700 block">Factores que pueden demorar:</span>
                    <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5 pl-1">
                      {stage.timeFactors.map((tf, idx) => (
                        <li key={idx}>{tf}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. SECCIÓN: DOCUMENTACIÓN REQUERIDA */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-5 h-5 text-[#0040c4]" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                2. Documentación y Trámites Requeridos
              </h3>
            </div>
            <button
              onClick={() => toggleValidate('documentacion')}
              className={`text-xs font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                validatedSections['documentacion']
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-400'
              }`}
            >
              {validatedSections['documentacion'] ? 'Validado con Administrativo ✅' : 'Marcar como validado'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#0040c4]" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Personas Físicas (Titulares particulares)
                </h4>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li><strong>DNI Original Vigente:</strong> Del titular (y cónyuge si aplica régimen ganancial).</li>
                <li><strong>Constancia CUIT / CUIL:</strong> Emitida por AFIP o ANSES.</li>
                <li><strong>Formularios 01 y 12:</strong> Certificados por escribano o gestoría de concesionario.</li>
                <li><strong>Declaración de Fondos UIF:</strong> Solo si el importe total supera los umbrales legales.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#0040c4]" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Personas Jurídicas (Empresas / Sociedades)
                </h4>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li><strong>Estatuto Social / Contrato:</strong> Copia certificada inscripta en Registro Público.</li>
                <li><strong>Acta de Designación de Autoridades:</strong> Vigente y firmada.</li>
                <li><strong>Poderes de Representación:</strong> Notariales con facultades para registrar vehículos.</li>
                <li><strong>Constancia de CUIT y Exenciones:</strong> En caso de solicitar exención de sellos provinciales.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. SECCIÓN: PROTOCOLO DEL DÍA DE LA ENTREGA */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <CarFront className="w-5 h-5 text-[#0040c4]" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                3. Protocolo de Entrega del Vehículo
              </h3>
            </div>
            <button
              onClick={() => toggleValidate('entrega')}
              className={`text-xs font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                validatedSections['entrega']
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-400'
              }`}
            >
              {validatedSections['entrega'] ? 'Validado con Administrativo ✅' : 'Marcar como validado'}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="font-bold text-slate-900 block">Paso 1: Alistamiento PDI</span>
                <span className="text-slate-500 text-[11px]">2 a 3 días hábiles en taller oficial</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="font-bold text-slate-900 block">Paso 2: Recepción de Placas</span>
                <span className="text-slate-500 text-[11px]">Chapas metálicas y título digital DNRPA</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="font-bold text-slate-900 block">Paso 3: Coordinación de Turno</span>
                <span className="text-slate-500 text-[11px]">Agendamiento en sala exclusiva de entregas</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="font-bold text-slate-900 block">Paso 4: Retiro de Unidad</span>
                <span className="text-slate-500 text-[11px]">45 min: llaves, manuales y seguro activo</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SECCIÓN: PREGUNTAS FRECUENTES Y RESPUESTAS DEL BOT */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-[#0040c4]" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                4. Respuestas Oficiales a Preguntas Frecuentes ({faqs.length} ítems)
              </h3>
            </div>
            <button
              onClick={() => toggleValidate('faqs')}
              className={`text-xs font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                validatedSections['faqs']
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-400'
              }`}
            >
              {validatedSections['faqs'] ? 'Validado con Administrativo ✅' : 'Marcar como validado'}
            </button>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, i) => (
              <div key={faq.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-900">
                  {i + 1}. {faq.question}
                </p>
                <p className="text-slate-600 leading-relaxed font-normal">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. SECCIÓN DE FIRMA Y CONFORMIDAD ADMINISTRATIVA */}
        <section className="border-t-2 border-dashed border-slate-300 pt-6 space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Acta de Conformidad y Validación Operativa
          </h4>
          <p className="text-xs text-slate-500">
            El presente documento certifica que los plazos, requisitos de gestoría, documentación solicitada y
            respuestas publicadas han sido revisados y autorizados por el área administrativa del concesionario.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className="border-t border-slate-400 pt-2 text-xs">
              <span className="font-bold block text-slate-800">Responsable Administrativo</span>
              <span className="text-slate-400 text-[11px]">Nombre, Apellido y Legajo</span>
            </div>

            <div className="border-t border-slate-400 pt-2 text-xs">
              <span className="font-bold block text-slate-800">Área / Sector</span>
              <span className="text-slate-400 text-[11px]">Gestoría / Calidad / Administración</span>
            </div>

            <div className="border-t border-slate-400 pt-2 text-xs">
              <span className="font-bold block text-slate-800">Firma y Sello</span>
              <span className="text-slate-400 text-[11px]">Fecha de conformidad: ____ / ____ / 2026</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
