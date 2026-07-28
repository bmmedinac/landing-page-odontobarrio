import { MessageCircle, X, Send, Lock, Maximize2, Minimize2, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-0.5">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-0.5">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
      {children}
    </a>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="bg-black/10 rounded px-1 py-0.5 text-[0.85em]">{children}</code>
  ),
};

const DEFAULT_WEBHOOK_URL = 'https://hook.us1.make.com/36anav6tlgq85s1fxmvwdrn6abn6jlh2';
const ACCESS_CODE_STORAGE_KEY = 'odontobarrio-chat-access-code';

function loadGroupWebhooks(): Record<string, string> {
  const raw = import.meta.env.VITE_GROUP_WEBHOOKS as string | undefined;
  if (!raw) return { General: DEFAULT_WEBHOOK_URL };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
      return parsed;
    }
  } catch {
    // ignore malformed secret, fall back below
  }
  return { General: DEFAULT_WEBHOOK_URL };
}

const GROUP_WEBHOOKS = loadGroupWebhooks();
const GROUP_NAMES = Object.keys(GROUP_WEBHOOKS);

type ToolExecution = {
  id: string;
  name: string;
  toolType: string;
  status?: string;
  resultText: string;
  resultParseError: boolean;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  toolExecutions?: ToolExecution[];
  toolMappingError?: string;
};

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: 'Hola 👋 Soy el asistente virtual de OdontoBarrio. ¿En qué puedo ayudarte?',
};

function generateThreadId() {
  return 'thread_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function formatToolResult(raw: unknown): { text: string; parseError: boolean } {
  if (raw === null || raw === undefined) {
    return { text: '(sin resultado)', parseError: false };
  }
  if (typeof raw !== 'string') {
    try {
      return { text: JSON.stringify(raw, null, 2), parseError: false };
    } catch {
      return { text: String(raw), parseError: true };
    }
  }
  try {
    const parsed = JSON.parse(raw);
    const toShow =
      parsed && typeof parsed === 'object' && 'jsonResponse' in parsed ? parsed.jsonResponse : parsed;
    return { text: JSON.stringify(toShow, null, 2), parseError: false };
  } catch {
    return { text: raw, parseError: true };
  }
}

