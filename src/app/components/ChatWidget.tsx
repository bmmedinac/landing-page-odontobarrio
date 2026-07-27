import { MessageCircle, X, Send, Lock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const WEBHOOK_URL = 'https://hook.us1.make.com/36anav6tlgq85s1fxmvwdrn6abn6jlh2';
const ACCESS_CODE_STORAGE_KEY = 'odontobarrio-chat-access-code';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: 'Hola 👋 Soy el asistente virtual de OdontoBarrio. ¿En qué puedo ayudarte?',
};

function generateThreadId() {
  return 'thread_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && !threadId) {
      setThreadId(generateThreadId());
    }
  }, [isOpen, threadId]);

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
      const response = await fetch(WEBHOOK_URL, {
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
      const reply = data?.message;
      if (!reply) {
        throw new Error('empty_reply');
      }

      setMessages([...nextMessages, { role: 'assistant', content: reply }]);
    } catch {
      setError('No pudimos conectar con el asistente. Escríbenos por WhatsApp al +56 9 1234 5678.');
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
        <div className="mb-4 w-80 sm:w-96 h-[28rem] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
            <span className="text-white">Asistente OdontoBarrio</span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-blue-100" aria-label="Cerrar chat">
              <X className="w-5 h-5" />
            </button>
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
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
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

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
