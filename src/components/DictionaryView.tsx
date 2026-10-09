import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface DictionaryViewProps {
  onNavigateToArticle: (slug: string) => void;
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
    simpleDefinition: 'Emisión del comprobante de venta de la unidad. La facturación y la inscripción registral son momentos distintos.',
    example: 'La factura identifica la operación; el patentamiento inscribe el vehículo a nombre del titular.',
    pastelBadge: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  {
    id: 'gestoria',
    term: 'Gestoría',
    category: 'Gestoría',
    simpleDefinition: 'Gestión de la documentación y los trámites necesarios para presentar la inscripción del vehículo, según el caso.',
    example: 'Se revisan los datos del titular y se prepara la presentación registral que corresponda.',
    pastelBadge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  {
    id: 'patentamiento',
    term: 'Patentamiento',
    category: 'Patentamiento',
    simpleDefinition: 'Inscripción del vehículo 0km en el Registro Seccional (DNRPA) para obtener placas y cédula.',
    example: 'El Registro emite el Título Digital y la documentación registral que corresponda.',
    pastelBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'pdi',
    term: 'PDI (Control Pre-Entrega)',
    category: 'Taller / PDI',
    simpleDefinition: 'Control de preparación del vehículo previo a la entrega, según el procedimiento aplicable a la unidad.',
    example: 'Puede incluir revisión de fluidos, funcionamiento y estado general.',
    pastelBadge: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  {
    id: 'chasis-vin',
    term: 'Número de Chasis (VIN)',
    category: 'General',
    simpleDefinition: 'Código de 17 caracteres alfanuméricos que identifica legalmente a tu vehículo a nivel mundial.',
    example: 'Se usa para identificar una unidad concreta en la documentación de la operación.',
    pastelBadge: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    id: 'prenda',
    term: 'Crédito Prendario / Prenda',
    category: 'Finanzas',
    simpleDefinition: 'Garantía que afecta al vehículo hasta la cancelación del crédito, según las condiciones de la entidad financiera.',
    example: 'Al finalizar el pago del crédito se expide la cancelación de prenda formal.',
    pastelBadge: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 'formulario-01',
    term: 'Formulario 01',
    category: 'Patentamiento',
    simpleDefinition: 'Solicitud tipo oficial con la que se inscribe inicialmente el automotor 0km.',
    example: 'La modalidad de firma o petición puede variar según el trámite registral vigente.',
    pastelBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'formulario-12',
    term: 'Formulario 12 (Verificación)',
    category: 'Taller / PDI',
    simpleDefinition: 'Constancia de verificación física del automotor cuando ese control corresponde al trámite.',
    example: 'Gestoría confirma si se necesita y cómo se realiza en esa operación.',
    pastelBadge: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  {
    id: 'venta-convencional',
    term: 'Venta convencional',
    category: 'General',
    simpleDefinition: 'Compra de una unidad mediante una operación comercial acordada con el concesionario, al contado, con financiación o con una combinación de medios de pago.',
    example: 'Las condiciones concretas deben constar en la propuesta y documentación de la operación.',
    pastelBadge: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  {
    id: 'reserva',
    term: 'Reserva o seña',
    category: 'General',
    simpleDefinition: 'Pago y acuerdo inicial sujetos a las condiciones escritas de la operación. Por sí solos no significan que la unidad esté facturada o patentada.',
    example: 'Antes de pagar, pedí constancia del importe, unidad o versión, condiciones y tratamiento de la seña.',
    pastelBadge: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  {
    id: 'unidad-asignada',
    term: 'Unidad asignada',
    category: 'General',
    simpleDefinition: 'Vehículo concreto identificado para una operación; consultá si ya tiene número de chasis informado y qué condiciones faltan para facturarlo.',
    example: 'Una versión elegida o una reserva no equivalen necesariamente a un chasis asignado.',
    pastelBadge: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  {
    id: 'dominio',
    term: 'Dominio o patente',
    category: 'Patentamiento',
    simpleDefinition: 'Identificación registral que se asigna al vehículo al completar su inscripción inicial.',
    example: 'No debe confundirse con el número de chasis, que identifica la unidad desde su fabricación.',
    pastelBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'fecha-estimada',
    term: 'Fecha estimada de entrega',
    category: 'General',
    simpleDefinition: 'Previsión sujeta al estado real de la unidad, la documentación, el registro y la coordinación de entrega.',
    example: 'Una fecha estimada es una referencia y puede variar. La entrega queda confirmada cuando Autosol coordina formalmente el día y horario con el cliente.',
    pastelBadge: 'bg-sky-100 text-sky-800 border-sky-200',
  },
];

export const DictionaryView: React.FC<DictionaryViewProps> = ({
  onNavigateToArticle,
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
            <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-black uppercase">
              Glosario en Lenguaje Claro
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.05em] text-black">
              Diccionario del Comprador
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl">
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
              className="min-w-0 flex-1 bg-transparent px-3 text-xs sm:text-sm text-[#002244] outline-none placeholder:text-slate-400"
            />
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#002244] text-white">
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
                ? 'bg-[#002244] text-white border-[#002244] shadow-sm'
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
                <h3 className="text-base font-semibold text-[#002244] group-hover:text-[#002244] transition-colors">
                  {item.term}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{item.simpleDefinition}</p>
              </div>

              <div className="bg-[#ece5db] rounded-xl p-3 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                💡 <span className="font-medium text-[#002244]">Ejemplo:</span> {item.example}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