function extractToolExecutions(data: unknown): { executions: ToolExecution[]; mappingError: string | null } {
  try {
    const allSteps = (data as { metadata?: { executionSteps?: unknown[] } })?.metadata?.executionSteps;
    if (!Array.isArray(allSteps)) {
      return { executions: [], mappingError: null };
    }

    // executionSteps acumula todo el historial del thread; nos quedamos solo con
    // lo que ocurrió después del último turno del usuario (el mensaje actual).
    let currentTurnStart = 0;
    for (let i = allSteps.length - 1; i >= 0; i--) {
      if ((allSteps[i] as Record<string, unknown> | undefined)?.role === 'user') {
        currentTurnStart = i + 1;
        break;
      }
    }
    const steps = allSteps.slice(currentTurnStart);

    const callsById = new Map<string, { name: string; toolType: string }>();
    for (const step of steps as Array<Record<string, unknown>>) {
      const toolCalls = step?.toolCalls;
      if (Array.isArray(toolCalls)) {
        for (const call of toolCalls as Array<Record<string, unknown>>) {
          const id = call?.id;
          if (typeof id === 'string') {
            callsById.set(id, {
              name: typeof call.name === 'string' ? call.name : 'desconocido',
              toolType: typeof call.toolType === 'string' ? call.toolType : 'desconocido',
            });
          }
        }
      }
    }

    const executions: ToolExecution[] = [];
    const matchedIds = new Set<string>();

    for (const step of steps as Array<Record<string, unknown>>) {
      const toolResponse = step?.toolResponse as Record<string, unknown> | undefined;
      const id = toolResponse?.id;
      if (typeof id === 'string') {
        matchedIds.add(id);
        const call = callsById.get(id);
        const { text, parseError } = formatToolResult(toolResponse?.result);
        executions.push({
          id,
          name: call?.name ?? 'desconocido',
          toolType: call?.toolType ?? (typeof toolResponse?.toolType === 'string' ? toolResponse.toolType : 'desconocido'),
          status: typeof toolResponse?.status === 'string' ? toolResponse.status : undefined,
          resultText: text,
          resultParseError: parseError,
        });
      }
    }

    for (const [id, call] of callsById) {
      if (!matchedIds.has(id)) {
        executions.push({
          id,
          name: call.name,
          toolType: call.toolType,
          resultText: '(sin respuesta)',
          resultParseError: false,
        });
      }
    }

    return { executions, mappingError: null };
  } catch {
    return { executions: [], mappingError: 'No se pudieron interpretar los datos de herramientas del webhook.' };
  }
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(GROUP_NAMES[0]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState<string | null>(() =>
    typeof window !== 'undefined' ? window.localStorage.getItem(ACCESS_CODE_STORAGE_KEY) : null
  );
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedTools, setExpandedTools] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleToolExpand = (index: number) => {
    setExpandedTools((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && !threadId) {
      setThreadId(generateThreadId());
    }
  }, [isOpen, threadId]);

  useEffect(() => {
    const openChat = () => setIsOpen(true);
    window.addEventListener('open-chat-widget', openChat);
    return () => window.removeEventListener('open-chat-widget', openChat);
  }, []);

  const submitCode = () => {
    const code = codeInput.trim();
    if (!code) return;
    window.localStorage.setItem(ACCESS_CODE_STORAGE_KEY, code);
    setAccessCode(code);
    setCodeInput('');
    setCodeError(null);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading || !accessCode || !threadId) return;

    const nextMessages = [...messages, { role: 'user', content: text } as ChatMessage];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const webhookUrl = GROUP_WEBHOOKS[selectedGroup] ?? DEFAULT_WEBHOOK_URL;
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Access-Code': accessCode },
        body: JSON.stringify({ message: text, threadID: threadId, pairId: '', caseCode: '' }),
      });

      if (response.status === 401) {
        window.localStorage.removeItem(ACCESS_CODE_STORAGE_KEY);
        setAccessCode(null);
        setCodeError('Código incorrecto. Intenta de nuevo.');
        setMessages(messages);
        return;
      }

      if (!response.ok) {
        throw new Error('request_failed');
      }

      const data = await response.json();
      const reply = data?.response;
      if (!reply) {
        throw new Error('empty_reply');
      }

      const { executions, mappingError } = extractToolExecutions(data);
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: reply,
          toolExecutions: executions.length > 0 ? executions : undefined,
          toolMappingError: mappingError ?? undefined,
        },
      ]);
    } catch {
      setError('No pudimos conectar con el asistente. Intenta nuevamente en unos minutos o llámanos al +56 2 1000 1000.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const handleCodeKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      submitCode();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div
          className={
            isExpanded
              ? 'mb-4 fixed inset-y-0 right-0 w-full sm:w-[28rem] h-full bg-white shadow-2xl border-l border-gray-200 flex flex-col overflow-hidden'
              : 'mb-4 w-80 sm:w-96 h-[28rem] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden'
          }
        >
          <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
            <span className="text-white">Asistente OdontoBarrio</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white hover:text-blue-100 p-1"
                aria-label={isExpanded ? 'Contraer chat' : 'Expandir chat'}
              >
                {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-blue-100 p-1" aria-label="Cerrar chat">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!accessCode ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="bg-blue-50 rounded-full p-3">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-gray-700">Este chat es solo para alumnos. Ingresa el código de acceso que te compartieron.</p>
              <div className="w-full flex items-center gap-2">
                <input
                  type="password"
                  value={codeInput}
                  onChange={(event) => setCodeInput(event.target.value)}
                  onKeyDown={handleCodeKeyDown}
                  placeholder="Código de acceso"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={submitCode}
                  disabled={!codeInput.trim()}
                  className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Entrar
                </button>
              </div>
              {codeError && <p className="text-sm text-red-600">{codeError}</p>}
            </div>
          ) : (
            <>
              {GROUP_NAMES.length > 1 && (
                <div className="border-b border-gray-100 px-4 py-2">
                  <label className="block text-xs text-gray-500 mb-1" htmlFor="chat-group-select">
                    Grupo
                  </label>
                  <select
                    id="chat-group-select"
                    value={selectedGroup}
                    onChange={(event) => setSelectedGroup(event.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {GROUP_NAMES.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((message, index) => {
                  const hasToolInfo = Boolean(message.toolExecutions?.length || message.toolMappingError);
                  const isToolExpanded = expandedTools.has(index);
                  return (
                    <div key={index} className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
                      </div>
                      {hasToolInfo && (
                        <div className="max-w-[80%] mt-1 text-xs text-gray-500 font-mono">
                          <button
                            onClick={() => toggleToolExpand(index)}
                            className="flex items-center gap-1 hover:text-gray-700"
                          >
                            <ChevronRight className={`w-3 h-3 transition-transform ${isToolExpanded ? 'rotate-90' : ''}`} />
                            {message.toolExecutions?.length
                              ? `${message.toolExecutions.length} llamada${message.toolExecutions.length > 1 ? 's' : ''} a herramienta${message.toolExecutions.length > 1 ? 's' : ''}`
                              : 'Herramientas'}
                            {message.toolMappingError && <span className="text-red-500">· error</span>}
                          </button>
                          {isToolExpanded && (
                            <div className="mt-1 rounded-md border border-gray-200 bg-gray-50 p-2 space-y-2">
                              {message.toolMappingError && (
                                <p className="text-red-600">{message.toolMappingError}</p>
                              )}
                              {message.toolExecutions?.map((execution) => (
                                <div key={execution.id}>
                                  <div>
                                    <span className="font-semibold text-gray-700">{execution.name}</span>{' '}
                                    <span className="text-gray-400">({execution.toolType})</span>
                                    {execution.status && <span className="text-gray-400"> · {execution.status}</span>}
                                  </div>
                                  <pre className="whitespace-pre-wrap break-words text-gray-600">{execution.resultText}</pre>
                                  {execution.resultParseError && (
                                    <p className="text-red-600">No se pudo interpretar el resultado como JSON.</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-3 py-2 bg-gray-100 text-gray-500">Escribiendo...</div>
                  </div>
                )}
                {error && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-3 py-2 bg-red-50 text-red-700 border border-red-100">{error}</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-100 p-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleMessageKeyDown}
                    placeholder="Escribe tu pregunta..."
                    disabled={isLoading}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition disabled:opacity-50"
                    aria-label="Enviar"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Este asistente no reemplaza una consulta profesional.</p>
              </div>
            </>
          )}
        </div>
      )}

      {!(isOpen && isExpanded) && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
          aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      )}
    </div>
  );
}
