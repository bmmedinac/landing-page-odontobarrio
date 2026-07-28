# Portero de acceso al chat (Cloudflare Worker)

El widget de chat pide un **código de acceso** antes de dejar chatear. Este
worker es el único lugar donde ese código vive de verdad: lo guarda como
secreto (no queda en el sitio estático ni en el bundle que se descarga al
navegador) y responde `200` o `401` según si el código que envió el
visitante coincide.

El chat en sí (las respuestas del asistente) lo resuelve un webhook de
Make.com aparte — este worker no habla con Make ni con Anthropic, solo
valida el código antes de que el widget se desbloquee.

## Deploy

```bash
cd cloudflare-worker
npm install
npx wrangler login
npx wrangler secret put ACCESS_CODE   # inventa un código y pégalo (ej: el que le compartirás a tus alumnos)
npx wrangler deploy
```

Al terminar, `wrangler deploy` imprime una URL del tipo:

```
https://odontobarrio-chat-proxy.<tu-subdominio>.workers.dev
```

Copia esa URL.

## Conectar el widget del sitio

Pega la URL anterior en la constante `ACCESS_CODE_WORKER_URL` de
`src/app/components/ChatWidget.tsx`, luego haz commit y push a `main` para
que GitHub Actions reconstruya el sitio con el widget apuntando a tu worker.

## Notas de seguridad

- El código de acceso es compartido (todos tus alumnos usan el mismo), no es
  autenticación por usuario. Si se filtra, cámbialo con
  `npx wrangler secret put ACCESS_CODE` (valor nuevo) + `npx wrangler deploy`,
  y comparte el nuevo código.
- `ALLOWED_ORIGIN` en `src/index.ts` restringe las respuestas CORS a
  `https://bmmedinac.github.io`, así que un navegador en otro sitio no puede
  leer la respuesta del worker. Esto no impide que alguien llame al worker
  directamente con `curl` conociendo el código — es una medida preventiva
  básica, no una defensa contra un atacante decidido. Si necesitas más, activa
  una regla de **Rate Limiting** de Cloudflare para esta ruta desde el
  dashboard (sin código).
- El widget además filtra bots simples con un campo honeypot y un retraso
  mínimo antes de aceptar el código — ver `ChatWidget.tsx`.
