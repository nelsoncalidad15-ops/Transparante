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
  SiteText,
} from '../types';
import {
  INITIAL_STAGES,
  INITIAL_ARTICLES,
  INITIAL_FAQS,
  MOCK_OPERATIONS,
  INITIAL_UNCERTAINTY_TOPICS,
  INITIAL_UNASSISTED_SEARCHES,
  INITIAL_KPIS,
  INITIAL_SITE_TEXTS,
} from '../data/defaultData';
import { matchesSearch, normalizeSearchText } from '../utils/search';

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
  siteTexts: SiteText[];
  articles: LibraryArticle[];
  faqs: FAQItem[];
  operations: ClientOperation[];
  uncertaintyTopics: UncertaintyTopic[];
  unassistedSearches: UnassistedSearch[];
  kpis: QualityKPIs;
  sheetConfig: SheetIntegrationState;
  
  // Actions
  getStageById: (id: ProcessStageId) => ProcessStage | undefined;
  updateStages: (stages: ProcessStage[]) => void;
  updateFaqs: (faqs: FAQItem[]) => void;
  getText: (key: string, fallback: string) => string;
  updateSiteTexts: (texts: SiteText[]) => void;
  getArticleBySlug: (slug: string) => LibraryArticle | undefined;
  getOperationByCode: (codeOrDni: string) => ClientOperation | undefined;
  
  // Feedback & Interactions
  submitArticleFeedback: (articleId: string, helpful: boolean, comment?: string) => void;
  recordSearchQuery: (query: string, resultsCount: number) => void;
  incrementArticleViews: (articleId: string) => void;
  
  // Admin & Content Management
  addArticle: (article: Omit<LibraryArticle, 'id' | 'viewsCount' | 'helpfulCount' | 'unhelpfulCount'> | LibraryArticle) => LibraryArticle;
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

const LOCAL_STORAGE_KEY_ARTICLES = 'autosol_articles_v4';
const LOCAL_STORAGE_KEY_FAQS = 'autosol_faqs_v5';
const LOCAL_STORAGE_KEY_KPIS = 'autosol_kpis_v1';
const LOCAL_STORAGE_KEY_UNCERTAINTY = 'autosol_uncertainty_v1';
const LOCAL_STORAGE_KEY_SHEET = 'autosol_sheet_config_v1';
const LOCAL_STORAGE_KEY_STAGES = 'autosol_stages_v4';
const LOCAL_STORAGE_KEY_TEXTS = 'autosol_site_texts_v2';

const normalizeStages = (items: unknown[]): ProcessStage[] => items
  .map((item) => {
    const stage = item as Record<string, unknown>;
    const list = (value: unknown) => Array.isArray(value) ? value.map(String) : typeof value === 'string' ? value.split('|').map((part) => part.trim()).filter(Boolean) : [];
    return {
      ...stage,
      id: String(stage.id || ''), stepNumber: Number(stage.stepNumber || 0), name: String(stage.name || ''), shortDesc: String(stage.shortDesc || ''), definition: String(stage.definition || ''),
      whatHappens: list(stage.whatHappens), estimatedTime: String(stage.estimatedTime || ''), timeDisclaimer: String(stage.timeDisclaimer || ''), timeFactors: list(stage.timeFactors), nextStep: String(stage.nextStep || ''),
      iconName: String(stage.iconName || 'Car'), category: String(stage.category || 'Proceso de compra'), active: !(stage.active === false || String(stage.active).toLowerCase() === 'false'),
    } as ProcessStage;
  })
  .filter((stage) => stage.id && stage.name && stage.active !== false)
  .sort((a, b) => a.stepNumber - b.stepNumber);

