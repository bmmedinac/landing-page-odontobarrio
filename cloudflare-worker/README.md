# Proxy del chat (Cloudflare Worker)

Este worker protege tu API key de Anthropic: el widget de chat del sitio nunca llama
directamente a `api.anthropic.com`, sino a este worker, que agrega la key desde un
secreto y reenvía la solicitud.

## Deploy

```bash
cd cloudflare-worker
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY   # pega tu API key cuando lo pida
npx wrangler secret put ACCESS_CODE          # inventa un código y pégalo (ej: el que le compartirás a tus alumnos)
npx wrangler deploy
```

Al terminar, `wrangler deploy` imprime una URL del tipo:

```
https://odontobarrio-chat-proxy.<tu-subdominio>.workers.dev
```

Copia esa URL.

## Conectar el widget del sitio

Pega la URL anterior en la constante `WORKER_URL` de
`src/app/components/ChatWidget.tsx`, luego haz commit y push a `main` para que
GitHub Actions reconstruya el sitio con el widget apuntando a tu worker.

## Notas de seguridad

- El widget pide un **código de acceso** antes de mostrar el chat. Ese código se
  guarda en el navegador del visitante y se envía en cada solicitud; el worker lo
  compara contra el secreto `ACCESS_CODE` y responde 401 si no coincide. Esto no es
  autenticación por usuario (todos tus alumnos comparten el mismo código), así que
  si se filtra, cambia el secreto (`npx wrangler secret put ACCESS_CODE` con un
  valor nuevo y `npx wrangler deploy`) y comparte el nuevo código.
- `ALLOWED_ORIGIN` en `src/index.ts` restringe las respuestas CORS a
  `https://bmmedinac.github.io`, así que un navegador en otro sitio no puede leer
  la respuesta del worker. Esto no impide que alguien llame al worker directamente
  con `curl` conociendo el código, así que para producción se recomienda además:
  - Activar una regla de **Rate Limiting** de Cloudflare para esta ruta (se
    configura desde el dashboard, sin código).
  - Revisar el uso/costo en el dashboard de Anthropic periódicamente.
- El worker limita `max_tokens` y recorta el historial enviado a los últimos
  20 mensajes para acotar el costo por conversación.
