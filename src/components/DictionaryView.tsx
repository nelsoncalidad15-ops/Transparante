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
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Editorial Volkswagen */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-[0_5px_20px_rgba(7,30,58,0.05)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[36px] border-[#e6e6e6]/60" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] text-[#0040c4] uppercase">
              Glosario en Lenguaje Claro
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.05em] text-[#001e50]">
              Diccionario del Comprador
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Definiciones sencillas para comprender cada término técnico, registral o financiero sin complicaciones.
            </p>
          </div>

          {/* Buscador de Término */}
          <div className="relative w-full md:w-80 flex overflow-hidden rounded-xl border border-[#a0a3aa] bg-white p-1 shadow-[0_6px_20px_rgba(14,71,104,0.06)] self-start md:self-auto shrink-0">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar término (ej. VIN, PDI)..."
              className="min-w-0 flex-1 bg-transparent px-3 text-xs sm:text-sm text-[#001e50] outline-none placeholder:text-slate-400"
            />
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0040c4] text-white">
              <Search className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Categorías en Píldoras */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-[#001e50] text-white border-[#001e50] shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-[#a0a3aa]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grilla de Términos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredTerms.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/80 hover:border-[#a0a3aa] rounded-2xl p-5 shadow-[0_5px_18px_rgba(23,59,87,0.05)] hover:shadow-[0_12px_28px_rgba(23,97,137,0.1)] hover:-translate-y-1 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#ece5db] text-slate-600 border border-slate-200">
                  {item.category}
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#001e50] group-hover:text-[#0040c4] transition-colors">
                  {item.term}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{item.simpleDefinition}</p>
              </div>

              <div className="bg-[#ece5db] rounded-xl p-3 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                💡 <span className="font-medium text-[#001e50]">Ejemplo:</span> {item.example}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onOpenAssistant(`¿Qué significa ${item.term}?`)}
                className="text-xs font-semibold text-[#0040c4] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Consultar con el asistente</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
