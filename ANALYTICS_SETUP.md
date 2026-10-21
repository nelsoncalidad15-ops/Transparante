# Analítica de uso – Transparante

La implementación respeta el diseño actual. Los eventos anónimos viajan por la ruta `POST /api/analytics` de Cloudflare Pages, pasan al backend de Apps Script con un secreto **únicamente del servidor** y se registran en la hoja privada `EventosWeb`.

## Habilitar

1. En el proyecto Google Apps Script vinculado a la planilla, copiar el archivo `apps-script/Code.gs` de esta rama y crear una nueva versión de la implementación web.
2. En Cloudflare Pages comprobar que `APPS_SCRIPT_URL` y `APPS_SCRIPT_SHARED_SECRET` coinciden con la implementación y `BACKEND_SHARED_SECRET` respectivamente. Son secretos del servidor.
3. Publicar esta rama después de revisarla; verificar que al navegar aparece `EventosWeb` en la hoja privada.
4. En el navegador autenticado como administrador, consultar `/api/admin/analytics`: devuelve `totalEvents`, `bySection`, `byType`, `topSearches` y `daily`. No es público.
5. Configurar en Cloudflare reglas de limitación de solicitudes y protección contra bots para `/api/analytics` antes de usarlo masivamente. El endpoint no contiene autenticación de visitante; los valores reflejan interacciones registradas y no personas únicas.
6. Incorporar una nota de privacidad adecuada en la página, indicando el uso de métricas agregadas y la política aplicable. No registrar consultas con información identificatoria.

**Advertencia:** el tablero `QualityDashboardView.tsx` contiene cifras ilustrativas hardcodeadas. Esta primera versión crea una fuente de datos reales, pero **no reemplaza todavía sus gráficos**. No interpretar las cifras ilustrativas como medición.

**Límites:** Apps Script + Sheets es apto para un volumen moderado. A volumen alto conviene agregar almacenamiento agregado o pasar a una base de eventos. El evento de búsqueda se filtra de forma conservadora antes de registrar para evitar recopilar números, correos o teléfonos.
