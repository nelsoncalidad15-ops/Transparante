import {
  ProcessStage,
  LibraryArticle,
  FAQItem,
  ClientOperation,
  UncertaintyTopic,
  UnassistedSearch,
  QualityKPIs,
} from '../types';

export const INITIAL_STAGES: ProcessStage[] = [
  {
    id: 'cierre',
    stepNumber: 1,
    name: 'Cierre de operación',
    shortDesc: 'Formalización del boleto de reserva, seña y validación comercial.',
    definition:
      'Es el punto de partida formal donde se acuerdan las condiciones comerciales, se firma la solicitud de compra / reserva de la unidad y se define el medio de pago o financiación.',
    whatHappens: [
      'Firma de solicitud de reserva / boleto de compra.',
      'Definición de modalidad de pago (contado, financiación prendaria, plan de ahorro o entrega de usado).',
      'Asignación inicial del pedido en el sistema comercial del concesionario.',
      'Apertura del legajo digital y recopilación de datos de contacto.',
    ],
    estimatedTime: '1 a 3 días hábiles',
    timeDisclaimer:
      'Los tiempos dependen de la confirmación de la seña, disponibilidad de cupo de fábrica y firma de la documentación de compra.',
    timeFactors: [
      'Demoras en la acreditación bancaria de la seña.',
      'Validación de aprobaciones crediticias si aplica financiación.',
      'Envío y recepción de firmas físicas o electrónicas.',
    ],
    nextStep: 'Facturación de la unidad por parte de la terminal o concesionario.',
    iconName: 'FileSignature',
    category: 'Proceso de compra',
  },
  {
    id: 'facturacion',
    stepNumber: 2,
    name: 'Facturación',
    shortDesc: 'Emisión de la factura oficial con chasis y motor asignados.',
    definition:
      'Es la etapa en la que se emite la factura legal de la unidad a nombre del titular. En este momento el vehículo queda formalmente individualizado con su número de chasis (VIN) y motor.',
    whatHappens: [
      'Emisión formal de la factura fiscal (Factura A o B) con número de chasis y motor.',
      'Generación de certificados de fabricación / importación de la unidad.',
      'Cierre administrativo de saldos o integración de anticipos.',
      'Envío de la documentación al equipo de gestoría.',
    ],
    estimatedTime: '3 a 7 días hábiles',
    timeDisclaimer:
      'El plazo cuenta desde la integración total del saldo acordado y la liberación de la unidad por la terminal automotriz.',
    timeFactors: [
      'Tiempos de procesamiento administrativo y facturación de la fábrica o terminal.',
      'Completitud del pago del saldo y gastos de entrega convenidos.',
      'Validación fiscal ante ARCA/AFIP del comprador.',
    ],
    nextStep: 'Gestoría administrativa y preparación de formularios para patentar.',
    iconName: 'ReceiptText',
    category: 'Facturación',
  },
  {
    id: 'gestoria',
    stepNumber: 3,
    name: 'Gestoría',
    shortDesc: 'Trámites y verificaciones documentales previas al registro.',
    definition:
      'Es la etapa en la que nuestro equipo de gestoría realiza los trámites administrativos y verificaciones documentales necesarios ante los organismos correspondientes para habilitar el patentamiento.',
    whatHappens: [
      'Verificación y control de documentación del titular (DNI, constancia CUIT/CUIL, estado civil, poderes).',
      'Confección y certificación de formularios oficiales (Formulario 01, 12 de verificación, 13D de multas y patentes).',
      'Gestión y pago de tasas arancelarias, sellados provinciales y aranceles registrales.',
      'Seguimiento administrativo y asignación del turno registral.',
    ],
    estimatedTime: '7 a 15 días hábiles',
    timeDisclaimer:
      'Los tiempos son orientativos y pueden variar según el tipo de operación, jurisdicción del titular, documentación disponible y organismos intervinientes.',
    timeFactors: [
      'Tiempos de liquidación de impuestos y sellados en rentas provinciales.',
      'Demoras en la obtención de firmas certificadas ante escribano o banco.',
      'Trámites especiales por exenciones impositivas, personas jurídicas o discapacidad.',
      'Observaciones formales por domicilios o divergencias en padrones fiscales.',
    ],
    nextStep: 'Ingreso al Registro Automotor (DNRPA) para el patentamiento formal.',
    iconName: 'FolderCheck',
    category: 'Gestoría',
  },
  {
    id: 'patentamiento',
    stepNumber: 4,
    name: 'Patentamiento',
    shortDesc: 'Inscripción registral en DNRPA y asignación de patente/chapa.',
    definition:
      'Es el proceso formal mediante el cual el vehículo se inscribe en el Registro Seccional de la Propiedad del Automotor (DNRPA) correspondiente al domicilio del titular, obteniendo su dominio (chapa patente).',
    whatHappens: [
      'Ingreso del trámite en el Registro Seccional competente.',
      'Calificación del trámite por parte del Encargado de Registro.',
      'Asignación del número de dominio (chapa patente alfanumérica).',
      'Emisión de Título Digital (CAT) y Cédula de Identificación del Automotor (Cédula Verde).',
    ],
    estimatedTime: '15 a 30 días hábiles',
    timeDisclaimer:
      'Los plazos del Registro de la Propiedad Automotor dependen exclusivamente de la carga operativa del seccional asignado por el código postal del titular.',
    timeFactors: [
      'Demoras en turnos o capacidad de procesamiento del Registro Seccional.',
      'Observaciones administrativas o solicitudes de subsanación documental.',
      'Paros gremiales, asuetos o caídas del sistema central de DNRPA.',
      'Tiempos de confección y envío físico de las placas metálicas patentes.',
    ],
    nextStep: 'Alistamiento, lavado, colocación de patentes y control de calidad.',
    iconName: 'ShieldCheck',
    category: 'Patentamiento',
  },
  {
    id: 'preparacion',
    stepNumber: 5,
    name: 'Preparación de la unidad',
    shortDesc: 'Inspección técnica de pre-entrega (PDI), accesorios y alistamiento.',
    definition:
      'Es la etapa técnica en la que el vehículo ingresa a nuestro taller de alistamiento para realizar el checklist de pre-entrega (PDI), instalación de accesorios solicitados y limpieza profunda de entrega.',
    whatHappens: [
      'Inspección pre-entrega técnica (fluidos, batería, presiones, software y escaneo electrónico).',
      'Instalación de accesorios opcionales contratados (polarizado, cubrecarter, tuercas de seguridad, alfombras).',
      'Colocación formal de las chapas patentes y verificación de número de chasis físico.',
      'Lavado de salón, descontaminado de pintura y sellado estético de entrega.',
    ],
    estimatedTime: '3 a 5 días hábiles',
    timeDisclaimer:
      'El alistamiento comienza de inmediato cuando el vehículo se encuentra físicamente en concesionario con patentes recibidas.',
    timeFactors: [
      'Tiempos de arribo del transporte nodriza si la unidad estaba en depósito central.',
      'Complejidad y tiempo de instalación de accesorios adicionales solicitados.',
      'Controles adicionales si se detecta algún ajuste técnico requerido en el checklist.',
    ],
    nextStep: 'Coordinación del turno formal de entrega en el salón.',
    iconName: 'Wrench',
    category: 'Entrega',
  },
  {
    id: 'turno',
    stepNumber: 6,
    name: 'Coordinación de Turno',
    shortDesc: 'Agendamiento personalizado de día y hora en el salón de entregas.',
    definition:
      'Es el momento en el que nuestro equipo de entregas se comunica con el cliente para coordinar fecha, horario y detalles del acto formal de recepción de su 0km.',
    whatHappens: [
      'Llamado telefónico o mensaje de WhatsApp del especialista de entregas.',
      'Elección de franja horaria disponible en el salón de entregas de la sucursal.',
      'Confirmación de personas que asistirán y documentación a presentar en el acto.',
      'Envío del instructivo previo de entrega con recomendaciones.',
    ],
    estimatedTime: '1 a 3 días hábiles',
    timeDisclaimer:
      'La fecha final depende de la disponibilidad del cliente y los cupos de agendamiento del salón de entregas.',
    timeFactors: [
      'Disponibilidad horaria del titular para concurrir a la sucursal.',
      'Capacidad diaria de bahías de entrega de la sucursal asignada.',
      'Coordinación de seguro del automotor previo a rodar en la vía pública.',
    ],
    nextStep: 'Entrega formal de llaves, documentación y salida del concesionario.',
    iconName: 'CalendarCheck',
    category: 'Entrega',
  },
  {
    id: 'entrega',
    stepNumber: 7,
    name: 'Entrega del vehículo',
    shortDesc: 'Recepción del 0km, explicación de comandos, documentación y llaves.',
    definition:
      'Es la culminación de la operación. En el salón de entregas, un asesor especializado te explica el funcionamiento de cada sistema, te entrega los manuales, duplicado de llaves y documentación legal.',
    whatHappens: [
      'Presentación de la unidad en la bahía de entrega protegida.',
      'Explicación guiada de comandos, conectividad multimedia y consejos de rodaje inicial.',
      'Firma de conformidad de recepción y entrega de manuales y garantía oficial.',
      'Entrega de cédula del automotor, copia de título digital y juego duplicado de llaves.',
    ],
    estimatedTime: '45 a 60 minutos (acto de entrega)',
    timeDisclaimer:
      'Dedicamos el tiempo que sea necesario para que salgas del concesionario con absoluta tranquilidad y claridad sobre tu nuevo vehículo.',
    timeFactors: [
      'Tiempo dedicado por el cliente para evacuar consultas sobre tecnología y conectividad.',
      'Revisión minuciosa de cada elemento del vehículo.',
    ],
    nextStep: '¡A disfrutar tu vehículo! Activación de servicio de postventa y primer service.',
    iconName: 'Car',
    category: 'Entrega',
  },
];

