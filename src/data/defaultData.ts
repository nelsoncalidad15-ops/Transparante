import {
  ProcessStage,
  LibraryArticle,
  FAQItem,
  ClientOperation,
  UncertaintyTopic,
  UnassistedSearch,
  QualityKPIs,
  SiteText,
} from '../types';

export const INITIAL_SITE_TEXTS: SiteText[] = [
  { key: 'hero_eyebrow', section: 'Inicio', label: 'Antetítulo principal', value: 'Autosol Jujuy', description: 'Texto pequeño sobre el título principal.', active: true },
  { key: 'hero_title', section: 'Inicio', label: 'Título principal', value: 'Tu próximo camino empieza acá.', description: 'Título grande de portada.', active: true },
  { key: 'hero_description', section: 'Inicio', label: 'Descripción principal', value: 'Información clara sobre definiciones, trámites y cada etapa para acompañarte durante la compra de tu próximo 0km.', description: 'Bajada de portada.', active: true },
  { key: 'hero_scroll', section: 'Inicio', label: 'Acceso a información', value: 'Descubrí más', description: 'Texto para bajar a las opciones.', active: true },
  { key: 'information_eyebrow', section: 'Inicio', label: 'Antetítulo información', value: 'Información clara, en un solo lugar', description: 'Antetítulo del bloque con buscador.', active: true },
  { key: 'information_title', section: 'Inicio', label: 'Título información', value: 'Entender tu proceso también genera confianza.', description: 'Título del bloque con buscador.', active: true },
  { key: 'information_description', section: 'Inicio', label: 'Descripción información', value: 'Acompañamos cada etapa de tu compra con información simple, clara y actualizada.', description: 'Bajada del bloque con buscador.', active: true },
  { key: 'search_placeholder', section: 'Inicio', label: 'Placeholder buscador', value: 'Buscá una duda, un término o una etapa...', description: 'Texto dentro del buscador.', active: true },
  { key: 'process_eyebrow', section: 'Proceso', label: 'Antetítulo proceso', value: 'Información clara sobre cada etapa del proceso', description: 'Antetítulo de la línea de etapas.', active: true },
  { key: 'process_title', section: 'Proceso', label: 'Título proceso', value: 'Conocé las etapas de tu compra', description: 'Título de la línea de etapas.', active: true },
  { key: 'process_description', section: 'Proceso', label: 'Descripción proceso', value: 'Elegí una etapa para conocer qué sucede y qué viene después.', description: 'Bajada de la línea de etapas.', active: true },
  { key: 'whatsapp_message', section: 'Contacto', label: 'Mensaje inicial de WhatsApp', value: 'Hola Autosol, tengo una consulta sobre mi operación.', description: 'Mensaje que recibe el administrativo desde el botón público.', active: true },
];

