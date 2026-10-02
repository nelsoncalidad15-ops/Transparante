import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  Filter,
  FileText,
  Tag,
  CheckCircle,
  Eye,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ContentCategory, LibraryArticle } from '../types';

interface LibraryViewProps {
  initialCategory?: string;
  onSelectArticle: (slug: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  initialCategory,
  onSelectArticle,
}) => {
  const { articles } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'Todo');

  const categories: string[] = [
    'Todo',
    'Proceso de compra',
    'Documentación',
    'Gestoría',
    'Patentamiento',
    'Facturación',
    'Entrega',
    'Financiación',
    'Tiempos y plazos',
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      if (art.status !== 'Publicado') return false;
      const matchCategory =
        selectedCategory === 'Todo' || art.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.relatedTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchQuery;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Editorial Volkswagen */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-[0_5px_20px_rgba(7,30,58,0.05)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[36px] border-[#e6e6e6]/60" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-black uppercase">
              Biblioteca Digital de Transparencia
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.05em] text-black">
              Biblioteca de Conceptos y Guías
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl">
              Accedé a definiciones claras, requisitos oficiales, tiempos y explicaciones detalladas sobre cada paso de tu compra.
            </p>
          </div>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-[0_5px_20px_rgba(7,30,58,0.04)] space-y-4">
        <div className="relative flex overflow-hidden rounded-xl border border-[#a0a3aa] bg-white p-1 shadow-[0_6px_20px_rgba(14,71,104,0.06)]">
          <input
            id="library-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por término, concepto o trámite (ej: patentamiento, seguro, gestoría)..."
            className="min-w-0 flex-1 bg-transparent px-3 text-xs sm:text-sm text-[#002244] outline-none placeholder:text-slate-400"
          />
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#002244] text-white">
            <Search className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Categoría:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
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

      {/* Grilla de Artículos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            Mostrando {filteredArticles.length}{' '}
            {filteredArticles.length === 1 ? 'guía oficial' : 'guías oficiales'}
          </span>
          {selectedCategory !== 'Todo' && (
            <button
              onClick={() => setSelectedCategory('Todo')}
              className="text-[#002244] hover:underline"
            >
              Ver todas las categorías
            </button>
          )}
        </div>

        {filteredArticles.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-200/80 p-12 text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#e6e6e6] text-[#002244] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#002244]">
              No encontramos guías con ese término
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Probá con otras palabras como "gestoría", "patentamiento", "facturación" o explorá las categorías.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todo');
              }}
              className="mt-2 text-xs font-bold text-[#002244] hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                id={`article-card-${article.slug}`}
                onClick={() => onSelectArticle(article.slug)}
                className="group bg-white border border-slate-200/80 hover:border-[#a0a3aa] rounded-2xl p-6 shadow-[0_5px_18px_rgba(23,59,87,0.05)] hover:shadow-[0_12px_28px_rgba(23,97,137,0.1)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#002244] bg-[#e6e6e6] px-2.5 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTimeMinutes} min</span>
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-[#002244] group-hover:text-[#002244] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {article.shortDesc}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-[#002244]" />
                      <span>{article.helpfulCount}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{article.viewsCount}</span>
                    </span>
                  </div>

                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-[#002244] group-hover:underline">
                    <span>Ver información</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