export const INITIAL_ARTICLES: LibraryArticle[] = [
  {
    id: 'art-1',
    slug: 'que-es-patentamiento',
    title: '¿Qué es el patentamiento?',
    category: 'Patentamiento',
    type: 'Artículo',
    shortDesc:
      'Proceso legal de inscripción del vehículo 0km en el Registro Automotor y asignación de chapa patente.',
    definition:
      'El patentamiento es el trámite oficial mediante el cual el vehículo se inscribe formalmente a tu nombre en la Dirección Nacional de los Registros Nacionales de la Propiedad del Automotor y Créditos Prendarios (DNRPA), otorgándole un dominio único (chapa patente) para circular en el territorio nacional.',
    whatHappens: [
      'Ingreso de formularios 01 y certificados de origen al Registro Seccional asignado según tu domicilio.',
      'Evaluación jurídica por parte del Encargado de Registro.',
      'Generación del Título Digital de Propiedad del Automotor (CAT).',
      'Emisión de la Cédula Verde y asignación de las placas patentes metálicas.',
    ],
    estimatedTime: '15 a 30 días hábiles',
    timeFactors: [
      'Tiempos y carga de trabajo del Registro Seccional asignado por código postal.',
      'Observaciones o solicitudes de rectificación de firmas o constancias de domicilio.',
      'Plazos de fabricación y distribución de placas físicas emitidas por Casa de Moneda / DNRPA.',
      'Feriados, asuetos administrativos o demoras en los sistemas registrales centrales.',
    ],
    whatNext:
      'Luego del patentamiento se avanza hacia la preparación técnica de la unidad, alistamiento en taller y coordinación de la fecha de entrega.',
    relatedTopics: ['Facturación', 'Gestoría', 'Preparación', 'Entrega', 'Documentación requerida'],
    readTimeMinutes: 3,
    status: 'Publicado',
    lastReview: '2026-08-20',
    responsible: 'Área Calidad y Gestoría Central',
    version: '2.4',
    viewsCount: 2840,
    helpfulCount: 2680,
    unhelpfulCount: 64,
  },
  {
    id: 'art-2',
    slug: 'que-es-gestoria',
    title: '¿Qué es gestoría y qué trámites incluye?',
    category: 'Gestoría',
    type: 'Artículo',
    shortDesc:
      'La gestoría es la etapa donde se revisa y valida toda la documentación antes de presentarla en el registro.',
    definition:
      'Es la etapa administrativa en la que nuestros gestores matriculados compilan, controlan y certifican todos los formularios, impuestos y antecedentes necesarios para que el trámite registral ingrese sin observaciones.',
    whatHappens: [
      'Control de identidad y poderes especiales (si compra empresa o apoderado).',
      'Liquidación y pago del impuesto a los sellos provinciales (Rentas).',
      'Confección de formularios obligatorios (01, 12, 13D, 59 si aplica).',
      'Solicitud de turno oficial en el Registro Seccional de radicación.',
    ],
    estimatedTime: '7 a 15 días hábiles',
    timeFactors: [
      'Tiempos de respuesta de organismos de rentas provinciales o AFIP.',
      'Disponibilidad del titular para certificar firmas en banco o escribano.',
      'Exenciones especiales (discapacidad, leyes de promoción o diplomáticos).',
    ],
    whatNext:
      'Una vez conformada y sellada la carpeta, se ingresa al Registro Seccional para dar inicio al patentamiento.',
    relatedTopics: ['Cierre de operación', 'Patentamiento', 'Documentación', 'Tiempos orientativos'],
    readTimeMinutes: 2,
    status: 'Publicado',
    lastReview: '2026-08-15',
    responsible: 'Equipo de Gestoría Automotriz',
    version: '1.9',
    viewsCount: 1950,
    helpfulCount: 1840,
    unhelpfulCount: 38,
  },
  {
    id: 'art-3',
    slug: 'cuando-empieza-a-correr-tiempo-entrega',
    title: '¿Cuándo empieza a correr el tiempo estimado de entrega?',
    category: 'Tiempos y plazos',
    type: 'Artículo',
    shortDesc:
      'Aclaración clave sobre el hito exacto que inicia el cómputo de plazos orientativos de entrega.',
    definition:
      'El plazo estimado de entrega no comienza el día de la seña ni de la primera consulta comercial, sino a partir del momento en que la unidad está 100% facturada, con chasis asignado y los saldos administrativos cancelados.',
    whatHappens: [
      'Validación de acreditación bancaria total del saldo o aprobación firme del crédito.',
      'Asignación física de chasis y emisión de factura oficial.',
      'Inicio formal del cómputo de días hábiles administrativos.',
    ],
    estimatedTime: 'Plazo global orientativo: 25 a 45 días hábiles desde facturación',
    timeFactors: [
      'Plazos específicos del Registro Seccional donde radica el vehículo.',
      'Tiempos de logística y traslado de fábrica o depósito central al concesionario.',
      'Colocación de equipamiento especial no estándar.',
    ],
    whatNext:
      'Podes seguir cada avance desde tu panel o consultar los hitos en la sección Mi Proceso.',
    relatedTopics: ['Facturación', 'Gestoría', 'Patentamiento', 'Tiempos orientativos'],
    readTimeMinutes: 3,
    status: 'Publicado',
    lastReview: '2026-08-25',
    responsible: 'Gerencia de Operaciones y Calidad',
    version: '2.1',
    viewsCount: 3410,
    helpfulCount: 3190,
    unhelpfulCount: 82,
  },
  {
    id: 'art-4',
    slug: 'que-pasa-despues-de-facturar-unidad',
    title: '¿Qué pasa después de facturar la unidad?',
    category: 'Facturación',
    type: 'Artículo',
    shortDesc:
      'Conocé los pasos administrativos, asignación de chasis y pase al sector de gestoría.',
    definition:
      'Una vez emitida la factura, tu vehículo ya tiene nombre y apellido (número de VIN y motor asignados). En ese momento, se generan los certificados de fabricación y la carpeta pasa de inmediato a Gestoría.',
    whatHappens: [
      'Generación de comprobante fiscal con detalle de la unidad.',
      'Emisión de certificados de fabricación o importación por parte de la terminal.',
      'Apertura formal del legajo de patentamiento.',
      'Notificación de inicio de trámites de gestoría.',
    ],
    estimatedTime: '3 a 7 días hábiles',
    timeFactors: [
      'Emisión de certificados de fábrica.',
      'Firma de documentación complementaria si hubo crédito prendario.',
    ],
    whatNext:
      'Gestoría te solicitará completar cualquier firma pendiente para ingresar al Registro Automotor.',
    relatedTopics: ['Facturación', 'Gestoría', 'Documentación', 'Financiación'],
    readTimeMinutes: 2,
    status: 'Publicado',
    lastReview: '2026-08-10',
    responsible: 'Administración de Ventas',
    version: '1.5',
    viewsCount: 1620,
    helpfulCount: 1530,
    unhelpfulCount: 29,
  },
  {
    id: 'art-5',
    slug: 'que-documentacion-puede-solicitarse',
    title: '¿Qué documentación puede solicitarse durante el proceso?',
    category: 'Documentación',
    type: 'Artículo',
    shortDesc:
      'Guía completa de papeles, constancias y requisitos para personas físicas y jurídicas.',
    definition:
      'Para inscribir legalmente un vehículo 0km en Argentina se requiere presentar documentación obligatoria exigida por DNRPA, ARCA/AFIP y el concesionario.',
    whatHappens: [
      'Personas físicas: DNI vigente (frente y dorso), constancia de CUIL/CUIT, justificación de fondos (si supera montos UIF).',
      'Personas jurídicas: Estatuto social, acta de designación de autoridades con mandato vigente, poder legal certificado, CUIT empresa.',
      'Condóminos: Documentación de cada titular con porcentaje de titularidad.',
    ],
    estimatedTime: 'Reunir antes del ingreso a gestoría',
    timeFactors: [
      'Demoras en la obtención de poderes o legalizaciones notariales.',
      'Vigencia de DNI (debe ser el último ejemplar emitido por Renaper).',
    ],
    whatNext:
      'Al enviar toda la documentación correcta y legible, el trámite avanza sin demoras.',
    relatedTopics: ['Gestoría', 'Patentamiento', 'Cierre de operación'],
    readTimeMinutes: 4,
    status: 'Publicado',
    lastReview: '2026-08-28',
    responsible: 'Mesa de Entradas y Legajos',
    version: '3.0',
    viewsCount: 2280,
    helpfulCount: 2190,
    unhelpfulCount: 41,
  },
  {
    id: 'art-6',
    slug: 'que-es-la-inspeccion-pre-entrega-pdi',
    title: '¿Qué es la preparación y control de calidad (PDI)?',
    category: 'Entrega',
    type: 'Artículo',
    shortDesc:
      'El chequeo técnico de más de 40 puntos para garantizar que tu auto esté en perfectas condiciones.',
    definition:
      'La PDI (Pre-Delivery Inspection) es un procedimiento de control exhaustivo donde técnicos certificados revisan mecánica, electrónica, niveles de fluidos, presiones, alineación de luces y cosmética antes de la entrega.',
    whatHappens: [
      'Escaneo electrónico de computadoras y actualización de software.',
      'Desprotección y lavado minucioso de carrocería e interiores.',
      'Prueba de luces, cinturones, aire acondicionado y cierre centralizado.',
      'Colocación de alfombras, tuercas de seguridad y patentes reglamentarias.',
    ],
    estimatedTime: '3 a 5 días hábiles',
    timeFactors: [
      'Complejidad del paquete de accesorios contratados.',
      'Llegada de la unidad a depósito de taller.',
    ],
    whatNext:
      'Aprobado el checklist de calidad, el equipo te contacta para fijar el turno de entrega.',
    relatedTopics: ['Preparación', 'Turno', 'Entrega'],
    readTimeMinutes: 3,
    status: 'Publicado',
    lastReview: '2026-08-12',
    responsible: 'Taller de Alistamiento y Calidad',
    version: '1.8',
    viewsCount: 1450,
    helpfulCount: 1390,
    unhelpfulCount: 22,
  },
  {
    id: 'art-7',
    slug: 'como-funciona-la-financiacion-prendaria',
    title: '¿Cómo funciona la financiación prendaria y qué plazos tiene?',
    category: 'Financiación',
    type: 'Artículo',
    shortDesc:
      'Explicación del crédito prendario, firma de contrato y prenda bancaria.',
    definition:
      'Un crédito prendario es un préstamo donde el vehículo adquirido queda como garantía hasta la cancelación del saldo. La prenda se inscribe simultáneamente con el patentamiento en el Registro Automotor.',
    whatHappens: [
      'Aprobación crediticia por parte de la entidad financiera o banco.',
      'Firma de los contratos de mutuo y pagaré prendario.',
      'Inscripción de la prenda en el Formulario 03 conjunto en DNRPA.',
      'Liquidación de fondos de la entidad crediticia al concesionario.',
    ],
    estimatedTime: '5 a 10 días hábiles en etapa de aprobación y firma',
    timeFactors: [
      'Scoring crediticio y validación de ingresos.',
      'Tiempos de liquidación del banco o financiera interviniente.',
    ],
    whatNext:
      'Acreditada la operación, se avanza con la facturación y posterior trámite de gestoría.',
    relatedTopics: ['Cierre de operación', 'Facturación', 'Gestoría'],
    readTimeMinutes: 3,
    status: 'Publicado',
    lastReview: '2026-08-05',
    responsible: 'Departamento de Créditos y Financiación',
    version: '1.4',
    viewsCount: 1820,
    helpfulCount: 1710,
    unhelpfulCount: 35,
  },
  {
    id: 'art-8',
    slug: 'que-hacer-el-dia-de-la-entrega',
    title: '¿Qué tenés que saber para el día de la entrega?',
    category: 'Entrega',
    type: 'Artículo',
    shortDesc:
      'Recomendaciones prácticas, seguro obligatorio y tiempo sugerido para el acto de entrega.',
    definition:
      'El día de la entrega es una experiencia pensada para que disfrutes tu 0km con tranquilidad. Te recomendamos asistir con 45 a 60 minutos de tiempo disponible y tu DNI físico.',
    whatHappens: [
      'Presentación oficial del vehículo en la bahía de entregas.',
      'Verificación guiada del estado exterior, interior y accesorios.',
      'Configuración de Bluetooth / Apple CarPlay / Android Auto con el asesor.',
      'Firma de remito y acta de entrega, entrega del seguro y duplicado de llaves.',
    ],
    estimatedTime: '45 a 60 minutos en sucursal',
    timeFactors: ['Puntualidad del turno coordinado.'],
    whatNext:
      'Salís rodando con tu vehículo 100% asegurado, con patentes colocadas y cédula oficial.',
    relatedTopics: ['Turno', 'Entrega', 'Documentación'],
    readTimeMinutes: 2,
    status: 'Publicado',
    lastReview: '2026-08-22',
    responsible: 'Equipo de Experiencia al Cliente',
    version: '2.0',
    viewsCount: 2980,
    helpfulCount: 2890,
    unhelpfulCount: 19,
  },
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: '¿Cuándo comienza a correr el tiempo para la entrega de mi unidad?',
    answer:
      'El tiempo estimado comienza a contar una vez que la unidad se encuentra totalmente facturada (con número de chasis y motor asignados) y con los pagos administrativos cancelados. La seña o reserva previa es el inicio comercial, pero el cómputo de trámites inicia formalmente con la facturación.',
    category: 'Tiempos y plazos',
    stageId: 'facturacion',
    relatedArticleSlug: 'cuando-empieza-a-correr-tiempo-entrega',
    order: 1,
    viewsCount: 4210,
  },
  {
    id: 'faq-2',
    question: '¿Qué significa que mi unidad está facturada?',
    answer:
      'Significa que la fábrica o el concesionario emitió la factura oficial de compra a tu nombre. Desde ese instante, tu vehículo tiene número de chasis (VIN) y número de motor asignados de forma definitiva, y el legajo pasa de inmediato al equipo de gestoría.',
    category: 'Facturación',
    stageId: 'facturacion',
    relatedArticleSlug: 'que-pasa-despues-de-facturar-unidad',
    order: 2,
    viewsCount: 3180,
  },
  {
    id: 'faq-3',
    question: '¿Qué es gestoría y por qué es necesaria?',
    answer:
      'La gestoría es la etapa donde nuestros profesionales matriculados recopilan, validan y certifican los formularios y sellados impositivos exigidos por ley antes de presentar el trámite en el Registro Seccional. Esto evita que el trámite sea rechazado o demorado.',
    category: 'Gestoría',
    stageId: 'gestoria',
    relatedArticleSlug: 'que-es-gestoria',
    order: 3,
    viewsCount: 2890,
  },
  {
    id: 'faq-4',
    question: '¿Qué es el patentamiento y cuánto puede tardar?',
    answer:
      'El patentamiento es la inscripción del vehículo en el Registro de la Propiedad Automotor (DNRPA) para obtener el dominio (patente) y la cédula verde. El tiempo orientativo habitual es de 15 a 30 días hábiles, sujeto a los plazos operativos del registro seccional asignado según tu domicilio.',
    category: 'Patentamiento',
    stageId: 'patentamiento',
    relatedArticleSlug: 'que-es-patentamiento',
    order: 4,
    viewsCount: 3950,
  },
  {
    id: 'faq-5',
    question: '¿Por qué puede demorar un trámite más de lo previsto?',
    answer:
      'Existen factores externos al concesionario que pueden incidir en los plazos, como demoras en la asignación de turnos del Registro Seccional, tiempos de acreditación de sellados en rentas provinciales, solicitudes de rectificación documental o demoras de logística nacional.',
    category: 'Tiempos y plazos',
    relatedArticleSlug: 'cuando-empieza-a-correr-tiempo-entrega',
    order: 5,
    viewsCount: 2470,
  },
  {
    id: 'faq-6',
    question: '¿Qué sucede antes de la entrega del vehículo?',
    answer:
      'Una vez que recibimos las patentes del Registro, el auto ingresa a nuestro taller para el control de calidad pre-entrega (PDI): revisión de 40 puntos mecánicos y electrónicos, colocación de accesorios contratados, lavado de salón y colocación de patentes. Luego te contactamos para coordinar día y hora de entrega.',
    category: 'Entrega',
    stageId: 'preparacion',
    relatedArticleSlug: 'que-es-la-inspeccion-pre-entrega-pdi',
    order: 6,
    viewsCount: 2150,
  },
  {
    id: 'faq-7',
    question: '¿Qué documentación necesito llevar el día que retiro mi auto?',
    answer:
      'Solo necesitás concurrir con tu DNI original vigente y la confirmación de la póliza de seguro de la unidad (que podés gestionar previamente con nuestro asesor o con tu productor de seguros). Si retira un apoderado, debe presentar poder certificado original.',
    category: 'Documentación',
    stageId: 'entrega',
    relatedArticleSlug: 'que-hacer-el-dia-de-la-entrega',
    order: 7,
    viewsCount: 2630,
  },
  {
    id: 'faq-8',
    question: '¿Puedo asegurar mi vehículo con mi propia compañía de seguros?',
    answer:
      'Sí, tenés absoluta libertad de elegir tu aseguradora o productor de confianza. Nuestro equipo te proveerá el número de chasis, motor y factura para que puedas emitir la póliza antes del día pactado para la entrega.',
    category: 'Entrega',
    order: 8,
    viewsCount: 1740,
  },
];

