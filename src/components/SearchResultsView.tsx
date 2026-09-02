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
    const q = query.toLowerCase();
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  }, [faqs, query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onNewSearch(query.trim());
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Search Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="search-view-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en Autosol Transparente..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 font-medium"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
          >
            Buscar
          </button>
        </form>

        {/* Filter Facet Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-bold text-slate-400 uppercase mr-1 shrink-0 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Filtrar:
          </span>
          {filterTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedType === type
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Resultados para <span className="text-blue-700">“{query}”</span>
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Se encontraron {results.length} resultados oficiales organizados por relevancia.
          </p>
        </div>
      </div>

      {/* Results List */}
      {results.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              No encontramos resultados exactos para “{query}”
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Te sugerimos probar con términos como: <strong>patentamiento</strong>,{' '}
              <strong>gestoría</strong>, <strong>facturación</strong> o <strong>tiempos</strong>.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              className="group bg-white border border-slate-200/90 hover:border-blue-300 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    {item.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{item.category}</span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
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
