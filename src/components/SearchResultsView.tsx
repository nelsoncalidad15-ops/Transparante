import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Car,
  Clock,
  ChevronDown,
  ChevronUp,
  Tag,
  Sparkles,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { matchesSearch, normalizeSearchText } from '../utils/search';

interface SearchResultsViewProps {
  initialQuery: string;
  onNavigateToArticle: (slug: string) => void;
  onNavigateToStage: (stageId: string) => void;
  onNewSearch: (query: string) => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  initialQuery,
  onNavigateToArticle,
  onNavigateToStage,
  onNewSearch,
}) => {
  const { searchAll, faqs, recordSearchQuery } = useData();
  const [query, setQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState<string>('Todo');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const lastRecordedQueryRef = useRef<string>('');

  const filterTypes = [
    'Todo',
    'Preguntas frecuentes',
    'Artículos',
    'Etapas del proceso',
    'Documentación',
    'Tiempos',
  ];

  const results = useMemo(() => {
    return searchAll(query, selectedType);
  }, [query, selectedType, searchAll]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed && lastRecordedQueryRef.current !== trimmed) {
      lastRecordedQueryRef.current = trimmed;
      recordSearchQuery(trimmed, results.length);
    }
  }, [query, results.length, recordSearchQuery]);

  const relatedFaqs = useMemo(() => {
    if (!normalizeSearchText(query)) return [];
    return faqs.filter((f) => matchesSearch(query, [f.question, f.answer, f.category]));
  }, [faqs, query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onNewSearch(query.trim());
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Top Search Header */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-[0_5px_20px_rgba(7,30,58,0.04)] space-y-5">
        <div className="max-w-2xl">
          <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-black uppercase">
            Búsqueda Integral de Información
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-[-0.04em] text-black">
            Resultados para <span>“{query}”</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
            Se encontraron {results.length} resultados oficiales organizados por relevancia.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative flex overflow-hidden rounded-xl border border-[#a0a3aa] bg-white p-1 shadow-[0_6px_20px_rgba(14,71,104,0.06)]">
          <input
            id="search-view-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en Autosol Transparente..."
            className="min-w-0 flex-1 bg-transparent px-3 text-xs sm:text-sm text-[#002244] outline-none placeholder:text-slate-400 font-medium"
          />
          <button
            type="submit"
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#002244] px-4 text-xs font-bold text-white transition-colors hover:bg-[#002244] hover:brightness-125"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Buscar</span>
          </button>
        </form>

        {/* Filter Facet Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filtrar:
          </span>
          {filterTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                selectedType === type
                  ? 'bg-[#002244] text-white border-[#002244] shadow-sm'
                  : 'bg-[#ece5db] hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      {results.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200/80 p-12 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#e6e6e6] text-[#002244] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-[#002244]">
              No encontramos resultados para “{query}”
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Te sugerimos probar con términos como: <strong>patentamiento</strong>,{' '}
              <strong>gestoría</strong>, <strong>facturación</strong> o <strong>tiempos</strong>.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.urlOrSlug.startsWith('article:')) {
                  onNavigateToArticle(item.urlOrSlug.replace('article:', ''));
                } else if (item.urlOrSlug.startsWith('stage:')) {
                  onNavigateToStage(item.urlOrSlug.replace('stage:', ''));
                } else if (item.urlOrSlug.startsWith('faq:')) {
                  setExpandedFaqId(item.id);
                }
              }}
              className="group bg-white border border-slate-200/80 hover:border-[#a0a3aa] rounded-2xl p-5 shadow-[0_5px_18px_rgba(23,59,87,0.05)] hover:shadow-[0_12px_28px_rgba(23,97,137,0.1)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#002244] bg-[#e6e6e6] px-2.5 py-0.5 rounded-full">
                    {item.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{item.category}</span>
                </div>

                <h3 className="text-base font-semibold text-[#002244] group-hover:text-[#002244] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {item.estimatedTime ? (
                  <span className="text-[11px] font-semibold text-blue-900 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span>{item.estimatedTime}</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Guía oficial</span>
                )}

                <span className="text-xs font-bold text-blue-600 group-hover:text-blue-800 flex items-center space-x-1">
                  <span>Ver detalle</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Otras preguntas relacionadas Accordion Section */}
      {relatedFaqs.length > 0 && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base sm:text-lg">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>Preguntas frecuentes relacionadas</span>
          </div>

          <div className="divide-y divide-slate-100">
            {relatedFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div key={faq.id} className="py-3.5 space-y-2">
                  <button
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {faq.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 leading-relaxed animate-in fade-in">
                      <p>{faq.answer}</p>
                      {faq.relatedArticleSlug && (
                        <div className="pt-2 mt-2 border-t border-slate-200/50">
                          <button
                            onClick={() => onNavigateToArticle(faq.relatedArticleSlug!)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1"
                          >
                            <span>Leer artículo completo sobre este tema</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
