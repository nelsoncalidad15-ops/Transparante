# Analítica Web de Autosol Transparente

## Arquitectura

El navegador envía lotes de hasta 10 eventos a `POST /api/web-events`. Netlify redirige `/api/*` a `netlify/functions/api.ts`. La función agrega el secreto del servidor y llama al despliegue de Apps Script. Apps Script valida los eventos y los guarda en la pestaña privada `EventosWeb` con columnas `FechaHora`, `TipoEvento`, `Seccion`, `Categoria` y `Detalle`. El tablero interno consulta `GET /api/admin/web-analytics`, que exige una sesión de administrador firmada.

Eventos: `page_open`, `section_view`, `article_view`, `stage_open`, `faq_open`, `search`, `search_empty`, `contact_menu` y `contact_click`. Las búsquedas se clasifican localmente; no se transmite ni almacena su texto. `Detalle` contiene únicamente identificadores técnicos de artículos, etapas o FAQ. No se generan identificadores de sesión ni de usuario. Por eso el tablero muestra aperturas, eventos y clics, sin atribuirlos a personas únicas ni estimar sesiones.

## Configuración manual antes de publicar

1. Crear o elegir una hoja de cálculo privada y copiar su ID. No compartirla públicamente.
2. Actualizar el proyecto de Apps Script con `apps-script/Code.gs`. En propiedades del script configurar `SHEET_ID` y `BACKEND_SHARED_SECRET`. Desplegar manualmente una nueva versión de la aplicación web, ejecutada como propietario. Copiar la URL `/exec`.
3. Configurar en Netlify, solo para Functions y sin prefijo `VITE_`: `APPS_SCRIPT_URL`, `APPS_SCRIPT_SHARED_SECRET` con el mismo valor del paso 2, `SESSION_SECRET` aleatorio, `ADMIN_PASSWORD_HASH` y `ADMIN_USERNAME`. Si se usa la cuenta colaboradora, configurar también `COLLABORATOR_PASSWORD_HASH` y `COLLABORATOR_USERNAME`. El formato de contraseña es `scrypt$SALT$HEX_DE_64_BYTES`, igual al backend existente. No guardar valores reales en el repositorio.
4. Revisar en Netlify que el sitio use `netlify.toml` y las Functions. No publicar hasta comprobar que la URL vigente y el dominio autorizado corresponden al sitio correcto.
5. Actualizar manualmente la política de privacidad enlazada por el sitio: indicar que se miden aperturas, secciones, interacciones y categorías de búsqueda, sin texto de búsqueda ni identificadores personales; describir finalidad, responsable y plazo de conservación. Definir un plazo y eliminar filas antiguas en Sheets según esa política.

La primera escritura crea `EventosWeb` y sus encabezados. Si no hay registros, la consulta devuelve una lista vacía. La función limita cada lote a 10 eventos y Apps Script descarta eventos que excedan 600 por minuto en total. Esta cuota reduce carga, pero una protección perimetral de Netlify puede ser necesaria si aparece tráfico abusivo. Los eventos son orientativos: bloqueadores, fallos de red y bots pueden producir subregistro o sobreconteo.

## Pruebas locales

Para revisar el tablero sin servicios externos, ejecutar `npm run dev:analytics`. El comando muestra una contraseña temporal en la terminal y abre la web en `http://127.0.0.1:3000/`; el acceso interno está en `http://127.0.0.1:3000/#acceso-interno`. Navegar por la web, esperar unos segundos para el envío por lotes y entrar con usuario `admin` y esa contraseña. Los eventos de esta prueba son interacciones reales de la sesión local, se guardan solo en memoria y desaparecen al detener el proceso. Una banda aclara que esta vista de prueba no consulta la conexión existente de Sheets. La cookie pierde `Secure` exclusivamente en este adaptador HTTP local; en Netlify conserva `Secure`.

Si Apps Script ya está configurado y querés leer la planilla desde la vista local, crear un archivo `.env.local` (ignorado por Git) con `APPS_SCRIPT_URL` y `APPS_SCRIPT_SHARED_SECRET`, luego ejecutar `npm run dev:analytics:real`. El arranque verifica la lectura de `EventosWeb` antes de mostrar el sitio. Las interacciones de prueba en ese modo se escriben en la planilla real. Las variables configuradas en Netlify no se copian automáticamente al equipo local. No pegues secretos en el frontend ni en el chat.

`npm run lint` comprueba TypeScript. `npm run build` compila la web y copia el paquete de revisión existente; no despliega. Para probar el flujo completo localmente, iniciar el entorno de Netlify Functions con variables de prueba y un Apps Script de prueba, abrir la web, navegar y comprobar que `EventosWeb` recibe filas. Sin esos servicios, la captura se puede comprobar con las pruebas locales del módulo y la función mediante una simulación de `fetch`. El servidor simple de Vite (`npm run dev`) no ejecuta Netlify Functions: una respuesta de fallback HTML a `/api/*` no confirma un evento guardado.

El tablero de analítica aparece directamente al entrar como administrador en **Acceso interno**. La antigua pestaña vacía `Indicadores`, vinculada a una hoja operativa distinta, se retiró de la navegación interna; su código y datos no se mezclan con las métricas web. Los contadores de demostración de otros componentes no deben interpretarse como métricas de esta analítica.

El tablero resume cinco datos arriba: aperturas, tema más y menos consultado entre contenidos abiertos, búsquedas y clics de contacto. El ranking de intereses cuenta únicamente aperturas de artículos, etapas y preguntas; las búsquedas y las visitas a secciones se muestran aparte. Las observaciones de mejora requieren un mínimo de registros, muestran el dato que las respalda y proponen una revisión concreta. Los filtros de 7, 30 y 90 días, rango personalizado, evento y sección se aplican antes de calcular cualquier indicador.
