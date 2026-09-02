# Backend seguro: Vercel + Apps Script + Google Sheets

El navegador solo llama a Vercel. Vercel valida la sesión de administrador y recién entonces consulta Apps Script. El Sheet no debe compartirse públicamente.

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