export const MOCK_OPERATIONS: ClientOperation[] = [
  {
    orderNumber: 'AS-84920',
    clientName: 'Martín Gómez',
    documentNumber: '34.891.204',
    vehicleModel: 'Toyota Corolla Cross',
    vehicleVersion: 'SEG 1.8 e-CVT Hybrid',
    vehicleColor: 'Blanco Perlado',
    vinMasked: '8AJBA3BE8***94012',
    currentStageId: 'gestoria',
    stageStartDate: '2026-08-26',
    estimatedDeliveryDate: '15 al 25 de Septiembre 2026',
    advisorName: 'Santiago Rossi',
    advisorPhone: '+54 9 11 4890-3312',
    concessionaireBranch: 'Sucursal Central - Av. Libertador 7400',
    notes: 'Documentación en validación por Gestoría. Formularios 01 y 12 confeccionados.',
    completedStages: ['cierre', 'facturacion'],
  },
  {
    orderNumber: 'AS-93102',
    clientName: 'Laura Fernández',
    documentNumber: '38.412.980',
    vehicleModel: 'Volkswagen Nivus',
    vehicleVersion: 'Highline 200 TSI AT',
    vehicleColor: 'Gris Platino',
    vinMasked: '9BWCA4CB3***61890',
    currentStageId: 'patentamiento',
    stageStartDate: '2026-08-18',
    estimatedDeliveryDate: '8 al 15 de Septiembre 2026',
    advisorName: 'Mariana Duarte',
    advisorPhone: '+54 9 11 5521-8840',
    concessionaireBranch: 'Sucursal Norte - Panamericana Km 42',
    notes: 'Trámite ingresado en Registro Seccional N° 4 de San Isidro. En espera de chapa patente.',
    completedStages: ['cierre', 'facturacion', 'gestoria'],
  },
  {
    orderNumber: 'AS-71829',
    clientName: 'Carlos Bianchi',
    documentNumber: '28.390.115',
    vehicleModel: 'Ford Ranger',
    vehicleVersion: 'Limited Plus 3.0 V6 4x4 AT',
    vehicleColor: 'Azul Belice',
    vinMasked: '8AFFA1FR9***10244',
    currentStageId: 'turno',
    stageStartDate: '2026-09-01',
    estimatedDeliveryDate: '5 de Septiembre 2026 (11:00 hs)',
    advisorName: 'Esteban Morales',
    advisorPhone: '+54 9 11 6320-7711',
    concessionaireBranch: 'Sucursal Oeste - Acceso Oeste Km 18',
    notes: 'PDI completada con éxito. Accesorios instalados. Turno confirmado para el 5 de Septiembre.',
    completedStages: ['cierre', 'facturacion', 'gestoria', 'patentamiento', 'preparacion'],
  },
];

