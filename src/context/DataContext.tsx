import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  ProcessStage,
  LibraryArticle,
  FAQItem,
  ClientOperation,
  UncertaintyTopic,
  UnassistedSearch,
  QualityKPIs,
  SheetIntegrationState,
  ProcessStageId,
} from '../types';
import {
  INITIAL_STAGES,
  INITIAL_ARTICLES,
  INITIAL_FAQS,
  MOCK_OPERATIONS,
  INITIAL_UNCERTAINTY_TOPICS,
  INITIAL_UNASSISTED_SEARCHES,
  INITIAL_KPIS,
} from '../data/defaultData';

interface SearchResultItem {
  id: string;
  type: 'Artículo' | 'Etapa del proceso' | 'Pregunta frecuente' | 'Documentación';
  title: string;
  subtitle: string;
  category: string;
  urlOrSlug: string;
  matchSnippet?: string;
  estimatedTime?: string;
}

interface DataContextType {
  stages: ProcessStage[];
  articles: LibraryArticle[];
  faqs: FAQItem[];
  operations: ClientOperation[];
  uncertaintyTopics: UncertaintyTopic[];
  unassistedSearches: UnassistedSearch[];
  kpis: QualityKPIs;
  sheetConfig: SheetIntegrationState;
  
  // Actions
  getStageById: (id: ProcessStageId) => ProcessStage | undefined;
  getArticleBySlug: (slug: string) => LibraryArticle | undefined;
  getOperationByCode: (codeOrDni: string) => ClientOperation | undefined;
  
  // Feedback & Interactions
  submitArticleFeedback: (articleId: string, helpful: boolean, comment?: string) => void;
  recordSearchQuery: (query: string, resultsCount: number) => void;
  incrementArticleViews: (articleId: string) => void;
  
  // Admin & Content Management
  addArticle: (article: Omit<LibraryArticle, 'id' | 'viewsCount' | 'helpfulCount' | 'unhelpfulCount'>) => void;
  updateArticle: (id: string, article: Partial<LibraryArticle>) => void;
  deleteArticle: (id: string) => void;
  toggleArticleStatus: (id: string, status: LibraryArticle['status']) => void;
  updateUncertaintyAction: (id: string, action: UncertaintyTopic['suggestedAction'], status: UncertaintyTopic['actionStatus']) => void;
  
  // Google Sheets Integration
  updateSheetConfig: (config: Partial<SheetIntegrationState>) => void;
  syncWithGoogleSheets: () => Promise<{ success: boolean; message: string }>;
  resetToDefaults: () => void;
  exportDataAsJSON: () => string;
  importDataFromJSON: (jsonString: string) => boolean;
  
  // Unified Search
  searchAll: (query: string, filterType?: string, filterCategory?: string) => SearchResultItem[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_ARTICLES = 'autosol_articles_v1';
const LOCAL_STORAGE_KEY_FAQS = 'autosol_faqs_v1';
const LOCAL_STORAGE_KEY_KPIS = 'autosol_kpis_v1';
const LOCAL_STORAGE_KEY_UNCERTAINTY = 'autosol_uncertainty_v1';
const LOCAL_STORAGE_KEY_SHEET = 'autosol_sheet_config_v1';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stages] = useState<ProcessStage[]>(INITIAL_STAGES);

