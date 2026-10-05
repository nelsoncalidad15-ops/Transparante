# Backend seguro: Vercel + Apps Script + Google Sheets

## Opción gratuita para Autosol: Cloudflare Pages

El repositorio también incluye `public/_worker.js`, que permite alojar la web y su API en Cloudflare Pages. El contenido inicial sigue dentro del código; la API lee las modificaciones publicadas desde Apps Script. Los archivos estáticos no necesitan consultar la planilla para aparecer en pantalla.

1. En Cloudflare Pages, conectá el repositorio de GitHub. Configurá **Build command** `npm run build` y **Build output directory** `dist`. La integración con Git debe incluir `public/_worker.js` en la compilación.
2. En **Settings → Variables and Secrets**, cargá `APPS_SCRIPT_URL` con la URL `/exec` y `APPS_SCRIPT_SHARED_SECRET` con el mismo valor que `BACKEND_SHARED_SECRET` de Apps Script. Ambos deben estar disponibles para Production; usá secretos para las claves.
3. Ejecutá localmente `node scripts/create-cloudflare-password.mjs`. Guardá la contraseña que muestra y cargá el hash como `ADMIN_PASSWORD_SHA256`. Cargá `ADMIN_USERNAME` como `admin`.
4. Ejecutá de nuevo `node scripts/create-cloudflare-password.mjs` y usá la nueva contraseña generada como `SESSION_SECRET`. Guardala solo en Cloudflare. Opcionalmente, repetí el paso 3 para `COLLABORATOR_PASSWORD_SHA256` y configurá `COLLABORATOR_USERNAME`.
5. Volvé a desplegar. Abrí el dominio de Cloudflare Pages, comprobá que `/api/content` devuelve JSON y que **Acceso interno** permite iniciar sesión. Probá **Guardar revisión**, recargá en otro navegador y confirmá que el borrador persiste antes de publicar.

La contraseña de Cloudflare debe ser la aleatoria generada por el script: el hash SHA-256 aquí se usa únicamente con una clave de alta entropía. Las variables `ADMIN_PASSWORD_HASH` de la opción Vercel usan otro formato y no son intercambiables. La implementación de Apps Script debe admitir el acceso **Cualquier usuario** para que Cloudflare pueda invocarla; la planilla permanece privada y el script exige el secreto en cada solicitud de datos.

Hasta que pruebes el dominio final, la URL de GitHub Pages seguirá mostrando el sitio estático pero no podrá guardar cambios compartidos.

## Reunión con Administración: una sola pantalla

En la versión alojada en Vercel, entrá en **Acceso interno**, iniciá sesión como administrador, pulsá **Editar datos** y abrí **Revisar y validar**. Esa es la pantalla inicial del editor. Abrí cada etapa o pregunta, leé el texto, corregilo allí mismo si hace falta y marcá **Validado**. En **Datos de Autosol a confirmar**, anotá las respuestas del administrativo en el campo de notas. Podés usar **Copiar resumen** o **Imprimir** para la reunión.

**Guardar revisión** conserva un borrador en las pestañas `RevisionEtapas`, `RevisionPreguntas` y `Revision` del Sheet, sin cambiar lo que ve el público. **Publicar todo validado** se habilita cuando cada punto está marcado y copia las etapas y preguntas a las pestañas públicas `Etapas` y `Preguntas`. El código de la web contiene la información inicial y se muestra de inmediato; al cargar, la web consulta los cambios publicados en el Sheet. Los artículos modificados en la planilla se aplican sobre los artículos del código. Los datos de los cinco temas a confirmar quedan como notas internas de revisión; si implican cambios en otros textos de la web, hay que editarlos en **Otras herramientas** antes de darlos por publicados.

Si aparece **Backend no disponible**, los cambios quedan únicamente en ese navegador. No se comparten entre equipos ni se publican. La URL actual de GitHub Pages sirve archivos estáticos y no ejecuta las funciones `/api` de este proyecto; para guardar en Sheets y usar el acceso de administrador se necesita publicar también la aplicación en Vercel y configurar las variables que se detallan abajo.

El navegador solo llama a Vercel. Vercel valida la sesión de administrador y recién entonces consulta Apps Script. El Sheet no debe compartirse públicamente.

## Tablero de contención de clientes

El panel interno usa primero la pestaña `Agenda` y, si no existe, `Operaciones`. Pegá o vinculá allí la exportación operativa con estos encabezados exactos: `Cliente`, `Teléfono`, `Modelo`, `Ultimo Estado`, `Fecha Facturación`, `Fecha Gestión Turno`, `Fecha Últ Modificación`, `N° Operación` y `Gestionado por`.