export const INITIAL_UNCERTAINTY_TOPICS: UncertaintyTopic[] = [
  {
    id: 'unc-1',
    topic: 'Patentamiento y tiempos de chapa',
    category: 'Patentamiento',
    queriesCount: 180,
    percentageTotal: 28,
    monthlyVariation: '+12%',
    suggestedAction: 'Revisar contenido',
    actionStatus: 'En curso',
  },
  {
    id: 'unc-2',
    topic: 'Fecha exacta vs. fecha estimada de entrega',
    category: 'Tiempos y plazos',
    queriesCount: 145,
    percentageTotal: 22,
    monthlyVariation: '+8%',
    suggestedAction: 'Crear nuevo FAQ',
    actionStatus: 'Pendiente',
  },
  {
    id: 'unc-3',
    topic: 'Gestoría y alcance de honorarios',
    category: 'Gestoría',
    queriesCount: 98,
    percentageTotal: 15,
    monthlyVariation: '-5%',
    suggestedAction: 'Mantener',
    actionStatus: 'Resuelto',
  },
  {
    id: 'unc-4',
    topic: 'Documentación requerida para personas jurídicas',
    category: 'Documentación',
    queriesCount: 84,
    percentageTotal: 13,
    monthlyVariation: '+15%',
    suggestedAction: 'Revisar contenido',
    actionStatus: 'Pendiente',
  },
  {
    id: 'unc-5',
    topic: 'Cancelación de saldo y emisión de Factura',
    category: 'Facturación',
    queriesCount: 72,
    percentageTotal: 11,
    monthlyVariation: '-2%',
    suggestedAction: 'Mantener',
    actionStatus: 'Resuelto',
  },
  {
    id: 'unc-6',
    topic: 'Inspección técnica PDI y colocación de accesorios',
    category: 'Entrega',
    queriesCount: 68,
    percentageTotal: 11,
    monthlyVariation: '+3%',
    suggestedAction: 'Ampliar tiempos',
    actionStatus: 'Pendiente',
  },
];

