import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  BookOpen,
  Filter,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface FAQSectionProps {
  onNavigateToArticle: (slug: string) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  onNavigateToArticle,
}) => {
  const { faqs } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todo');
  const [expandedId, setExpandedId] = useState<string | null>(faqs[0]?.id || null);

  const categories = [
    'Todo',
    'Tiempos y plazos',
    'Facturación',
    'Gestoría',
    'Patentamiento',
    'Entrega',
    'Documentación',
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCategory =
        selectedCategory === 'Todo' || faq.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchQuery;
    });
  }, [faqs, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Editorial Volkswagen */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-[0_5px_20px_rgba(7,30,58,0.05)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[36px] border-[#e6e6e6]/60" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-black uppercase">
              Respuestas Claras y Transparentes
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.05em] text-black">
              Preguntas Frecuentes
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl">
              Respuestas directas y oficiales sin tecnicismos complejos para resolver cualquier duda durante tu operación.
            </p>
          </div>

        </div>
      </div>

      {/* Buscador y Filtros por Tema */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_5px_20px_rgba(7,30,58,0.04)] space-y-4">
        <div className="relative flex overflow-hidden rounded-xl border border-[#a0a3aa] bg-white p-1 shadow-[0_6px_20px_rgba(14,71,104,0.06)]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscá una duda (ej: factura, seguro, demoras, chasis, patentamiento)..."
            className="min-w-0 flex-1 bg-transparent px-3 text-xs sm:text-sm text-[#002244] outline-none placeholder:text-slate-400"
          />
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#002244] text-white">
            <Search className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Tema:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#002244] text-white border-[#002244] shadow-sm'
                    : 'bg-[#ece5db] hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Listado de Preguntas */}
      <div className="space-y-3.5">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-200/80 p-8 text-center space-y-3 shadow-2xs">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-semibold text-slate-700">
              No encontramos respuestas para "{searchQuery}"
            </div>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all bg-white ${
                  isExpanded
                    ? 'border-[#002244] shadow-[0_8px_24px_rgba(14,71,104,0.08)] ring-2 ring-[#e6e6e6]'
                    : 'border-slate-200/80 hover:border-[#a0a3aa] shadow-[0_3px_12px_rgba(23,59,87,0.03)]'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-lg bg-[#e6e6e6] text-[#002244] text-xs font-bold flex items-center justify-center shrink-0">
                      ?
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-[#002244]">
                      {faq.question}
                    </span>
                  </div>
                  <div className="shrink-0 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#002244]" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 space-y-3.5 border-t border-slate-100">
                    <p className="leading-relaxed pt-2">
                      {faq.answer}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-[#ece5db] px-2.5 py-1 rounded-full border border-slate-200">
                        {faq.category}
                      </span>

                      {faq.relatedArticleSlug && (
                        <button
                          onClick={() => onNavigateToArticle(faq.relatedArticleSlug!)}
                          className="text-xs font-semibold text-[#002244] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Leer guía ampliada</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
