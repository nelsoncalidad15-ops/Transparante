import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Car,
  Clock,
  FileText,
  UserCheck,
  RefreshCw,
  X,
  ChevronRight,
  Info,
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
  isTrackingPrompt?: boolean;
}

interface VirtualAssistantProps {
  initialQuery?: string;
  onNavigateToArticle: (slug: string) => void;
  onNavigateToStage: (stageId: string) => void;
  onOpenTracker: () => void;
  isFloatingModal?: boolean;
  onCloseModal?: () => void;
}

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({
  initialQuery,
  onNavigateToArticle,
  onNavigateToStage,
  onOpenTracker,
  isFloatingModal = false,
  onCloseModal,
}) => {
  const { articles, stages, faqs, searchAll, recordSearchQuery } = useData();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: '¡Hola! 👋 Soy el Asistente Autosol. Estoy acá para ayudarte a comprender cada etapa, tiempos orientativos, documentación requerida y conceptos de tu compra de forma clara y transparente.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'Estado de mi operación',
        '¿Qué significa gestoría?',
        '¿Cuánto tarda el patentamiento?',
        '¿Cuándo comienza el tiempo de entrega?',
        'Documentación requerida',
        'Financiación prendaria',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const lastHandledInitialQueryRef = useRef<string | null>(null);

  const quickPills = [
    'Estado de mi operación',
    '¿Qué es gestoría?',
    'Patentamiento',
    'Fecha de entrega',
    'Documentación',
    'Entrega',
    'Financiación',
    'Tiempos orientativos',
  ];

  const handleUserSendMessage = useCallback((textToSend: string) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    // Process Bot Response
    setTimeout(() => {
      const q = text.toLowerCase();
      let botResponse: Partial<Message> = {};

      // Check for personalized unit tracking intent
      if (
        q.includes('mi operacion') ||
        q.includes('mi unidad') ||
        q.includes('estado') ||
        q.includes('donde esta mi auto') ||
        q.includes('mi auto') ||
        q.includes('seguimiento')
      ) {
        botResponse = {
          text: 'Podés consultar el estado real de tu unidad ingresando tu número de boleto o DNI en el visualizador personalizado de Mi Operación.',
          isTrackingPrompt: true,
          suggestions: ['Ingresar a mi operación', '¿Qué es gestoría?', 'Tiempos orientativos'],
        };
      }
      // Check for gestoria
      else if (q.includes('gestor') || q.includes('tramite previo')) {
        const art = articles.find((a) => a.slug.includes('gestoria'));
        botResponse = {
          text: 'La gestoría es la etapa en la que nuestros profesionales matriculados realizan los trámites administrativos, sellados provinciales y verificaciones documentales necesarias para habilitar el patentamiento del vehículo.',
          articleSlug: art?.slug || 'que-es-gestoria',
          stageId: 'gestoria',
          suggestions: ['¿Cuánto tarda la gestoría?', '¿Qué es patentamiento?', 'Documentación necesaria'],
        };
      }
      // Check for patentamiento
      else if (q.includes('patent') || q.includes('chapa') || q.includes('dominio') || q.includes('registro')) {
        const art = articles.find((a) => a.slug.includes('patentamiento'));
        botResponse = {
          text: 'El patentamiento es el trámite oficial mediante el cual el vehículo se inscribe a tu nombre en el Registro Automotor (DNRPA) y obtiene su chapa patente. El plazo orientativo habitual es de 15 a 30 días hábiles.',
          articleSlug: art?.slug || 'que-es-patentamiento',
          stageId: 'patentamiento',
          suggestions: ['¿Qué factores modifican el plazo?', '¿Qué sigue después de patentar?', 'Preparación de la unidad'],
        };
      }
      // Check for delivery / entrega / tiempo
      else if (q.includes('tiempo') || q.includes('cuando') || q.includes('fecha') || q.includes('plazo') || q.includes('demor')) {
        const art = articles.find((a) => a.slug.includes('cuando-empieza-a-correr'));
        botResponse = {
          text: 'El tiempo estimado de entrega comienza a computarse una vez que la unidad se encuentra 100% facturada, con número de chasis asignado y saldos administrativos cancelados. El plazo total orientativo suele rondar entre 25 y 45 días hábiles.',
          articleSlug: art?.slug || 'cuando-empieza-a-correr-tiempo-entrega',
          suggestions: ['¿Por qué puede demorar?', 'Ver Tiempos Orientativos', 'Facturación'],
        };
      }
      // Check for facturacion
      else if (q.includes('factura') || q.includes('chasis') || q.includes('motor')) {
        const art = articles.find((a) => a.slug.includes('facturar'));
        botResponse = {
          text: 'Cuando tu unidad está facturada significa que la terminal emitió el comprobante fiscal legal a tu nombre, asignándole chasis y motor definitivos. Desde allí se habilita el pase inmediato a gestoría.',
          articleSlug: art?.slug || 'que-pasa-despues-de-facturar-unidad',
          stageId: 'facturacion',
          suggestions: ['¿Qué es gestoría?', 'Documentación requerida', 'Tiempos orientativos'],
        };
      }
      // Check for documentacion
      else if (q.includes('document') || q.includes('dni') || q.includes('papel') || q.includes('requisito')) {
        const art = articles.find((a) => a.slug.includes('documentacion'));
        botResponse = {
          text: 'La documentación básica incluye DNI vigente, constancia de CUIL/CUIT y justificaciones de fondos si superan montos normativos. Para empresas se requiere estatuto y poderes vigentes.',
          articleSlug: art?.slug || 'que-documentacion-puede-solicitarse',
          suggestions: ['¿Qué es gestoría?', 'Personas jurídicas', 'Día de la entrega'],
        };
      }
      // Check for preparacion / pdi
      else if (q.includes('prepara') || q.includes('pdi') || q.includes('taller') || q.includes('accesorio') || q.includes('lavado')) {
        const art = articles.find((a) => a.slug.includes('pdi'));
        botResponse = {
          text: 'En la preparación (PDI), nuestros técnicos revisan más de 40 puntos mecánicos y electrónicos, colocan los accesorios opcionales contratados, fijan las patentes y realizan el lavado de salón.',
          articleSlug: art?.slug || 'que-es-la-inspeccion-pre-entrega-pdi',
          stageId: 'preparacion',
          suggestions: ['Coordinación de turno', 'Día de la entrega', 'Tiempos'],
        };
      }
      // Fallback search in data context
      else {
        const searchResults = searchAll(text);
        recordSearchQuery(text, searchResults.length);

        if (searchResults.length > 0) {
          const top = searchResults[0];
          botResponse = {
            text: `Encontré información oficial relacionada con tu consulta sobre "${text}".`,
            articleSlug: top.urlOrSlug.startsWith('article:') ? top.urlOrSlug.replace('article:', '') : undefined,
            stageId: top.urlOrSlug.startsWith('stage:') ? top.urlOrSlug.replace('stage:', '') : undefined,
            suggestions: ['¿Qué es gestoría?', 'Patentamiento', 'Tiempos de entrega'],
          };
        } else {
          botResponse = {
            text: 'No encontré una respuesta exacta para tu consulta en nuestra base oficial. Podés revisar los temas más consultados a continuación o contactar a tu asesor comercial.',
            suggestions: [
              '¿Qué es gestoría?',
              'Patentamiento',
              'Fecha de entrega',
              'Documentación requerida',
            ],
          };
        }
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        sender: 'bot',
        text: botResponse.text || '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        articleSlug: botResponse.articleSlug,
        stageId: botResponse.stageId,
        suggestions: botResponse.suggestions,
        isTrackingPrompt: botResponse.isTrackingPrompt,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  }, [articles, searchAll, recordSearchQuery]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim() && lastHandledInitialQueryRef.current !== initialQuery.trim()) {
      lastHandledInitialQueryRef.current = initialQuery.trim();
      handleUserSendMessage(initialQuery.trim());
    }
  }, [initialQuery, handleUserSendMessage]);

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white shadow-[0_24px_70px_rgba(7,30,58,0.18)] ${
        isFloatingModal ? 'h-[560px] w-[min(390px,calc(100vw-2.5rem))] max-w-none' : 'h-[640px] max-w-4xl mx-auto'
      }`}
    >
      {/* Top Header */}
      <div className="flex shrink-0 items-center justify-between bg-[#061d38] px-5 py-3.5 text-white">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b6fb8] text-white shadow-inner shadow-white/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-semibold tracking-tight text-white">Asistente Autosol</h2>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-blue-200/80 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Orientación basada en contenidos oficiales</span>
            </p>
          </div>
        </div>

        {onCloseModal && (
          <button
            onClick={onCloseModal}
            className="rounded-full p-1.5 text-blue-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestion Chips Banner */}
      <div className="flex shrink-0 items-center space-x-2 overflow-x-auto border-b border-slate-100 bg-white px-4 py-3 scrollbar-thin">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Sugerencias:
        </span>
        {quickPills.map((pill) => (
          <button
            key={pill}
            onClick={() => handleUserSendMessage(pill)}
            className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:border-[#84c8e5] hover:bg-[#edf8fc] hover:text-[#0069b4]"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,#f8fbfd_0%,#ffffff_28%)] p-4 sm:p-5">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e0f1f8] text-[#0069b4]">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div
                  className={`rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm sm:p-4 sm:text-sm ${
                    isBot
                      ? 'rounded-tl-md border border-slate-100 bg-white text-slate-700'
                      : 'rounded-tr-md bg-[#0069b4] font-medium text-white'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Contextual Action Button inside Bot Message */}
                  {msg.articleSlug && (
                    <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex flex-wrap gap-2">
                      <button
                        onClick={() => onNavigateToArticle(msg.articleSlug!)}
                        className="inline-flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Ver información completa</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {msg.stageId && (
                    <div className="pt-2">
                      <button
                        onClick={() => onNavigateToStage(msg.stageId!)}
                        className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
                      >
                        <Car className="w-3.5 h-3.5 text-blue-600" />
                        <span>Ver etapa en Mi Proceso</span>
                      </button>
                    </div>
                  )}

                  {msg.isTrackingPrompt && (
                    <div className="pt-2.5 mt-2.5 border-t border-slate-100">
                      <button
                        onClick={onOpenTracker}
                        className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-xs transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Abrir Mi Operación</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Micro Suggestions under bot message */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleUserSendMessage(sug)}
                        className="flex items-center space-x-1 rounded-full border border-[#b9dcf0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#0069b4] transition-colors hover:bg-[#edf8fc]"
                      >
                        <span>{sug}</span>
                        <ChevronRight className="w-3 h-3 text-blue-400" />
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUserSendMessage(inputMessage);
        }}
        className="flex shrink-0 items-center space-x-2 border-t border-slate-100 bg-white p-3"
      >
        <input
          id="assistant-chat-input"
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Escribí tu consulta (ej: ¿Qué es gestoría?)..."
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0069b4]/25 sm:text-sm"
        />
        <button
          type="submit"
          id="btn-send-assistant-msg"
          disabled={!inputMessage.trim()}
          className="shrink-0 rounded-full bg-[#0069b4] p-3 text-white shadow-[0_5px_14px_rgba(0,105,180,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#005995] active:scale-95 disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
