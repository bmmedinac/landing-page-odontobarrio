export interface Env {
  ANTHROPIC_API_KEY: string;
  ACCESS_CODE: string;
}

const ALLOWED_ORIGIN = 'https://bmmedinac.github.io';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 500;
const MAX_HISTORY_MESSAGES = 20;

const SYSTEM_PROMPT = `Eres el asistente virtual de OdontoBarrio, una clínica dental ubicada en Merced 800 of. 100, Santiago Centro, Chile.

Responde siempre en español, de forma breve, cordial y profesional. Usa SOLO la información de este contexto. Si te preguntan algo que no está aquí (diagnósticos, tratamientos complejos, disponibilidad exacta de horas), indica que pueden confirmarlo directamente en este chat o llamando al +56 2 1000 1000. Nunca des consejos médicos ni diagnósticos.

SERVICIOS:
- Preventivos: limpieza dental, control dental
- Restauradores: tapaduras simples, tratamiento de caries simples
- Quirúrgicos: extracciones simples
- Urgencias: dolor leve, inflamación leve, pérdida de tapadura, sangrado leve post-extracción
- Radiografías: bitewing en clínica; panorámica se deriva a un centro cercano
Los casos complejos se derivan a clínicas especializadas.

PRECIOS REFERENCIALES (pueden variar según evaluación clínica):
- Consulta: $10.000
- Limpieza: $18.000
- Tapadura simple: desde $25.000
- Extracción simple: desde $35.000
- Urgencia: $15.000
Formas de pago: efectivo, transferencia, tarjetas de débito/crédito. La consulta se paga al momento de reservar la hora.

HORARIOS:
- Atención clínica: Lunes a Viernes 09:00-18:00, Sábado 09:00-13:00, Domingo cerrado.
- Chat en línea: Lunes a Sábado 08:00-20:00, Domingo solo respuesta automatizada.

CÓMO AGENDAR:
1. Escribir en este chat o llamar por teléfono para consultar disponibilidad.
2. Coordinar día y hora.
3. Pagar la consulta por adelantado para reservar la hora.
4. Asistir puntual (más de 10-15 min de atraso implica pérdida de la hora).
Reagendamientos: avisar con 24 horas de anticipación. Urgencias: se atienden según disponibilidad del día.

CONTACTO:
- Chat en línea: disponible en esta misma página
- Teléfono: +56 2 1000 1000
- Email: contacto@odontobarrio.cl
- Dirección: Merced 800 of. 100, Santiago Centro, Chile

Si te preguntan quién eres, di que eres un asistente virtual y que para agendar o casos urgentes pueden escribir aquí mismo en el chat.`;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Access-Code',
  };
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const accessCode = request.headers.get('X-Access-Code') ?? '';
    if (!env.ACCESS_CODE || accessCode !== env.ACCESS_CODE) {
      return jsonResponse({ error: 'unauthorized' }, 401);
    }

    let body: { messages?: Array<{ role: string; content: string }> };
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'JSON inválido' }, 400);
    }

    const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_HISTORY_MESSAGES) : [];
    if (messages.length === 0) {
      return jsonResponse({ error: 'Falta el campo messages' }, 400);
    }

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await anthropicResponse.json();
    return jsonResponse(data, anthropicResponse.status);
  },
};
