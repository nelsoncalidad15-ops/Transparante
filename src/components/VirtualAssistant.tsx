import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  CarFront,
  Clock,
  FileText,
  RotateCcw,
  X,
  ChevronRight,
  Info,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  articleSlug?: string;
  stageId?: string;
  suggestions?: string[];
}

interface VirtualAssistantProps {
  initialQuery?: string;
  onNavigateToArticle: (slug: string) => void;
  onNavigateToStage: (stageId: string) => void;
  isFloatingModal?: boolean;
  onCloseModal?: () => void;
}

const DEFAULT_WELCOME_MESSAGE: Message = {
  id: 'welcome-msg',
  sender: 'bot',
  text: '¡Hola! 👋 Soy el Bot de Consulta de Autosol. Estoy acá para orientarte con información clara y oficial sobre cada etapa de tu 0km, plazos orientativos, trámites de gestoría y documentación.',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  suggestions: [
    '¿Cuánto tarda el patentamiento?',
    '¿Qué significa gestoría?',
    '¿Cuándo comienza el tiempo de entrega?',
    'Documentación requerida',
    'Financiación prendaria',
    'Tiempos y plazos',
  ],
};

const QUICK_PILLS = [
  '¿Qué es gestoría?',
  'Patentamiento',
  'Tiempos de entrega',
  'Documentación requerida',
  'Financiación',
  'Preparación PDI',
];

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({
  initialQuery,
  onNavigateToArticle,
  onNavigateToStage,
  isFloatingModal = false,
  onCloseModal,
}) => {
  const { articles, stages, searchAll, recordSearchQuery } = useData();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const lastHandledInitialQueryRef = useRef<string | null>(null);

  // Scroll ONLY the internal chat container, NEVER the window/browser viewport
  const scrollChatToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scrollChatToBottom('smooth');
  }, [messages, isTyping]);

  const handleResetChat = () => {
    setMessages([
      {
        ...DEFAULT_WELCOME_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleUserSendMessage = useCallback(
    (textToSend: string) => {
      const text = textToSend.trim();
      if (!text) return;

      const userMsg: Message = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputMessage('');
      setIsTyping(true);

      // Natural response delay (350ms)
      setTimeout(() => {
        const q = text.toLowerCase();
        let botResponse: Partial<Message> = {};

        // 1. Gestoría
        if (q.includes('gestor') || q.includes('tramite previo')) {
          const art = articles.find((a) => a.slug.includes('gestoria'));
          botResponse = {
            text: 'La gestoría es la etapa donde nuestros profesionales matriculados gestionan los sellados provinciales, bajas/altas y trámites ante el Registro Automotor para inscribir la unidad a tu nombre.',
            articleSlug: art?.slug || 'que-es-gestoria',
            stageId: 'gestoria',
            suggestions: ['¿Cuánto tarda el patentamiento?', 'Documentación requerida', 'Tiempos orientativos'],
          };
        }
        // 2. Patentamiento / Registro
        else if (q.includes('patent') || q.includes('chapa') || q.includes('dominio') || q.includes('registro')) {
          const art = articles.find((a) => a.slug.includes('patentamiento'));
          botResponse = {
            text: 'El patentamiento es la inscripción formal de tu vehículo en la Dirección Nacional de los Registros del Automotor (DNRPA). El plazo orientativo habitual en Jujuy suele rondar entre 15 y 30 días hábiles una vez ingresado el legajo.',
            articleSlug: art?.slug || 'que-es-patentamiento',
            stageId: 'patentamiento',
            suggestions: ['¿Qué factores modifican el plazo?', '¿Qué sigue después de patentar?', 'Preparación PDI'],
          };
        }
        // 3. Tiempos / Entrega / Fechas
        else if (q.includes('tiempo') || q.includes('cuando') || q.includes('fecha') || q.includes('plazo') || q.includes('demor') || q.includes('camion')) {
          const art = articles.find((a) => a.slug.includes('cuando-empieza-a-correr'));
          botResponse = {
            text: 'El plazo orientativo de entrega comienza a computarse una vez que la unidad se encuentra 100% facturada con chasis asignado y saldos administrativos cancelados. El tiempo promedio suele rondar entre 25 y 45 días hábiles.',
            articleSlug: art?.slug || 'cuando-empieza-a-correr-tiempo-entrega',
            suggestions: ['¿Por qué puede variar el plazo?', 'Ver Tiempos Orientativos', 'Día de la entrega'],
          };
        }
        // 4. Facturación / Chasis
        else if (q.includes('factura') || q.includes('chasis') || q.includes('motor')) {
          const art = articles.find((a) => a.slug.includes('facturar'));
          botResponse = {
            text: 'Cuando tu unidad está facturada significa que Volkswagen Argentina emitió el comprobante fiscal definitivo a tu nombre con número de chasis y motor asignados. Con esto se da curso inmediato al patentamiento.',
            articleSlug: art?.slug || 'que-pasa-despues-de-facturar-unidad',
            stageId: 'facturacion',
            suggestions: ['¿Qué es gestoría?', 'Documentación necesaria', 'Plazos orientativos'],
          };
        }
        // 5. Documentación / DNI / Requisitos
        else if (q.includes('document') || q.includes('dni') || q.includes('papel') || q.includes('requisito')) {
          const art = articles.find((a) => a.slug.includes('documentacion'));
          botResponse = {
            text: 'Para personas físicas se solicita DNI vigente, constancia de CUIL/CUIT y justificación de fondos si el monto supera los límites de UIF. Para personas jurídicas se requiere estatuto social, actas de designación y poderes.',
            articleSlug: art?.slug || 'que-documentacion-puede-solicitarse',
            suggestions: ['¿Qué es gestoría?', 'Financiación prendaria', 'Día de la entrega'],
          };
        }
        // 6. Financiación / Prenda
        else if (q.includes('prenda') || q.includes('financi') || q.includes('credito') || q.includes('banco') || q.includes('pago')) {
          const art = articles.find((a) => a.slug.includes('financiacion') || a.slug.includes('prenda'));
          botResponse = {
            text: 'En operaciones con crédito prendario, la prenda se inscribe junto con el patentamiento en el Registro Automotor. Solo se autoriza la entrega del vehículo una vez que el banco o entidad financiera liquida y confirma la operación.',
            articleSlug: art?.slug || 'financiacion-y-pagos',
            suggestions: ['Documentación para crédito', '¿Cuánto tarda el patentamiento?', 'Tiempos orientativos'],
          };
        }
        // 6b. Consulta sobre Autoahorro / Planes (Redirección al canal de Autoahorro)
        else if (q.includes('autoahorro') || q.includes('plan de ahorro') || q.includes('licita') || q.includes('adjudic')) {
          botResponse = {
            text: 'Este portal de información está enfocado exclusivamente en las operaciones de Venta Tradicional / Convencional 0km (Contado y Crédito Prendario). Si tenés consultas sobre un Plan de Autoahorro Volkswagen (adjudicaciones, licitaciones o cuotas mensuales), por favor contactá al sector exclusivo de Autoahorro Autosol o a tu asesor de plan.',
            suggestions: ['Financiación prendaria', '¿Cuánto tarda el patentamiento?', 'Tiempos orientativos'],
          };
        }
        // 7. Preparación / PDI
        else if (q.includes('prepara') || q.includes('pdi') || q.includes('taller') || q.includes('accesorio') || q.includes('lavado')) {
          const art = articles.find((a) => a.slug.includes('pdi'));
          botResponse = {
            text: 'En la Inspección Pre-Entrega (PDI), nuestros técnicos oficiales revisan más de 40 puntos mecánicos y de software, instalan accesorios contratados, colocan las chapas patentes y realizan el lavado de salón.',
            articleSlug: art?.slug || 'que-es-la-inspeccion-pre-entrega-pdi',
            stageId: 'preparacion',
            suggestions: ['Coordinación de turno de entrega', 'Día del retiro', 'Garantía oficial'],
          };
        }
        // 8. Fallback con buscador contextual
        else {
          const searchResults = searchAll(text);
          recordSearchQuery(text, searchResults.length);

          if (searchResults.length > 0) {
            const top = searchResults[0];
            botResponse = {
              text: `Encontré información oficial relacionada con tu consulta sobre "${text}". Podés revisar el detalle completo a continuación:`,
              articleSlug: top.urlOrSlug.startsWith('article:') ? top.urlOrSlug.replace('article:', '') : undefined,
              stageId: top.urlOrSlug.startsWith('stage:') ? top.urlOrSlug.replace('stage:', '') : undefined,
              suggestions: ['¿Cuánto tarda el patentamiento?', '¿Qué es gestoría?', 'Tiempos de entrega'],
            };
          } else {
            botResponse = {
              text: 'No encontré una respuesta directa para ese término exacto. Podés consultar sobre estos temas principales o contactarte con tu asesor de Autosol:',
              suggestions: [
                '¿Cuánto tarda el patentamiento?',
                '¿Qué es gestoría?',
                'Tiempos orientativos',
                'Documentación requerida',
              ],
            };
          }
        }

        const botMsg: Message = {
          id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          sender: 'bot',
          text: botResponse.text || '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          articleSlug: botResponse.articleSlug,
          stageId: botResponse.stageId,
          suggestions: botResponse.suggestions,
        };

        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 350);
    },
    [articles, searchAll, recordSearchQuery]
  );

  useEffect(() => {
    if (initialQuery && initialQuery.trim() && lastHandledInitialQueryRef.current !== initialQuery.trim()) {
      lastHandledInitialQueryRef.current = initialQuery.trim();
      handleUserSendMessage(initialQuery.trim());
    }
  }, [initialQuery, handleUserSendMessage]);

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-[0_12px_40px_rgba(0,30,80,0.08)] ${
        isFloatingModal
          ? 'h-[520px] w-[min(380px,calc(100vw-2rem))]'
          : 'h-[520px] sm:h-[560px] w-full max-w-2xl mx-auto'
      }`}
    >
      {/* 1. Header: Sleek Volkswagen Deep Navy with Official Avatar & Status */}
      <div className="flex shrink-0 items-center justify-between bg-[#001e50] px-4 sm:px-5 py-3 text-white border-b border-white/10">
        <div className="flex items-center space-x-3">
          {/* Avatar with soft glow */}
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#0040c4] text-white shadow-sm ring-2 ring-white/20 shrink-0">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#001e50]" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xs sm:text-sm font-bold tracking-tight text-white">
                Bot de consulta Autosol
              </h2>
            </div>
            <p className="text-[10px] sm:text-[11px] text-blue-200/80 flex items-center space-x-1 font-normal">
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>En línea • Respuestas oficiales</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {/* Reset / Clear Chat Button */}
          <button
            onClick={handleResetChat}
            className="flex items-center space-x-1 rounded-lg px-2.5 py-1 text-[11px] text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Reiniciar conversación"
            aria-label="Reiniciar conversación"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>

          {onCloseModal && (
            <button
              onClick={onCloseModal}
              className="rounded-full p-1.5 text-blue-200 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
              aria-label="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Quick Topic Pills Bar (Compact, horizontal scroll with smooth pills) */}
      <div className="flex shrink-0 items-center space-x-1.5 overflow-x-auto bg-[#f8f7f4] px-3 sm:px-4 py-2 border-b border-slate-200/70 scrollbar-none">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 pr-1">
          Temas:
        </span>
        {QUICK_PILLS.map((pill) => (
          <button
            key={pill}
            onClick={() => handleUserSendMessage(pill)}
            className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-all hover:border-[#0040c4] hover:bg-blue-50 hover:text-[#0040c4] cursor-pointer shrink-0 shadow-2xs"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* 3. Messages Chat Area (Controlled scrolling without jumping the window) */}
      <div
        ref={chatContainerRef}
        className="flex-1 space-y-3.5 overflow-y-auto bg-[#faf9f6] p-3.5 sm:p-4 text-slate-900"
      >
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#001e50] text-white shadow-2xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className="max-w-[85%] sm:max-w-[78%] space-y-1.5">
                <div
                  className={`rounded-2xl p-3 sm:p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                    isBot
                      ? 'rounded-tl-xs border border-slate-200/80 bg-white text-slate-800'
                      : 'rounded-tr-xs bg-[#0040c4] font-medium text-white shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Contextual Action Link Card inside Bot Message */}
                  {msg.articleSlug && (
                    <div className="pt-2 mt-2 border-t border-slate-100">
                      <button
                        onClick={() => onNavigateToArticle(msg.articleSlug!)}
                        className="inline-flex items-center space-x-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-[#0040c4] hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Ver guía oficial completa</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {msg.stageId && (
                    <div className="pt-1.5">
                      <button
                        onClick={() => onNavigateToStage(msg.stageId!)}
                        className="inline-flex items-center space-x-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        <CarFront className="w-3.5 h-3.5 text-[#0040c4]" />
                        <span>Ver etapa en Mi Proceso</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Micro Follow-up Suggestions under bot message */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleUserSendMessage(sug)}
                        className="inline-flex items-center space-x-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-[#0040c4] hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer shadow-2xs"
                      >
                        <span>{sug}</span>
                        <ChevronRight className="w-2.5 h-2.5 text-blue-400" />
                      </button>
                    ))}
                  </div>
                )}

                <span
                  className={`text-[10px] text-slate-400 block px-1 ${
                    isBot ? 'text-left' : 'text-right'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#001e50] text-white shadow-2xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="rounded-2xl rounded-tl-xs bg-white border border-slate-200/80 px-3.5 py-2 shadow-2xs flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Input Bar */}
      <div className="shrink-0 border-t border-slate-200/80 bg-white p-2.5 sm:p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserSendMessage(inputMessage);
          }}
          className="flex items-center space-x-2"
        >
          <input
            id="assistant-chat-input"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribí tu consulta (ej: ¿Qué es gestoría?)..."
            className="flex-1 rounded-full border border-slate-300 bg-slate-50/80 px-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0040c4] focus:outline-none focus:ring-2 focus:ring-[#0040c4]/15"
          />
          <button
            type="submit"
            id="btn-send-assistant-msg"
            disabled={!inputMessage.trim()}
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#0040c4] text-white transition-all hover:bg-[#001e50] active:scale-95 disabled:opacity-40 cursor-pointer shadow-sm"
            aria-label="Enviar consulta"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-1.5 text-center text-[10px] text-slate-400">
          Orientación oficial de Autosol Jujuy • Basado en el manual de procesos 0km
        </p>
      </div>
    </div>
  );
};
