export type ProcessStageId =
  | 'cierre'
  | 'facturacion'
  | 'gestoria'
  | 'patentamiento'
  | 'preparacion'
  | 'turno'
  | 'entrega';

export interface ProcessStage {
  id: ProcessStageId;
  stepNumber: number;
  name: string;
  shortDesc: string;
  definition: string;
  whatHappens: string[];
  estimatedTime: string;
  timeDisclaimer: string;
  timeFactors: string[];
  nextStep: string;
  iconName: string;
  category: string;
}

export type ContentCategory =
  | 'Proceso de compra'
  | 'Documentación'
  | 'Gestoría'
  | 'Patentamiento'
  | 'Facturación'
  | 'Entrega'
  | 'Financiación'
  | 'Tiempos y plazos'
  | 'Conceptos frecuentes';

export type ContentType = 'Artículo' | 'Etapa del proceso' | 'Pregunta frecuente' | 'Documentación';

export interface LibraryArticle {
  id: string;
  slug: string;
  title: string;
  category: ContentCategory;
  type: ContentType;
  shortDesc: string;
  definition: string;
  whatHappens?: string[];
  estimatedTime?: string;
  timeFactors?: string[];
  whatNext?: string;
  relatedTopics: string[];
  readTimeMinutes: number;
  status: 'Publicado' | 'En revisión' | 'Borrador' | 'Desactivado';
  lastReview: string;
  responsible: string;
  version: string;
  viewsCount: number;
  helpfulCount: number;
  unhelpfulCount: number;
  feedbackComments?: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: ContentCategory;
  stageId?: ProcessStageId;
  relatedArticleSlug?: string;
  order: number;
  viewsCount: number;
}

export interface ClientOperation {
  orderNumber: string;
  clientName: string;
  documentNumber: string;
  vehicleModel: string;
  vehicleVersion: string;
  vehicleColor: string;
  vinMasked: string;
  currentStageId: ProcessStageId;
  stageStartDate: string;
  estimatedDeliveryDate: string;
  advisorName: string;
  advisorPhone: string;
  concessionaireBranch: string;
  notes: string;
  completedStages: ProcessStageId[];
}

export interface UncertaintyTopic {
  id: string;
  topic: string;
  category: ContentCategory;
  queriesCount: number;
  percentageTotal: number;
  monthlyVariation: string;
  suggestedAction: 'Revisar contenido' | 'Crear nuevo FAQ' | 'Mantener' | 'Ampliar tiempos';
  actionStatus: 'Pendiente' | 'En curso' | 'Resuelto';
}

export interface UnassistedSearch {
  id: string;
  query: string;
  date: string;
  occurrences: number;
  resolved: boolean;
}

export interface QualityKPIs {
  totalVisits: number;
  totalSearches: number;
  resolvedSearchesPercentage: number;
  unassistedSearchesCount: number;
  helpfulFeedbackPercentage: number;
  avgReadTimeSeconds: number;
}

export interface SheetIntegrationState {
  sheetUrl: string;
  appsScriptEndpoint: string;
  apiKey: string;
  isConnected: boolean;
  lastSyncTimestamp: string | null;
  autoSync: boolean;
}

export type CaseStatus = 'verde' | 'amarillo' | 'rojo';

export interface DeliveryCase {
  id: string;
  clientName: string;
  phone: string;
  vehicleModel: string;
  currentStatus: string;
  invoiceDate: string;
  appointmentDate: string;
  lastModifiedDate: string;
  operationNumber: string;
  advisor: string;
}

export interface StageTiming {
  key: string;
  label: string;
  description: string;
  warningDays: number;
  limitDays: number;
  message: string;
}