export const INITIAL_STAGES: ProcessStage[] = [
  {
    id: 'cierre',
    stepNumber: 1,
    name: 'Operación confirmada',
    shortDesc: 'Confirmación de las condiciones comerciales y el inicio formal de tu operación.',
    definition:
      'Es el inicio formal de la operación: se confirman las condiciones comerciales, la documentación disponible y la modalidad de pago. No implica por sí sola que la unidad esté facturada, patentada o lista para entregar.',
    whatHappens: [
      'Firma de solicitud de reserva / boleto de compra.',
      'Definición de modalidad de pago convencional (contado, financiación prendaria bancaria o entrega de usado).',
      'Recopilación y validación de los datos de contacto y documentación inicial de la operación.',
      'En operaciones con financiación puede generarse documentación o un legajo adicional requerido por la entidad financiera.',
    ],
    estimatedTime: 'Según validaciones comerciales y documentación',
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
    shortDesc: 'Emisión de la factura oficial e inicio de la gestión administrativa.',
    definition:
      'Es la etapa en la que se emite la factura legal de la unidad a nombre del titular y se inicia la preparación del legajo administrativo. Los datos de la unidad y la documentación aplicable se confirman según cada operación.',
    whatHappens: [
      'Emisión formal de la factura fiscal (Factura A o B) con número de chasis y motor.',
      'Generación de certificados de fabricación / importación de la unidad.',
      'Cierre administrativo de saldos o integración de anticipos.',
      'Envío de la documentación al equipo de gestoría.',
    ],
    estimatedTime: '3 a 7 días hábiles',
    timeDisclaimer:
      'La facturación se realiza una vez cumplidas la documentación requerida, las firmas, las condiciones de pago y demás validaciones que correspondan. Desde entonces, la emisión puede demandar aproximadamente entre 3 y 7 días hábiles.',
    timeFactors: [
      'Tiempos de procesamiento administrativo y facturación de la fábrica o terminal.',
      'Completitud del pago del saldo y gastos de entrega convenidos.',
      'Validación fiscal y documental que corresponda ante ARCA.',
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
      'Preparación y control de los formularios y documentación registral que correspondan según las características de la operación.',
      'Gestión administrativa de los aranceles, tasas y sellados que correspondan a la operación. Los conceptos aplicables dependen de cada operación y jurisdicción y deben estar informados en las condiciones comerciales.',
      'Seguimiento administrativo y asignación del turno registral.',
    ],
    estimatedTime: 'Plazo orientativo según legajo y jurisdicción',
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
      'Emisión del Título Digital y de la Cédula de Identificación del Automotor, según corresponda.',
    ],
    estimatedTime: 'Sujeto al Registro Seccional y a la documentación',
    timeDisclaimer:
      'Los tiempos pueden variar según el Registro Seccional correspondiente. Cuando la radicación debe gestionarse fuera de la plaza habitual, el trámite puede requerir tiempos adicionales.',
    timeFactors: [
      'Tiempos de procesamiento o eventuales observaciones del Registro Seccional.',
      'Observaciones administrativas o solicitudes de subsanación documental.',
      'Paros gremiales, asuetos o caídas del sistema central de DNRPA.',
      'Gestiones provinciales aplicables; por ejemplo, sellos si la radicación corresponde a Jujuy.',
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
      'Es la etapa de control técnico y estético de pre-entrega (PDI) según el procedimiento aplicable a la unidad. También pueden instalarse los accesorios contratados.',
    whatHappens: [
      'Inspección técnica y estética previa a la entrega según el procedimiento aplicable a la unidad.',
      'Instalación de accesorios opcionales contratados, cuando corresponda.',
      'Preparación de la unidad y colocación de las placas patentes que correspondan.',
    ],
    estimatedTime: 'Según programación operativa y preparación de la unidad',
    timeDisclaimer:
      'El alistamiento se programa según la disponibilidad de la unidad, la documentación y la planificación operativa del concesionario.',
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
    name: 'Coordinación de entrega',
    shortDesc: 'Agendamiento personalizado de día y hora en el salón de entregas.',
    definition:
      'Es el momento en el que nuestro equipo de entregas se comunica con el cliente para coordinar fecha, horario y detalles del acto formal de recepción de su 0km.',
    whatHappens: [
      'Llamado telefónico o mensaje de WhatsApp del especialista de entregas.',
      'Elección de franja horaria disponible en el salón de entregas de la sucursal.',
      'Confirmación de personas que asistirán y documentación a presentar en el acto.',
      'Envío del instructivo previo de entrega con recomendaciones.',
    ],
    estimatedTime: 'Según disponibilidad de agenda y condiciones de la operación',
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
      'Es la culminación de la operación. Durante la entrega se explica el funcionamiento de la unidad y se proporciona la documentación y los elementos que correspondan a esa operación.',
    whatHappens: [
      'Presentación de la unidad en la bahía de entrega protegida.',
      'Explicación guiada de comandos, conectividad multimedia y consejos de rodaje inicial.',
      'Revisión de la unidad y firma de la documentación de recepción que corresponda.',
      'Entrega de la documentación aplicable, que puede incluir factura, Cédula de Identificación del Automotor, copia impresa del Título Digital, manuales y juego duplicado de llaves.',
    ],
    estimatedTime: '45 a 60 minutos (acto de entrega)',
    timeDisclaimer:
      'La duración del acto de entrega puede variar según la unidad y las consultas del cliente.',
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
      'Presentación de los formularios y certificados de origen que correspondan ante el Registro Seccional competente.',
      'Evaluación jurídica por parte del Encargado de Registro.',
      'Generación del Título Digital de Propiedad del Automotor (CAT).',
      'Emisión de la Cédula de Identificación del Automotor y asignación de las placas patentes, según corresponda.',
    ],
    estimatedTime: 'Plazo sujeto al Registro Seccional y a la documentación completa',
    timeFactors: [
      'Tiempos, requisitos y eventuales observaciones del Registro Seccional que corresponda al titular.',
      'Observaciones o solicitudes de rectificación de firmas o constancias de domicilio.',
      'Plazos de fabricación y distribución de placas físicas emitidas por Casa de Moneda / DNRPA.',
      'La radicación fuera de la plaza habitual puede requerir tiempos adicionales.',
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
      'Es la etapa administrativa en la que se prepara y controla la documentación registral que corresponda a la operación. Los conceptos aplicables dependen de cada operación y jurisdicción y deben estar informados en las condiciones comerciales.',
    whatHappens: [
      'Control de identidad y poderes especiales (si compra empresa o apoderado).',
      'Gestión administrativa de los aranceles, tasas y sellados que correspondan a la operación.',
      'Preparación y control de los formularios y documentación registral que correspondan según las características de la operación.',
      'Solicitud de turno oficial en el Registro Seccional de radicación.',
    ],
    estimatedTime: 'Plazo orientativo según documentación y jurisdicción',
    timeFactors: [
      'Tiempos de respuesta de organismos de rentas provinciales o ARCA, cuando corresponda.',
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
      'Plazo estimado: aproximadamente 25 días hábiles desde el patentamiento. Los tiempos son orientativos y pueden variar según las características de cada operación, la preparación de la unidad, la disponibilidad de turnos y otras gestiones intervinientes.',
    whatHappens: [
      'Patentamiento de la unidad.',
      'Preparación técnica y estética de pre-entrega.',
      'Coordinación formal del día y horario con el cliente.',
    ],
    estimatedTime: 'Aproximadamente 25 días hábiles desde el patentamiento',
    timeFactors: [
      'Preparación técnica y estética de la unidad.',
      'Disponibilidad de agenda para coordinar la entrega.',
      'Instalación de accesorios contratados y otras gestiones intervinientes, según corresponda.',
    ],
    whatNext:
      'Podés consultar las etapas orientativas del proceso y comunicarte con Autosol para conocer información particular de tu operación. La fecha de entrega queda confirmada cuando Autosol coordina formalmente el día y horario con vos.',
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
      'Conocé las gestiones documentales y registrales que siguen a la facturación.',
    definition:
      'Una vez emitida la factura oficial de compra, continúan las gestiones documentales y registrales que correspondan a la operación.',
    whatHappens: [
      'Generación de comprobante fiscal con detalle de la unidad.',
      'Emisión de certificados de fabricación o importación por parte de la terminal.',
      'Preparación de la documentación necesaria para el patentamiento.',
      'Continuación de las gestiones registrales correspondientes.',
    ],
    estimatedTime: 'Según documentación y condiciones de la operación',
    timeFactors: [
      'Emisión de certificados de fábrica.',
      'Firma de documentación complementaria si hubo crédito prendario.',
    ],
    whatNext:
      'Autosol te informará si corresponde completar firmas o documentación para continuar con el patentamiento.',
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
      'Para inscribir legalmente un vehículo 0km en Argentina se requiere documentación según el caso, exigida por DNRPA, ARCA, organismos provinciales y el concesionario.',
    whatHappens: [
      'Personas humanas: DNI vigente del titular. Según la operación, puede solicitarse documentación adicional de cónyuge, cotitular o apoderado.',
      'Personas jurídicas: documentación societaria y registral, según corresponda; puede incluir contrato o estatuto, constancia de CUIT, autoridades y poderes.',
      'Condóminos: Documentación de cada titular con porcentaje de titularidad.',
    ],
    estimatedTime: 'Reunir antes del ingreso a gestoría',
    timeFactors: [
      'Demoras en la obtención de poderes o legalizaciones notariales.',
      'Vigencia de DNI (debe ser el último ejemplar emitido por Renaper).',
    ],
    whatNext:
      'Informá un correo electrónico vigente y de uso frecuente. Allí pueden recibirse comunicaciones y documentación digital vinculada al patentamiento, incluido el Título Digital cuando corresponda.',
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
      'Control técnico y estético de pre-entrega (PDI) según el procedimiento aplicable a la unidad.',
    definition:
      'La PDI es el control técnico y estético de pre-entrega que se realiza según el procedimiento aplicable a la unidad.',
    whatHappens: [
      'Revisión técnica y estética previa a la entrega.',
      'Preparación de la unidad según sus características.',
      'Instalación de accesorios contratados, si corresponde.',
    ],
    estimatedTime: 'Según programación operativa y preparación de la unidad',
    timeFactors: [
      'Complejidad del paquete de accesorios contratados.',
      'Llegada de la unidad a depósito de taller.',
    ],
    whatNext:
      'Una vez preparada la unidad y cumplidas las condiciones de la operación, Autosol coordina formalmente el día y horario de entrega.',
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
      'La financiación prendaria está sujeta a aprobación y a las condiciones de la entidad financiera interviniente. El vehículo queda afectado a una prenda hasta la cancelación del crédito.',
    whatHappens: [
      'Aprobación crediticia por parte de la entidad financiera o banco.',
      'Firma de la documentación crediticia y registral que corresponda.',
      'Inscripción de la prenda según las condiciones de la operación.',
      'Liquidación de fondos de la entidad crediticia al concesionario.',
    ],
    estimatedTime: 'Según propuesta crediticia vigente',
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
      'Firma de la documentación de entrega y recepción de los elementos que correspondan a la operación.',
    ],
    estimatedTime: '45 a 60 minutos en sucursal',
    timeFactors: ['Puntualidad del turno coordinado.'],
    whatNext:
      'La unidad no puede ser retirada sin cobertura de seguro vigente. Si entregás un usado como parte de pago, también deben estar cumplidas sus condiciones y documentación antes del retiro del 0 km.',
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
  {
    id: 'art-9',
    slug: 'requisitos-documentacion-compra-0km',
    title: '¿Qué documentación legal se exige según el tipo de comprador?',
    category: 'Documentación',
    type: 'Artículo',
    shortDesc:
      'Documentación orientativa para personas humanas y jurídicas y posible justificación del origen de fondos.',
    definition:
      'La documentación necesaria depende de las características de cada operación. Autosol informará los requisitos registrales y, cuando corresponda, los relativos al origen de los fondos.',
    whatHappens: [
      'Personas humanas: DNI vigente del titular. Según la operación, puede solicitarse documentación adicional de cónyuge, cotitular o apoderado.',
      'Condominio: si compran dos titulares, fijación expresa de porcentajes de condominio (ej. 50% y 50%) con DNI y CUIL de ambos.',
      'Personas jurídicas: según la operación pueden solicitarse contrato o estatuto social, constancia de CUIT, documentación de autoridades, poderes y formularios registrales que correspondan.',
      'Origen de fondos / UIF: según la normativa vigente, determinadas operaciones pueden requerir declaraciones juradas y documentación respaldatoria. Administración informará qué corresponde en cada caso.',
    ],
    estimatedTime: 'Documentación a presentar en etapa de reserva y facturación',
    timeFactors: [
      'Plazos de certificación de firmas ante escribano público o entidad bancaria.',
      'Legalización de certificados contables ante el Consejo Profesional de Ciencias Económicas (CPCE).',
    ],
    whatNext:
      'Con la documentación correspondiente, se preparan los formularios registrales aplicables al patentamiento.',
    relatedTopics: ['Cierre de operación', 'Facturación', 'Gestoría', 'Documentación requerida'],
    readTimeMinutes: 4,
    status: 'Publicado',
    lastReview: '2026-10-05',
    responsible: 'Área Legal y Cumplimiento Normativo',
    version: '1.0',
    viewsCount: 1540,
    helpfulCount: 1480,
    unhelpfulCount: 12,
  },
  {
    id: 'art-10',
    slug: 'gastos-entrega-formularios-sellados-jujuy',
    title: '¿Qué conceptos pueden intervenir además del valor del vehículo?',
    category: 'Proceso de compra',
    type: 'Artículo',
    shortDesc:
      'Conceptos posibles según la operación y la jurisdicción de radicación.',
    definition:
      'Según las características de cada operación y la jurisdicción de radicación pueden intervenir conceptos vinculados con transporte, inscripción registral, tributos, gestoría, financiación, seguro o accesorios contratados. Los conceptos e importes aplicables deben estar informados específicamente en la propuesta de cada operación.',
    whatHappens: [
      'Transporte, inscripción registral y tributos, según correspondan.',
      'Gestoría, financiación, seguro o accesorios contratados, si aplican a la operación.',
    ],
    estimatedTime: 'Según condiciones de cada operación',
    timeFactors: [
      'Liquidación de sellados provinciales por parte de Rentas Jujuy.',
      'Aranceles actualizados periódicamente por el Ministerio de Justicia / DNRPA.',
    ],
    whatNext:
      'Consultá la propuesta de tu operación para conocer los conceptos e importes aplicables.',
    relatedTopics: ['Facturación', 'Gestoría', 'Patentamiento', 'Tiempos orientativos'],
    readTimeMinutes: 3,
    status: 'Publicado',
    lastReview: '2026-10-05',
    responsible: 'Administración y Gestoría Autosol',
    version: '1.0',
    viewsCount: 2120,
    helpfulCount: 2040,
    unhelpfulCount: 18,
  },
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: '¿Cuándo comienza a correr el tiempo para la entrega de mi unidad?',
    answer:
      'Plazo estimado: aproximadamente 25 días hábiles desde el patentamiento. Los tiempos son orientativos y pueden variar según las características de cada operación, la preparación de la unidad, la disponibilidad de turnos y otras gestiones intervinientes. La fecha se confirma cuando Autosol coordina formalmente el día y horario con el cliente.',
    category: 'Tiempos y plazos',
    stageId: 'patentamiento',
    relatedArticleSlug: 'cuando-empieza-a-correr-tiempo-entrega',
    order: 1,
    viewsCount: 4210,
  },
  {
    id: 'faq-2',
    question: '¿Qué significa que mi unidad está facturada?',
    answer:
      'La factura oficial de compra se emite una vez cumplidas la documentación requerida, las firmas, las condiciones de pago y demás validaciones que correspondan. Desde que se completan esos requisitos, la emisión puede demandar aproximadamente entre 3 y 7 días hábiles. Que la unidad esté facturada significa que ya se emitió esa factura; después continúan las gestiones registrales y de entrega.',
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
      'La gestoría prepara y controla los formularios y la documentación registral que correspondan según las características de la operación. También gestiona los aranceles, tasas y sellados aplicables, que deben estar informados en las condiciones comerciales.',
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
      'El patentamiento es la inscripción del vehículo en el Registro de la Propiedad Automotor (DNRPA) para obtener el dominio y la documentación correspondiente. Los tiempos pueden variar según el Registro Seccional. Cuando la radicación debe gestionarse fuera de la plaza habitual, el trámite puede requerir tiempos adicionales. Consultá a Autosol por tu operación.',
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
      'La unidad pasa por un control técnico y estético de pre-entrega (PDI) según el procedimiento aplicable. Luego se coordina la entrega según la preparación de la unidad, la disponibilidad de agenda y las condiciones de la operación.',
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
      'Presentá tu DNI vigente y asegurate de que la unidad cuente con seguro vigente. Deben estar cumplidas las condiciones administrativas y de pago acordadas para tu operación. Si retira otra persona, consultá previamente a Autosol qué documentación corresponde.',
    category: 'Documentación',
    stageId: 'entrega',
    relatedArticleSlug: 'que-hacer-el-dia-de-la-entrega',
    order: 7,
    viewsCount: 2630,
  },
  {
    id: 'faq-8',
    question: '¿Puedo elegir la compañía de seguros para mi 0 km?',
    answer:
      'Si la operación no posee financiación prendaria, podés gestionar la cobertura con tu aseguradora o productor de confianza, siempre que la unidad cuente con seguro vigente al momento del retiro. Cuando existe financiación prendaria, la cobertura debe cumplir las condiciones establecidas por la entidad financiera.',
    category: 'Entrega',
    order: 8,
    viewsCount: 1740,
  },
  {
    id: 'faq-9',
    question: '¿Qué es una venta convencional y en qué se diferencia de un plan de ahorro?',
    answer: 'En esta guía, venta convencional es la compra acordada directamente con el concesionario, con las condiciones comerciales documentadas para esa operación. Un plan de ahorro tiene reglas y etapas propias, por lo que no corresponde aplicar automáticamente esta guía a una adjudicación por plan.',
    category: 'Proceso de compra',
    order: 9,
    viewsCount: 0,
  },
  {
    id: 'faq-10',
    question: '¿Qué conviene confirmar por escrito antes de hacer una reserva?',
    answer: 'Pedí que la propuesta identifique modelo y versión, precio y vigencia, qué gastos incluye y cuáles no, forma de pago, condiciones de la reserva, disponibilidad o asignación de la unidad y plazo o condiciones de entrega informados para tu caso.',
    category: 'Proceso de compra',
    stageId: 'cierre',
    order: 10,
    viewsCount: 0,
  },
  {
    id: 'faq-11',
    question: '¿Reservar un modelo significa que ya tengo un vehículo asignado?',
    answer: 'No necesariamente. Una reserva, la asignación de una unidad identificada por su número de chasis, la facturación y la inscripción registral son hitos distintos. Consultá a tu asesor cuál de ellos se cumplió en tu operación.',
    category: 'Proceso de compra',
    stageId: 'cierre',
    order: 11,
    viewsCount: 0,
  },
  {
    id: 'faq-12',
    question: '¿Qué gastos pueden sumarse al precio del vehículo?',
    answer: 'Según la propuesta y la jurisdicción pueden intervenir aranceles registrales, tributos, gestoría, financiación, seguro y accesorios solicitados. El importe y quién lo paga deben figurar claramente en la cotización de tu operación; esta guía no fija valores generales.',
    category: 'Proceso de compra',
    stageId: 'cierre',
    order: 12,
    viewsCount: 0,
  },
  {
    id: 'faq-13',
    question: '¿El proceso es idéntico para todos los compradores de Argentina?',
    answer: 'Las etapas generales de compra, facturación e inscripción de un 0 km son similares. Los requisitos concretos, impuestos, registro competente, financiación, documentación y tiempos pueden variar según el titular, la unidad, la radicación y las condiciones acordadas.',
    category: 'Documentación',
    order: 13,
    viewsCount: 0,
  },
  {
    id: 'faq-14',
    question: '¿Qué hago si encuentro una diferencia entre la cotización y la documentación?',
    answer: 'Antes de firmar o pagar, pedí al asesor una aclaración escrita de la diferencia y conservá la propuesta, comprobantes y mensajes de la operación. El equipo de Autosol debe indicarte quién puede resolverla y dejar asentada la condición final.',
    category: 'Proceso de compra',
    stageId: 'cierre',
    order: 14,
    viewsCount: 0,
  },
  {
    id: 'faq-15',
    question: '¿Cuándo pueden solicitar documentación sobre el origen de los fondos?',
    answer: 'Según la normativa vigente de prevención de lavado de activos, determinadas operaciones pueden requerir declaraciones juradas y documentación respaldatoria sobre el origen de los fondos. Administración informará al cliente qué documentación corresponde en su caso.',
    category: 'Documentación',
    stageId: 'facturacion',
    order: 15,
    viewsCount: 0,
  },
  {
    id: 'faq-16',
    question: '¿Cómo se realizan los pagos de manera segura y cuáles son las cuentas oficiales?',
    answer: 'Las transferencias vinculadas a la operación deben realizarse utilizando los datos bancarios oficiales informados por Autosol. La cuenta de origen debe corresponder a uno de los titulares de la operación. Si los fondos provienen de un tercero, consultá previamente con Administración, ya que puede requerirse documentación respaldatoria adicional. No realices transferencias a cuentas personales de asesores o terceros que no hayan sido informadas oficialmente por Autosol.',
    category: 'Financiación',
    stageId: 'cierre',
    order: 16,
    viewsCount: 0,
  },
  {
    id: 'faq-17',
    question: '¿Se puede inscribir el 0km en condominio (dos titulares) o a nombre de una empresa?',
    answer: 'Sí. La documentación depende de cada operación. Para una persona humana se solicita DNI vigente del titular y pueden requerirse datos adicionales de cotitular, cónyuge o apoderado. Para una persona jurídica pueden solicitarse contrato o estatuto social, constancia de CUIT, documentación de autoridades, poderes y formularios registrales que correspondan.',
    category: 'Documentación',
    stageId: 'gestoria',
    order: 17,
    viewsCount: 0,
  },
  {
    id: 'faq-18',
    question: '¿Qué conceptos pueden intervenir además del valor del vehículo?',
    answer: 'Según las características de cada operación y la jurisdicción de radicación pueden intervenir conceptos vinculados con transporte, inscripción registral, tributos, gestoría, financiación, seguro o accesorios contratados. Los conceptos e importes aplicables deben estar informados específicamente en la propuesta de cada operación.',
    category: 'Proceso de compra',
    stageId: 'gestoria',
    order: 18,
    viewsCount: 0,
  },
  {
    id: 'faq-20',
    question: '¿Qué se debe controlar y verificar formalmente el día de la entrega?',
    answer: 'Durante la entrega podés revisar junto con el equipo de Autosol el estado general de la unidad, su equipamiento y la documentación que corresponda a tu operación. Se proporciona la documentación aplicable, que puede incluir factura, Cédula de Identificación del Automotor, copia impresa del Título Digital, manuales y juego duplicado de llaves, según el caso.',
    category: 'Entrega',
    stageId: 'entrega',
    order: 20,
    viewsCount: 0,
  },
  {
    id: 'faq-21',
    question: '¿Qué sucede si durante el trámite se necesita corregir o completar documentación?',
    answer: 'Durante las gestiones administrativas o registrales puede ser necesario completar información, corregir algún dato o presentar documentación adicional según las características de la operación. En ese caso, Autosol informará al cliente qué se necesita para poder continuar con el proceso.',
    category: 'Documentación',
    stageId: 'gestoria',
    order: 21,
    viewsCount: 0,
  },
  {
    id: 'faq-23',
    question: '¿Qué condiciones deben estar cumplidas para retirar mi vehículo?',
    answer: 'Antes de la entrega, la unidad debe encontrarse patentada, deben estar cumplidas las condiciones de pago acordadas para la operación y el vehículo debe contar con seguro vigente. Si la operación incluye financiación, entrega de un usado u otra condición particular, pueden existir requisitos adicionales que serán informados por Autosol.',
    category: 'Entrega',
    stageId: 'entrega',
    order: 23,
    viewsCount: 0,
  },
];

export const MOCK_OPERATIONS: ClientOperation[] = [];

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
    'slug',
    'title',
    'category',
    'type',
    'shortDesc',
    'definition',
    'whatHappens',
    'estimatedTime',
    'timeFactors',
    'whatNext',
    'relatedTopics',
    'readTimeMinutes',
    'status',
    'lastReview',
    'responsible',
    'version',
    'viewsCount',
    'helpfulCount',
    'unhelpfulCount',
  ],
  sampleAppsScript: `/**
 * Google Apps Script Web App para Autosol Transparente
 * Ubicación del archivo en el repositorio: apps-script/Code.gs
 * 
 * Configuración en Apps Script:
 * 1. Project Settings > Script Properties:
 *    - SHEET_ID: ID de tu Google Sheet
 *    - BACKEND_SHARED_SECRET: Token secreto compartido con Vercel
 * 2. Implementar > Nueva implementación > Tipo: Aplicación web
 *    - Ejecutar como: "Yo" (tu usuario)
 *    - Quién tiene acceso: "Cualquier usuario"
 * 
 * Ver instrucciones completas en BACKEND_SETUP.md
 */`,
};
