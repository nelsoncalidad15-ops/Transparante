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
      <article className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        {/* Article Meta & Title */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTimeMinutes} min de lectura</span>
            </span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Información oficial validada</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-base text-slate-600 font-normal leading-relaxed">
            {article.shortDesc}
          </p>
        </div>

        {/* Section 1: Definición */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-950 uppercase tracking-wider">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Definición y alcance</span>
          </div>
          <div className="bg-slate-50/90 border border-slate-200/70 rounded-2xl p-5 text-sm sm:text-base text-slate-800 leading-relaxed">
            {article.definition}
          </div>
        </div>

        {/* Section 2: Tiempo orientativo */}
        {article.estimatedTime && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-950 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Tiempo orientativo</span>
            </div>
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-blue-950">
                  {article.estimatedTime}
                </div>
                <div className="text-xs text-blue-700/90 mt-0.5">
                  Los tiempos son orientativos y pueden variar según cada caso y organismos
                  intervinientes.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Qué sucede en esta etapa / procedimiento */}
        {article.whatHappens && article.whatHappens.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-950 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>¿Qué se realiza durante este trámite?</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {article.whatHappens.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 bg-emerald-50/40 border border-emerald-100/80 p-3.5 rounded-xl text-xs text-slate-700 leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Factores que pueden modificar el plazo */}
        {article.timeFactors && article.timeFactors.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-950 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Factores que pueden modificar el plazo</span>
            </div>
            <div className="bg-amber-50/50 border border-amber-200/70 rounded-2xl p-5 space-y-2">
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {article.timeFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Section 5: Qué sigue */}
        {article.whatNext && (
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 rounded-2xl p-6 text-white space-y-2">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
              ¿Qué sigue después?
            </span>
            <p className="text-sm text-slate-200 leading-relaxed">{article.whatNext}</p>
          </div>
        )}

        {/* Related Topics Chips */}
        {article.relatedTopics && article.relatedTopics.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Temas relacionados
            </div>
            <div className="flex flex-wrap gap-2">
              {article.relatedTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => onSelectRelated(topic)}
                  className="bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1.5"
                >
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>{topic}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: Interactive Feedback Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                ¿Te sirvió esta información?
              </h4>
              <p className="text-xs text-slate-500">
                Tu opinión nos ayuda a mejorar la claridad de cada explicación.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                id="btn-feedback-yes"
                disabled={feedbackGiven !== null}
                onClick={() => handleFeedback(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  feedbackGiven === 'yes'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Sí, me sirvió</span>
              </button>

              <button
                id="btn-feedback-no"
                disabled={feedbackGiven !== null}
                onClick={() => handleFeedback(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  feedbackGiven === 'no'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-500 hover:text-amber-700'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>No, faltó información</span>
              </button>
            </div>
          </div>

          {/* Conditional Prompt when user selects No */}
          {feedbackGiven === 'no' && !commentSubmitted && (
            <form onSubmit={handleCommentSubmit} className="pt-3 border-t border-slate-200/60 space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                ¿Qué información te faltó o qué duda te quedó? (Opcional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={missingInfoComment}
                  onChange={(e) => setMissingInfoComment(e.target.value)}
                  placeholder="Ejemplo: Me gustaría saber si puedo autorizar a otra persona..."
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Enviar
                </button>
              </div>
            </form>
          )}

          {feedbackGiven === 'yes' && (
            <div className="pt-2 text-xs text-emerald-700 font-semibold flex items-center space-x-1.5 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>¡Muchas gracias por tu valoración! Nos alegra que te haya sido útil.</span>
            </div>
          )}

          {commentSubmitted && (
            <div className="pt-2 text-xs text-blue-700 font-semibold flex items-center space-x-1.5 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>
                ¡Gracias por tu sugerencia! El equipo de Calidad revisará este punto para ampliar la
                explicación.
              </span>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};
