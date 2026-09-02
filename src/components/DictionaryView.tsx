import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface DictionaryViewProps {
  onNavigateToArticle: (slug: string) => void;
  onOpenAssistant: (query?: string) => void;
}

interface TermItem {
  id: string;
  term: string;
  category: 'Gestoría' | 'Patentamiento' | 'Finanzas' | 'Taller / PDI' | 'General';
  simpleDefinition: string;
  example: string;
  pastelBadge: string;
}

const termsData: TermItem[] = [
  {
    id: 'facturacion',
    term: 'Facturación',
    category: 'General',
    simpleDefinition: 'Emisión de la factura oficial que asigna legalmente el chasis y motor de la unidad a tu nombre.',
    example: 'A partir de este hito tu unidad pasa al sector de gestoría administrativa.',
    pastelBadge: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  {
    id: 'gestoria',
    term: 'Gestoría',
    category: 'Gestoría',
    simpleDefinition: 'Equipo matriculado que elabora los formularios (01, 12, 13) y liquida los aranceles ante el Registro Automotor.',
    example: 'Revisan tu DNI, estado civil y constancia impositiva para evitar observaciones.',
    pastelBadge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  {
    id: 'patentamiento',
    term: 'Patentamiento',
    category: 'Patentamiento',
    simpleDefinition: 'Inscripción del vehículo 0km en el Registro Seccional (DNRPA) para obtener placas y cédula.',
    example: 'El registro emite el título digital del automotor y las placas metálicas.',
    pastelBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'pdi',
    term: 'PDI (Control Pre-Entrega)',
    category: 'Taller / PDI',
    simpleDefinition: 'Inspección técnica computarizada obligatoria de 45 puntos antes de entregarte la llave.',
    example: 'Garantiza fluidos, alineación, software y batería en estado impecable.',
    pastelBadge: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  {
    id: 'chasis-vin',
    term: 'Número de Chasis (VIN)',
    category: 'General',
    simpleDefinition: 'Código de 17 caracteres alfanuméricos que identifica legalmente a tu vehículo a nivel mundial.',
    example: 'Figura en tu factura oficial, cristales grabados y cédula de identificación.',
    pastelBadge: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    id: 'prenda',
    term: 'Crédito Prendario / Prenda',
    category: 'Finanzas',
    simpleDefinition: 'Garantía legal asentada en el legajo que respalda el saldo financiado hasta completar las cuotas.',
    example: 'Al finalizar el pago del crédito se expide la cancelación de prenda formal.',
    pastelBadge: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 'formulario-01',
    term: 'Formulario 01',
    category: 'Patentamiento',
    simpleDefinition: 'Solicitud tipo oficial con la que se inscribe inicialmente el automotor 0km.',
    example: 'Lo firma el titular en el concesionario o ante escribano público.',
    pastelBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'formulario-12',
    term: 'Formulario 12 (Verificación)',
    category: 'Taller / PDI',
    simpleDefinition: 'Verificación policial que certifica la autenticidad física de los números de chasis y motor grabados.',
    example: 'Realizada por peritos oficiales para dar curso al patentamiento.',
    pastelBadge: 'bg-teal-100 text-teal-800 border-teal-200',
  },
];

export const DictionaryView: React.FC<DictionaryViewProps> = ({
  onNavigateToArticle,
  onOpenAssistant,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'General', 'Gestoría', 'Patentamiento', 'Finanzas', 'Taller / PDI'];

  const filteredTerms = termsData.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.simpleDefinition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-200">
      {/* Executive Header (Frosted Glass) */}
      <div className="bg-gradient-to-r from-[#0B2265]/95 via-blue-950/95 to-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 text-purple-200 px-3 py-1 rounded-full text-xs font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Glosario en Lenguaje Claro</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Diccionario del Comprador
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-normal">
            Definiciones sencillas para comprender cada término técnico, registral o financiero sin complicaciones.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72 self-start md:self-center">
          <Search className="w-4 h-4 text-white/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar término (ej. VIN, PDI)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-2xl text-xs text-white placeholder-blue-200/60 focus:outline-hidden focus:ring-2 focus:ring-white/40 backdrop-blur-md"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto pb-1 gap-1.5 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white/80 border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredTerms.map((item) => (
          <div
            key={item.id}
            className="bg-white/90 backdrop-blur-md border border-slate-200/80 hover:border-purple-300 rounded-3xl p-4 shadow-xs transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${item.pastelBadge}`}>
                  {item.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-purple-900 transition-colors">
                  {item.term}
                </h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{item.simpleDefinition}</p>
              </div>

              <div className="bg-slate-50/80 rounded-2xl p-2.5 border border-slate-200/70 text-[10px] text-slate-500 italic">
                💡 {item.example}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onOpenAssistant(`¿Qué significa ${item.term}?`)}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center space-x-1 cursor-pointer"
              >
                <span>Preguntar al asistente</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
