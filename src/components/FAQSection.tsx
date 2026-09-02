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
  Bot,
  Sparkles,
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface FAQSectionProps {
  onNavigateToArticle: (slug: string) => void;
  onOpenAssistant: (initialQuery?: string) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  onNavigateToArticle,
  onOpenAssistant,
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
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      {/* Executive Header (Frosted Glass) */}
      <div className="bg-gradient-to-r from-[#0B2265]/95 via-blue-950/95 to-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 text-sky-200 px-3 py-1 rounded-full text-xs font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Respuestas Claras y Directas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Preguntas Frecuentes
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-normal">
            Respuestas oficiales y sin tecnicismos complejos a las dudas más comunes durante tu proceso de compra.
          </p>
        </div>

        <button
          onClick={() => onOpenAssistant()}
          className="bg-white hover:bg-blue-50 text-[#0B2265] text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xs transition-all flex items-center space-x-2 shrink-0 self-start md:self-center cursor-pointer"
        >
          <Bot className="w-4 h-4 text-blue-700" />
          <span>Consultar al Asistente IA</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en preguntas frecuentes (ej: factura, seguro, demoras, chasis)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 text-xs sm:text-sm text-slate-800 font-medium"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center">
            <Filter className="w-3 h-3 mr-1" />
            Tema:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 p-8 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700">
              No encontramos preguntas para "{searchQuery}"
            </div>
            <button
              onClick={() => onOpenAssistant(searchQuery)}
              className="inline-flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Preguntarle a nuestro Asistente IA</span>
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white/90 backdrop-blur-md border rounded-3xl transition-all ${
                  isExpanded
                    ? 'border-blue-300 shadow-xs ring-2 ring-blue-50'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 text-xs font-black flex items-center justify-center shrink-0">
                      ?
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      {faq.question}
                    </span>
                  </div>
                  <div className="shrink-0 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 space-y-3 border-t border-slate-100">
                    <p className="leading-relaxed text-[13px] text-slate-700 pt-2 font-normal">
                      {faq.answer}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                        Categoría: {faq.category}
                      </span>

                      {faq.relatedArticleSlug && (
                        <button
                          onClick={() => onNavigateToArticle(faq.relatedArticleSlug!)}
                          className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Leer guía ampliada</span>
                          <ArrowRight className="w-3 h-3" />
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