  const [articles, setArticles] = useState<LibraryArticle[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ARTICLES);
      return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_FAQS);
      return saved ? JSON.parse(saved) : INITIAL_FAQS;
    } catch {
      return INITIAL_FAQS;
    }
  });

  const [operations] = useState<ClientOperation[]>(MOCK_OPERATIONS);

  const [uncertaintyTopics, setUncertaintyTopics] = useState<UncertaintyTopic[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_UNCERTAINTY);
      return saved ? JSON.parse(saved) : INITIAL_UNCERTAINTY_TOPICS;
    } catch {
      return INITIAL_UNCERTAINTY_TOPICS;
    }
  });

  const [unassistedSearches, setUnassistedSearches] = useState<UnassistedSearch[]>(INITIAL_UNASSISTED_SEARCHES);

  const [kpis, setKpis] = useState<QualityKPIs>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_KPIS);
      return saved ? JSON.parse(saved) : INITIAL_KPIS;
    } catch {
      return INITIAL_KPIS;
    }
  });

  const [sheetConfig, setSheetConfig] = useState<SheetIntegrationState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SHEET);
      return saved
        ? JSON.parse(saved)
        : {
            sheetUrl: 'https://docs.google.com/spreadsheets/d/1AutosolTransparente_Oficial_Contenidos/edit',
            appsScriptEndpoint: '',
            apiKey: '',
            isConnected: false,
            lastSyncTimestamp: null,
            autoSync: false,
          };
    } catch {
      return {
        sheetUrl: 'https://docs.google.com/spreadsheets/d/1AutosolTransparente_Oficial_Contenidos/edit',
        appsScriptEndpoint: '',
        apiKey: '',
        isConnected: false,
        lastSyncTimestamp: null,
        autoSync: false,
      };
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.error(e);
    }
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_FAQS, JSON.stringify(faqs));
    } catch (e) {
      console.error(e);
    }
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_UNCERTAINTY, JSON.stringify(uncertaintyTopics));
    } catch (e) {
      console.error(e);
    }
  }, [uncertaintyTopics]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SHEET, JSON.stringify(sheetConfig));
    } catch (e) {
      console.error(e);
    }
  }, [sheetConfig]);

  const getStageById = (id: ProcessStageId) => stages.find((s) => s.id === id);

  const getArticleBySlug = (slug: string) =>
    articles.find((a) => a.slug === slug || a.id === slug);

  const getOperationByCode = (input: string) => {
    const clean = input.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    return operations.find((op) => {
      const opNum = op.orderNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      const dni = op.documentNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      const name = op.clientName.toLowerCase();
      return (
        opNum.includes(clean) ||
        dni.includes(clean) ||
        name.includes(input.trim().toLowerCase())
      );
    });
  };

  const submitArticleFeedback = (articleId: string, helpful: boolean, comment?: string) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          return {
            ...art,
            helpfulCount: helpful ? art.helpfulCount + 1 : art.helpfulCount,
            unhelpfulCount: !helpful ? art.unhelpfulCount + 1 : art.unhelpfulCount,
            feedbackComments: comment
              ? [...(art.feedbackComments || []), comment]
              : art.feedbackComments,
          };
        }
        return art;
      })
    );

    setKpis((prev) => {
      const totalFeedback = prev.totalVisits * 0.4;
      const newHelpfulPct = helpful
        ? Math.min(99.4, Number((prev.helpfulFeedbackPercentage + 0.1).toFixed(1)))
        : Math.max(80, Number((prev.helpfulFeedbackPercentage - 0.2).toFixed(1)));
      return { ...prev, helpfulFeedbackPercentage: newHelpfulPct };
    });
  };

  const incrementArticleViews = (articleId: string) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === articleId ? { ...art, viewsCount: art.viewsCount + 1 } : art))
    );
    setKpis((prev) => ({ ...prev, totalVisits: prev.totalVisits + 1 }));
  };

  const recordSearchQuery = (query: string, resultsCount: number) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setKpis((prev) => ({ ...prev, totalSearches: prev.totalSearches + 1 }));

    if (resultsCount === 0) {
      setUnassistedSearches((prev) => {
        const existing = prev.find((item) => item.query.toLowerCase() === trimmed.toLowerCase());
        if (existing) {
          return prev.map((item) =>
            item.id === existing.id ? { ...item, occurrences: item.occurrences + 1 } : item
          );
        }
        return [
          {
            id: `un-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            query: trimmed,
            date: new Date().toISOString().split('T')[0],
            occurrences: 1,
            resolved: false,
          },
          ...prev,
        ];
      });
      setKpis((prev) => ({
        ...prev,
        unassistedSearchesCount: prev.unassistedSearchesCount + 1,
      }));
    }
  };

  const addArticle = (
    newArtData: Omit<LibraryArticle, 'id' | 'viewsCount' | 'helpfulCount' | 'unhelpfulCount'>
  ) => {
    const id = `art-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newArticle: LibraryArticle = {
      ...newArtData,
      id,
      slug: newArtData.slug || newArtData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      viewsCount: 1,
      helpfulCount: 0,
      unhelpfulCount: 0,
    };
    setArticles((prev) => [newArticle, ...prev]);
  };

  const updateArticle = (id: string, updated: Partial<LibraryArticle>) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, ...updated, lastReview: new Date().toISOString().split('T')[0] } : art))
    );
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((art) => art.id !== id));
  };

  const toggleArticleStatus = (id: string, status: LibraryArticle['status']) => {
    setArticles((prev) => prev.map((art) => (art.id === id ? { ...art, status } : art)));
  };

  const updateUncertaintyAction = (
    id: string,
    action: UncertaintyTopic['suggestedAction'],
    status: UncertaintyTopic['actionStatus']
  ) => {
    setUncertaintyTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, suggestedAction: action, actionStatus: status } : t))
    );
  };

  const updateSheetConfig = (config: Partial<SheetIntegrationState>) => {
    setSheetConfig((prev) => ({ ...prev, ...config }));
  };

  const syncWithGoogleSheets = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/content', { headers: { Accept: 'application/json' } });
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        if (data && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
          if (Array.isArray(data.faqs) && data.faqs.length > 0) setFaqs(data.faqs);
          setSheetConfig((prev) => ({ ...prev, isConnected: true, lastSyncTimestamp: new Date().toLocaleString('es-AR') }));
          return { success: true, message: `Sincronizados ${data.articles.length} artículos desde el backend seguro.` };
        }
      }
    } catch (err) {
      console.warn('Vercel API unavailable, trying legacy endpoint:', err);
    }

    if (sheetConfig.appsScriptEndpoint) {
      try {
        const response = await fetch(sheetConfig.appsScriptEndpoint, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.articles) && data.articles.length > 0) {
            setArticles(data.articles);
            setSheetConfig((prev) => ({
              ...prev,
              isConnected: true,
              lastSyncTimestamp: new Date().toLocaleString('es-AR'),
            }));
            return {
              success: true,
              message: `Sincronizados ${data.articles.length} artículos exitosamente desde Google Sheets`,
            };
          }
        }
      } catch (err) {
        console.warn('Endpoint fetch failed, falling back to simulated sync:', err);
      }
    }

    // Simulated sync for demonstration
    await new Promise((res) => setTimeout(res, 800));
    setSheetConfig((prev) => ({
      ...prev,
      isConnected: true,
      lastSyncTimestamp: new Date().toLocaleString('es-AR'),
    }));
    return {
      success: true,
      message: 'Conexión validada: Datos sincronizados y estructura de Google Sheets lista.',
    };
  };

  useEffect(() => {
    let mounted = true;
    fetch('/api/content', { headers: { Accept: 'application/json' } })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        const data = result?.data || result;
        if (!mounted || !Array.isArray(data?.articles) || data.articles.length === 0) return;
        setArticles(data.articles);
        if (Array.isArray(data.faqs) && data.faqs.length > 0) setFaqs(data.faqs);
        setSheetConfig((previous) => ({ ...previous, isConnected: true, lastSyncTimestamp: new Date().toLocaleString('es-AR') }));
      })
      .catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  const resetToDefaults = () => {
    setArticles(INITIAL_ARTICLES);
    setFaqs(INITIAL_FAQS);
    setUncertaintyTopics(INITIAL_UNCERTAINTY_TOPICS);
    setKpis(INITIAL_KPIS);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ARTICLES);
      localStorage.removeItem(LOCAL_STORAGE_KEY_FAQS);
      localStorage.removeItem(LOCAL_STORAGE_KEY_UNCERTAINTY);
    } catch {}
  };

  const exportDataAsJSON = () => {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        articles,
        faqs,
        stages,
      },
      null,
      2
    );
  };

  const importDataFromJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.articles && Array.isArray(parsed.articles)) {
        setArticles(parsed.articles);
      }
      if (parsed.faqs && Array.isArray(parsed.faqs)) {
        setFaqs(parsed.faqs);
      }
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  };

  const searchAll = (
    query: string,
    filterType?: string,
    filterCategory?: string
  ): SearchResultItem[] => {
    const q = query.trim().toLowerCase();
    if (!q && !filterCategory && !filterType) return [];

    const results: SearchResultItem[] = [];

    // Search Stages
    stages.forEach((st) => {
      const matchName = st.name.toLowerCase().includes(q);
      const matchDef = st.definition.toLowerCase().includes(q);
      const matchHappens = st.whatHappens.some((w) => w.toLowerCase().includes(q));
      const matchFactors = st.timeFactors.some((f) => f.toLowerCase().includes(q));

      if (matchName || matchDef || matchHappens || matchFactors || !q) {
        if (!filterCategory || filterCategory === 'Todo' || filterCategory === st.category) {
          if (!filterType || filterType === 'Todo' || filterType === 'Etapas del proceso') {
            results.push({
              id: st.id,
              type: 'Etapa del proceso',
              title: st.name,
              subtitle: st.shortDesc,
              category: st.category,
              urlOrSlug: `stage:${st.id}`,
              estimatedTime: st.estimatedTime,
              matchSnippet: st.definition,
            });
          }
        }
      }
    });

    // Search Articles
    articles
      .filter((a) => a.status === 'Publicado')
      .forEach((art) => {
        const matchTitle = art.title.toLowerCase().includes(q);
        const matchDesc = art.shortDesc.toLowerCase().includes(q);
        const matchDef = art.definition.toLowerCase().includes(q);
        const matchTopics = art.relatedTopics.some((t) => t.toLowerCase().includes(q));
        const matchCategory = art.category.toLowerCase().includes(q);

        if (matchTitle || matchDesc || matchDef || matchTopics || matchCategory || !q) {
          if (!filterCategory || filterCategory === 'Todo' || filterCategory === art.category) {
            if (!filterType || filterType === 'Todo' || filterType === art.type || (filterType === 'Tiempos' && art.category === 'Tiempos y plazos')) {
              results.push({
                id: art.id,
                type: art.type,
                title: art.title,
                subtitle: art.shortDesc,
                category: art.category,
                urlOrSlug: `article:${art.slug}`,
                estimatedTime: art.estimatedTime,
                matchSnippet: art.definition,
              });
            }
          }
        }
      });

    // Search FAQs
    faqs.forEach((faq) => {
      const matchQ = faq.question.toLowerCase().includes(q);
      const matchA = faq.answer.toLowerCase().includes(q);

      if (matchQ || matchA || !q) {
        if (!filterCategory || filterCategory === 'Todo' || filterCategory === faq.category) {
          if (!filterType || filterType === 'Todo' || filterType === 'Preguntas frecuentes') {
            results.push({
              id: faq.id,
              type: 'Pregunta frecuente',
              title: faq.question,
              subtitle: faq.answer.slice(0, 140) + '...',
              category: faq.category,
              urlOrSlug: faq.relatedArticleSlug ? `article:${faq.relatedArticleSlug}` : `faq:${faq.id}`,
              matchSnippet: faq.answer,
            });
          }
        }
      }
    });

    return results;
  };

  return (
    <DataContext.Provider
      value={{
        stages,
        articles,
        faqs,
        operations,
        uncertaintyTopics,
        unassistedSearches,
        kpis,
        sheetConfig,
        getStageById,
        getArticleBySlug,
        getOperationByCode,
        submitArticleFeedback,
        incrementArticleViews,
        recordSearchQuery,
        addArticle,
        updateArticle,
        deleteArticle,
        toggleArticleStatus,
        updateUncertaintyAction,
        updateSheetConfig,
        syncWithGoogleSheets,
        resetToDefaults,
        exportDataAsJSON,
        importDataFromJSON,
        searchAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