export const INITIAL_UNASSISTED_SEARCHES: UnassistedSearch[] = [
  { id: 'un-1', query: 'grabado de cristales costo', date: '2026-09-01', occurrences: 18, resolved: false },
  { id: 'un-2', query: 'vtv primer año 0km', date: '2026-08-30', occurrences: 14, resolved: false },
  { id: 'un-3', query: 'garantia de bateria hibrida toyota', date: '2026-08-28', occurrences: 11, resolved: true },
  { id: 'un-4', query: 'pago en dolares billete cotizacion', date: '2026-08-26', occurrences: 9, resolved: false },
];

export const INITIAL_KPIS: QualityKPIs = {
  totalVisits: 14280,
  totalSearches: 4890,
  resolvedSearchesPercentage: 91.6,
  unassistedSearchesCount: 52,
  helpfulFeedbackPercentage: 94.2,
  avgReadTimeSeconds: 114,
};

export const INITIAL_SHEET_TEMPLATE_INFO = {
  sheetColumns: [
    'id',
    'categoria',
    'tipo',
    'titulo',
    'definicion',
    'que_hacemos',
    'tiempo_orientativo',
    'factores_que_afectan',
    'que_sigue',
    'temas_relacionados',
    'estado',
    'responsable',
    'version',
  ],
  sampleAppsScript: `/**
 * Google Apps Script Web App Endpoint para Autosol Transparente
 * 1. Abrir tu Google Sheet con las columnas de contenidos
 * 2. Ir a Extensiones > Apps Script
 * 3. Pegar este código y hacer clic en Implementar > Nueva Implementación > Aplicación Web (Acceso: Cualquier usuario)
 */

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Contenidos");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const articles = rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    updatedAt: new Date().toISOString(),
    count: articles.length,
    articles: articles
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // Manejo de sincronización bidireccional y registro de feedback
  return ContentService.createTextOutput(JSON.stringify({
    status: "received",
    message: "Contenido recibido correctamente"
  })).setMimeType(ContentService.MimeType.JSON);
}
`,
};
