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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Biblioteca Digital de Transparencia</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Biblioteca de Conceptos y Guías
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl font-normal leading-relaxed">
          Accedé a definiciones claras, requisitos oficiales, tiempos y explicaciones detalladas
          sobre cada paso de tu compra.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="library-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por término, concepto o trámite (ej: patentamiento, flete, seguro)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 text-sm text-slate-800"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-bold text-slate-400 uppercase mr-1 shrink-0 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Categoría:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Visual Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            Mostrando {filteredArticles.length}{' '}
            {filteredArticles.length === 1 ? 'guía oficial' : 'guías oficiales'}
          </span>
          {selectedCategory !== 'Todo' && (
            <button
              onClick={() => setSelectedCategory('Todo')}
              className="text-blue-600 hover:underline"
            >
              Ver todas las categorías
            </button>
          )}
        </div>

        {filteredArticles.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No encontramos guías con ese término
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Probá con otras palabras como "gestoría", "patentamiento", "facturación" o explorá las
              categorías.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todo');
              }}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline"
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
                className="group bg-white border border-slate-200/90 hover:border-blue-300 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                      {article.category}
                    </span>
                    <span className="flex items-center space-x-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTimeMinutes} min de lectura</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {article.shortDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <ThumbsUp className="w-3 h-3 text-emerald-500" />
                      <span>{article.helpfulCount}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-slate-400" />
                      <span>{article.viewsCount}</span>
                    </span>
                  </div>

                  <button className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 group-hover:text-blue-800">
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