El tablero prioriza `Facturado`, `Patentado`, `Preturno` y `Turno`. Cuenta días hábiles entre etapas y ordena los casos en verde, amarillo y rojo. Las filas con estado `Entregado` no se muestran.

## Etapas y definiciones para clientes

La pestaña `Etapas` es la fuente de información para el recorrido que ve el cliente. Se crea automáticamente desde **Administración → Etapas del cliente** al presionar **Guardar etapas**. Sus columnas son: `id`, `stepNumber`, `name`, `shortDesc`, `definition`, `whatHappens`, `estimatedTime`, `timeDisclaimer`, `timeFactors`, `nextStep`, `iconName`, `category` y `active`.

La configuración inicial tiene siete pasos: Operación confirmada, Facturación, Gestoría, Patentamiento, Preparación, Coordinación de entrega y Entrega. Podés editar textos, plazos, orden, visibilidad o agregar nuevos pasos desde el panel; no hace falta modificar código.

## Textos generales del sitio

La pestaña `Textos` guarda títulos, bajadas, placeholders y mensajes de contacto visibles para clientes. Desde **Administración → Textos del sitio**, el perfil `admin` puede editar o agregar filas. Las columnas son `key`, `section`, `label`, `value`, `description` y `active`. La clave identifica el lugar donde se muestra el texto; no la cambies salvo que se modifique el código.

Administración puede editar los límites del semáforo desde el panel. Al guardar, se crea o actualiza automáticamente la pestaña `Configuracion semaforo`; no hace falta crearla antes.

Para habilitar colaboradores, generá un segundo hash con `node scripts/create-password-hash.mjs` y cargalo en Vercel como `COLLABORATOR_PASSWORD_HASH`. Esa clave solo muestra el tablero de casos. La clave `ADMIN_PASSWORD_HASH` además permite cambiar tiempos, contenidos e indicadores.

## 1. Apps Script

1. Creá una hoja de cálculo privada para Autosol. No pegues el código en una celda: abrí **Extensiones → Apps Script** y reemplazá el archivo `Code.gs` del editor con el contenido completo de `apps-script/Code.gs` de este repositorio.
2. En **Configuración del proyecto → Propiedades de la secuencia de comandos**, cargá `SHEET_ID` con el identificador de la URL de la planilla y `BACKEND_SHARED_SECRET` con un secreto aleatorio. Guardá. Ese mismo secreto se configura en el servidor como `APPS_SCRIPT_SHARED_SECRET`.
3. En Apps Script elegí **Implementar → Nueva implementación → Aplicación web** y **Ejecutar como: yo**. Copiá la URL terminada en `/exec`. Las pestañas de revisión, etapas, preguntas y textos se crean al guardar por primera vez desde el panel; el contenido inicial sigue en el código.
4. Cada vez que cambies `Code.gs`, creá una nueva versión de la implementación. La URL de la implementación puede seguir siendo la misma.

## 2. Vercel

1. Importá este repositorio desde GitHub en Vercel.
2. En **Settings > Environment Variables** configurá `APPS_SCRIPT_URL`, `APPS_SCRIPT_SHARED_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` y `SESSION_SECRET` para el entorno que uses. `APPS_SCRIPT_URL` es la URL `/exec` del paso anterior.
3. Generá el hash local con `node scripts/create-password-hash.mjs` y pegá la salida como `ADMIN_PASSWORD_HASH`.
4. Generá secretos aleatorios de al menos 32 bytes para `SESSION_SECRET` y `APPS_SCRIPT_SHARED_SECRET`. El valor de `APPS_SCRIPT_SHARED_SECRET` debe coincidir exactamente con `BACKEND_SHARED_SECRET` de Apps Script.
5. Volvé a desplegar después de guardar las variables.

Nunca uses variables `VITE_` para claves, contraseñas o URLs privadas. Las variables normales se leen solo en las funciones de Vercel.

**Alojamiento:** GitHub Pages no ejecuta `/api`. El backend de este repositorio está preparado para Vercel; verificá el plan aplicable a un sitio comercial antes de publicar allí. El código y la planilla por sí solos no activan el guardado compartido. Probá desde el dominio final: iniciar sesión, guardar una nota de revisión, recargar y confirmar que siga allí; después publicar un cambio de prueba y verlo en otro navegador.
