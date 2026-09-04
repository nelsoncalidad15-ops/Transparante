# Backend seguro: Vercel + Apps Script + Google Sheets

El navegador solo llama a Vercel. Vercel valida la sesión de administrador y recién entonces consulta Apps Script. El Sheet no debe compartirse públicamente.

## Tablero de contención de clientes

El panel interno usa primero la pestaña `Agenda` y, si no existe, `Operaciones`. Pegá o vinculá allí la exportación operativa con estos encabezados exactos: `Cliente`, `Teléfono`, `Modelo`, `Ultimo Estado`, `Fecha Facturación`, `Fecha Gestión Turno`, `Fecha Últ Modificación`, `N° Operación` y `Gestionado por`.

El tablero prioriza `Facturado`, `Patentado`, `Preturno` y `Turno`. Cuenta días hábiles entre etapas y ordena los casos en verde, amarillo y rojo. Las filas con estado `Entregado` no se muestran.

Administración puede editar los límites del semáforo desde el panel. Al guardar, se crea o actualiza automáticamente la pestaña `Configuracion semaforo`; no hace falta crearla antes.

Para habilitar colaboradores, generá un segundo hash con `node scripts/create-password-hash.mjs` y cargalo en Vercel como `COLLABORATOR_PASSWORD_HASH`. Esa clave solo muestra el tablero de casos. La clave `ADMIN_PASSWORD_HASH` además permite cambiar tiempos, contenidos e indicadores.

## 1. Apps Script

1. Creá un proyecto de Apps Script y pegá `apps-script/Code.gs`.
2. En **Project Settings > Script properties** creá `SHEET_ID` y `BACKEND_SHARED_SECRET`.
3. En el Sheet creá las pestañas `Articulos`, `Preguntas` e `Indicadores`. La fila 1 debe contener los encabezados de cada campo.
4. Implementá **Deploy > New deployment > Web app**, ejecutando como vos. Copiá únicamente la URL `/exec`.

## 2. Vercel

1. Importá este repositorio desde GitHub en Vercel.
2. En **Settings > Environment Variables** agregá las cuatro variables de `.env.example` para Production, Preview y Development.
3. Generá el hash local con `node scripts/create-password-hash.mjs` y pegá la salida como `ADMIN_PASSWORD_HASH`.
4. Generá secretos de al menos 32 bytes para `SESSION_SECRET` y `APPS_SCRIPT_SHARED_SECRET`.
5. Volvé a desplegar después de guardar las variables.

Nunca uses variables `VITE_` para claves, contraseñas o URLs privadas. Las variables normales se leen solo en las funciones de Vercel.
