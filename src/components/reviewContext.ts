// Contexto breve para que cada validación indique qué dato se confirma y por qué.
export const stageReviewContext: Record<string, string> = {
  cierre: 'Confirmar qué documento formaliza la operación, qué condiciones quedan acordadas y si la reserva implica una unidad asignada. Esto define cuándo comienza el seguimiento del cliente.',
  facturacion: 'Confirmar quién emite la factura, qué pagos o datos deben estar completos y desde cuándo se cuenta el plazo publicado. Facturar no equivale a patentar ni a entregar.',
  gestoria: 'Confirmar qué documentación y formularios corresponden según el titular y la operación, quién gestiona cada trámite y qué puede demorar el legajo.',
  patentamiento: 'Confirmar cuándo se presenta el trámite, qué Registro interviene, cómo se informa el dominio y qué ocurre si el Registro observa la documentación.',
  preparacion: 'Confirmar los controles de la unidad, los accesorios incluidos y el plazo real de preparación. Las cantidades de controles y los tiempos deben coincidir con el procedimiento vigente.',
  turno: 'Confirmar quién propone y confirma el turno, qué debe tener resuelto el cliente antes de asistir y cuándo una fecha estimada pasa a ser una cita definitiva.',
  entrega: 'Confirmar quién puede retirar la unidad, qué se verifica en el acto y qué llaves, documentos y elementos se entregan según el modelo y la operación.',
};

export const faqReviewContext: Record<string, string> = {
  'faq-1': 'Confirmar el hito desde el que Autosol calcula el plazo de entrega y si existe una condición escrita para cada operación. Evita que una estimación parezca una promesa universal.',
  'faq-2': 'Confirmar qué acredita la factura y qué gestiones siguen pendientes después de emitirla. El cliente debe poder distinguir facturación, patentamiento y entrega.',
  'faq-3': 'Confirmar qué gestiona Autosol, qué hace el Registro y cuándo se necesita una firma o documento del cliente.',
  'faq-4': 'Confirmar los pasos de inscripción, el plazo que se informa y desde qué momento se cuenta. Las demoras del Registro deben presentarse como variables.',
  'faq-5': 'Confirmar las causas habituales de demora y cómo se comunica cada cambio al cliente, sin atribuir toda demora al mismo responsable.',
  'faq-6': 'Confirmar qué controles y preparativos se realizan siempre y cuáles dependen del modelo, los accesorios o el estado de la unidad.',
  'faq-7': 'Confirmar los requisitos para retirar la unidad según titular, cotitular o tercero autorizado, y distinguir lo obligatorio de lo recomendable.',
  'faq-8': 'Confirmar si el cliente puede elegir aseguradora y qué cobertura exige una financiación prendaria. La respuesta debe reflejar la operación concreta.',
  'faq-9': 'Confirmar que la explicación describe una compra convencional y que no mezcla reglas de un plan de ahorro.',
  'faq-10': 'Confirmar qué precio, versión, disponibilidad, gastos, plazos y condiciones de la seña quedan por escrito antes de reservar.',
  'faq-11': 'Confirmar cuándo se asigna una unidad o número de chasis y qué compromiso existe antes de esa asignación.',
  'faq-12': 'Confirmar qué gastos son adicionales, cuáles pueden variar y en qué documento se informan al cliente.',
  'faq-13': 'Confirmar qué aspectos cambian por jurisdicción, tipo de titular, medio de pago o financiación y cómo se informa la excepción.',
  'faq-14': 'Confirmar a quién debe contactar el cliente ante una diferencia de precio o documentos y cómo se deja constancia de la corrección.',
  'faq-15': 'Confirmar cuándo se solicita información sobre origen de fondos y quién define la documentación aplicable. Evitar presentar un umbral o una lista fija como regla universal.',
  'faq-16': 'Confirmar los medios de pago vigentes, la razón social y cómo verifica el cliente que una cuenta o instrucción de cobro es oficial.',
  'faq-17': 'Confirmar qué documentación y firmas se requieren para cotitulares y empresas, y qué cambia si interviene un representante.',
  'faq-18': 'Confirmar el desglose de gastos de entrega, flete, formularios, sellos y aranceles para una operación en Jujuy.',
  'faq-19': 'Confirmar la libertad de elección de aseguradora y las condiciones de cobertura que puede exigir el acreedor en un vehículo prendado.',
  'faq-20': 'Confirmar qué se revisa con el cliente al retirar la unidad y qué elementos se entregan efectivamente según modelo y operación.',
  'faq-21': 'Confirmar quién avisa si falta o debe corregirse documentación, cómo se subsana y qué efecto tiene sobre el plazo informado.',
  'faq-22': 'Confirmar por qué aparecen conceptos adicionales al valor del vehículo y en qué momento deben informarse y aceptarse.',
};

export const topicReviewContext: Record<string, string> = {
  documentacion: 'Definir qué documentos pide Autosol a una persona, una empresa, un cotitular o quien retira por un tercero; cuáles son obligatorios y cuáles dependen del caso. Esto permite publicar una lista útil sin exigir de más.',
  pagos: 'Definir qué incluye la cotización y qué se cobra aparte: patentamiento, sellos, gestoría, seguro, accesorios y otros conceptos. Confirmar también los medios de pago vigentes para que el cliente conozca el costo completo.',
  'plazo-total': 'Definir si existe un plazo general de entrega, desde qué hito se cuenta y cómo se informa una demora. Así la fecha estimada se distingue del turno confirmado.',
  pdi: 'Definir los controles de preparación que se realizan realmente, cuánto suelen tardar y qué tareas dependen del modelo o de accesorios. Las cifras publicadas deben corresponder al procedimiento vigente.',
  entrega: 'Definir cuándo debe estar vigente el seguro, quién puede retirar el vehículo y qué documentación, llaves y elementos se entregan. Esto permite dar al cliente instrucciones precisas antes del turno.',
};
