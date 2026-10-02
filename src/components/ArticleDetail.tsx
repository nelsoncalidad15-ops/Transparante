import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Clock,
  Printer,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Info,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Copy,
  Check,
  Tag,
  HelpCircle,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { LibraryArticle } from '../types';

interface ArticleDetailProps {
  slug: string;
  onBack: () => void;
  onSelectRelated: (topicOrSlug: string) => void;
  onOpenAssistant: (topic: string) => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  slug,
  onBack,
  onSelectRelated,
  onOpenAssistant,
}) => {
  const { getArticleBySlug, submitArticleFeedback, incrementArticleViews } = useData();
  const article = getArticleBySlug(slug);

  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);
  const [missingInfoComment, setMissingInfoComment] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const hasIncrementedRef = useRef<string | null>(null);

  useEffect(() => {
    if (article && hasIncrementedRef.current !== article.id) {
      hasIncrementedRef.current = article.id;
      incrementArticleViews(article.id);
    }
  }, [article?.id, incrementArticleViews]);

  if (!article) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Contenido no encontrado</h2>
        <p className="text-sm text-slate-500">
          El artículo solicitado no existe o fue actualizado.
        </p>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl inline-flex items-center space-x-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver a la biblioteca</span>
        </button>
      </div>
    );
  }

  const handleFeedback = (helpful: boolean) => {
    setFeedbackGiven(helpful ? 'yes' : 'no');
    submitArticleFeedback(article.id, helpful);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (missingInfoComment.trim()) {
      submitArticleFeedback(article.id, false, missingInfoComment.trim());
      setCommentSubmitted(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver a la biblioteca</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyLink}
            title="Copiar enlace"
            className="p-2 text-slate-500 hover:text-blue-700 bg-white border border-slate-200 rounded-xl text-xs transition-colors flex items-center space-x-1.5"
          >
            {copiedLink ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{copiedLink ? 'Copiado' : 'Compartir'}</span>
          </button>

          <button
            onClick={handlePrint}
            title="Imprimir guía"
            className="p-2 text-slate-500 hover:text-blue-700 bg-white border border-slate-200 rounded-xl text-xs transition-colors flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-[0_5px_20px_rgba(7,30,58,0.04)] space-y-8">
        {/* Article Meta & Title */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#002244] bg-[#e6e6e6] px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTimeMinutes} min de lectura</span>
            </span>
            <span className="text-xs text-[#002244] bg-[#ece5db] border border-slate-200 px-2.5 py-0.5 rounded-full font-medium flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-[#002244]" />
              <span>Información oficial validada</span>
            </span>
          </div>

          <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-[#002244] tracking-[-0.04em] leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-3xl">
            {article.shortDesc}
          </p>
        </div>

        {/* Section 1: Definición */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#002244] uppercase tracking-wider">
            <Info className="w-4 h-4 text-[#002244]" />
            <span>Definición y alcance</span>
          </div>
          <div className="bg-[#ece5db] border border-[#e6e6e6] rounded-2xl p-5 sm:p-6 text-sm sm:text-base text-[#002244] leading-relaxed">
            {article.definition}
          </div>
        </div>

        {/* Section 2: Tiempo orientativo */}
        {article.estimatedTime && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#002244] uppercase tracking-wider">
              <Clock className="w-4 h-4 text-[#002244]" />
              <span>Tiempo orientativo</span>
            </div>
            <div className="bg-[#ece5db] border border-slate-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-lg sm:text-xl font-semibold text-[#002244]">
                  ⏱️ {article.estimatedTime}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Los tiempos son orientativos y pueden variar según cada caso y organismos intervinientes.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Qué sucede en esta etapa / procedimiento */}
        {article.whatHappens && article.whatHappens.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#002244] uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#002244]" />
              <span>¿Qué se realiza durante este trámite?</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {article.whatHappens.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 bg-white border border-slate-200/80 p-4 rounded-xl text-xs text-slate-700 leading-relaxed shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#002244] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Factores que pueden modificar el plazo */}
        {article.timeFactors && article.timeFactors.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#002244] uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-[#002244]" />
              <span>Factores que pueden modificar el plazo</span>
            </div>
            <div className="bg-[#ece5db] border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-2">
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                {article.timeFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#002244] mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Section 5: Qué sigue */}
        {article.whatNext && (
          <div className="bg-[#002244] rounded-2xl p-6 sm:p-7 text-white space-y-2 shadow-sm">
            <span className="text-xs font-semibold text-[#008cff] uppercase tracking-wider">
              ¿Qué sigue después?
            </span>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">{article.whatNext}</p>
          </div>
        )}

        {/* Related Topics Chips */}
        {article.relatedTopics && article.relatedTopics.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Temas relacionados
            </div>
            <div className="flex flex-wrap gap-2">
              {article.relatedTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => onSelectRelated(topic)}
                  className="bg-[#ece5db] hover:bg-[#e6e6e6] text-[#002244] border border-slate-200 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Tag className="w-3 h-3 text-[#002244]" />
                  <span>{topic}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: Interactive Feedback Box */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-[0_5px_20px_rgba(7,30,58,0.04)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-semibold text-[#002244]">
                ¿Te sirvió esta información?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Tu opinión nos ayuda a mejorar la claridad de cada explicación.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-feedback-yes"
                disabled={feedbackGiven !== null}
                onClick={() => handleFeedback(true)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  feedbackGiven === 'yes'
                    ? 'bg-[#002244] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-[#002244] hover:text-[#002244]'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Sí, me sirvió</span>
              </button>

              <button
                id="btn-feedback-no"
                disabled={feedbackGiven !== null}
                onClick={() => handleFeedback(false)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  feedbackGiven === 'no'
                    ? 'bg-[#002244] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>No, faltó información</span>
              </button>
            </div>
          </div>

          {/* Conditional Prompt when user selects No */}
          {feedbackGiven === 'no' && !commentSubmitted && (
            <form onSubmit={handleCommentSubmit} className="pt-4 border-t border-slate-100 space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">
                ¿Qué información te faltó o qué duda te quedó? (Opcional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={missingInfoComment}
                  onChange={(e) => setMissingInfoComment(e.target.value)}
                  placeholder="Ejemplo: Me gustaría saber si puedo autorizar a otra persona..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#002244]/30"
                />
                <button
                  type="submit"
                  className="bg-[#002244] hover:bg-[#002244] hover:brightness-125 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer shrink-0"
                >
                  Enviar
                </button>
              </div>
            </form>
          )}

          {feedbackGiven === 'yes' && (
            <div className="pt-2 text-xs text-[#002244] font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>¡Muchas gracias por tu valoración! Nos alegra que te haya sido útil.</span>
            </div>
          )}

          {commentSubmitted && (
            <div className="pt-2 text-xs text-[#002244] font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>
                ¡Gracias por tu sugerencia! El equipo de Calidad revisará este punto para ampliar la explicación.
              </span>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};