const mergeArticleOverrides = (overrides: LibraryArticle[]): LibraryArticle[] => {
  const byId = new Map(INITIAL_ARTICLES.map((article) => [article.id, article]));
  overrides.forEach((article) => {
    const base = byId.get(article.id);
    byId.set(article.id, base ? { ...base, ...article } : article);
  });
  return [...byId.values()].filter((article) => String((article as LibraryArticle & { deleted?: boolean | string }).deleted).toLowerCase() !== 'true');
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stages, setStages] = useState<ProcessStage[]>(() => {
    try { const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STAGES); return saved ? normalizeStages(JSON.parse(saved)) : INITIAL_STAGES; }
    catch { return INITIAL_STAGES; }
  });
  const [siteTexts, setSiteTexts] = useState<SiteText[]>(() => {
    try { const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TEXTS); return saved ? JSON.parse(saved) : INITIAL_SITE_TEXTS; }
    catch { return INITIAL_SITE_TEXTS; }
  });

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
      if (!saved) return INITIAL_FAQS;
      const existing = JSON.parse(saved) as FAQItem[];
      if (!Array.isArray(existing)) return INITIAL_FAQS;
      const existingIds = new Set(existing.map((item) => item.id));
      return [...existing, ...INITIAL_FAQS.filter((item) => !existingIds.has(item.id))];
    } catch {
      return INITIAL_FAQS;
    }
  });

  // Demo operations must never be bundled into the public production experience.
  const [operations] = useState<ClientOperation[]>(() => import.meta.env.DEV ? MOCK_OPERATIONS : []);

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
            sheetUrl: '',
            appsScriptEndpoint: '',
            apiKey: '',
            isConnected: false,
            lastSyncTimestamp: null,
            autoSync: false,
          };
    } catch {
      return {
        sheetUrl: '',
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
    try { localStorage.setItem(LOCAL_STORAGE_KEY_STAGES, JSON.stringify(stages)); } catch (e) { console.error(e); }
  }, [stages]);

  useEffect(() => {
    try { localStorage.setItem(LOCAL_STORAGE_KEY_TEXTS, JSON.stringify(siteTexts)); } catch (e) { console.error(e); }
  }, [siteTexts]);

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

  const updateStages = (updatedStages: ProcessStage[]) => setStages(normalizeStages(updatedStages));
  const updateFaqs = (updatedFaqs: FAQItem[]) => setFaqs(updatedFaqs);
  const getText = (key: string, fallback: string) => siteTexts.find((text) => text.key === key && text.active)?.value || fallback;
  const updateSiteTexts = (texts: SiteText[]) => setSiteTexts(texts);

  const getArticleBySlug = (slug: string) =>
    articles.find((a) => a.slug === slug || a.id === slug);

  const getOperationByCode = (input: string) => {
    const clean = input.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.length < 4) return undefined;
    return operations.find((op) => {
      const opNum = op.orderNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      const dni = op.documentNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      return opNum === clean || dni === clean;
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
    newArtData: Omit<LibraryArticle, 'id' | 'viewsCount' | 'helpfulCount' | 'unhelpfulCount'> | LibraryArticle
  ) => {
    const id = `art-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newArticle: LibraryArticle = {
      ...newArtData,
      id: 'id' in newArtData ? newArtData.id : id,
      slug: newArtData.slug || newArtData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      viewsCount: 'viewsCount' in newArtData ? newArtData.viewsCount : 0,
      helpfulCount: 'helpfulCount' in newArtData ? newArtData.helpfulCount : 0,
      unhelpfulCount: 'unhelpfulCount' in newArtData ? newArtData.unhelpfulCount : 0,
    };
    setArticles((prev) => [newArticle, ...prev]);
    return newArticle;
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
        if (data && (Array.isArray(data.articles) || Array.isArray(data.stages) || Array.isArray(data.texts))) {
          if (Array.isArray(data.articles)) setArticles(mergeArticleOverrides(data.articles));
          if (Array.isArray(data.faqs) && data.faqs.length > 0) setFaqs(data.faqs);
          if (Array.isArray(data.stages) && data.stages.length > 0) setStages(normalizeStages(data.stages));
          if (Array.isArray(data.texts) && data.texts.length > 0) setSiteTexts(data.texts);
          setSheetConfig((prev) => ({ ...prev, isConnected: true, lastSyncTimestamp: new Date().toLocaleString('es-AR') }));
          return { success: true, message: 'Contenido leído desde el backend.' };
        }
      }
    } catch (err) { console.warn('No se pudo leer el backend:', err); }
    setSheetConfig((prev) => ({ ...prev, isConnected: false }));
    return { success: false, message: 'No se pudo leer la planilla. Revisá el despliegue y la configuración del backend.' };
  };

  useEffect(() => {
    let mounted = true;
    fetch('/api/content', { headers: { Accept: 'application/json' } })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        const data = result?.data || result;
        if (!mounted || (!Array.isArray(data?.articles) && !Array.isArray(data?.stages) && !Array.isArray(data?.texts))) return;
        if (Array.isArray(data.articles)) setArticles(mergeArticleOverrides(data.articles));
        if (Array.isArray(data.faqs) && data.faqs.length > 0) setFaqs(data.faqs);
        if (Array.isArray(data.stages) && data.stages.length > 0) setStages(normalizeStages(data.stages));
        if (Array.isArray(data.texts) && data.texts.length > 0) setSiteTexts(data.texts);
        setSheetConfig((previous) => ({ ...previous, isConnected: true, lastSyncTimestamp: new Date().toLocaleString('es-AR') }));
      })
      .catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  const resetToDefaults = () => {
    setStages(INITIAL_STAGES);
    setSiteTexts(INITIAL_SITE_TEXTS);
    setArticles(INITIAL_ARTICLES);
    setFaqs(INITIAL_FAQS);
    setUncertaintyTopics(INITIAL_UNCERTAINTY_TOPICS);
    setKpis(INITIAL_KPIS);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ARTICLES);
      localStorage.removeItem(LOCAL_STORAGE_KEY_FAQS);
      localStorage.removeItem(LOCAL_STORAGE_KEY_UNCERTAINTY);
      localStorage.removeItem(LOCAL_STORAGE_KEY_STAGES);
      localStorage.removeItem(LOCAL_STORAGE_KEY_TEXTS);
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
        texts: siteTexts,
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
      if (parsed.stages && Array.isArray(parsed.stages)) {
        setStages(normalizeStages(parsed.stages));
      }
      if (parsed.texts && Array.isArray(parsed.texts)) {
        setSiteTexts(parsed.texts);
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
    const q = normalizeSearchText(query);
    if (!q && query.trim()) return [];
    if (!q && !filterCategory && !filterType) return [];

    const results: SearchResultItem[] = [];
    const matchesType = (type: SearchResultItem['type'], category: string) =>
      !filterType || filterType === 'Todo' || filterType === type ||
      (filterType === 'Artículos' && type === 'Artículo') ||
      (filterType === 'Preguntas frecuentes' && type === 'Pregunta frecuente') ||
      (filterType === 'Documentación' && category === 'Documentación') ||
      (filterType === 'Tiempos' && category === 'Tiempos y plazos');

    // Search Stages
    stages.forEach((st) => {
      if (matchesSearch(q, [st.name, st.shortDesc, st.definition, st.category, ...st.whatHappens, ...st.timeFactors])) {
        if (!filterCategory || filterCategory === 'Todo' || filterCategory === st.category) {
          if (matchesType('Etapa del proceso', st.category)) {
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
        if (matchesSearch(q, [art.title, art.shortDesc, art.definition, art.category, ...art.relatedTopics])) {
          if (!filterCategory || filterCategory === 'Todo' || filterCategory === art.category) {
            if (matchesType(art.type, art.category)) {
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
      if (matchesSearch(q, [faq.question, faq.answer, faq.category])) {
        if (!filterCategory || filterCategory === 'Todo' || filterCategory === faq.category) {
          if (matchesType('Pregunta frecuente', faq.category)) {
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
        siteTexts,
        articles,
        faqs,
        operations,
        uncertaintyTopics,
        unassistedSearches,
        kpis,
        sheetConfig,
        getStageById,
        updateStages,
        updateFaqs,
        getText,
        updateSiteTexts,
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
