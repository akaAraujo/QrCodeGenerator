import { useState, useRef } from "react";
import "./App.css";

const API_URL = "https://qrcodegenerator-production-00ad.up.railway.app/api/qrcode";

/* ── Validation helpers ── */
const isValidPhone = (v) => /^\d{10,15}$/.test(v.replace(/\D/g, ""));
const isValidMsg   = (v) => v.trim().length >= 1;

export default function App() {
  const phoneId = "phone-input";
  const msgId   = "message-input";

  const [phone,   setPhone]   = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState({ phone: false, message: false });

  const [qrBase64, setQrBase64] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState("");
  const [copied,   setCopied]   = useState(false);
  const [step,     setStep]     = useState("form"); // "form" | "result"

  const resultRef = useRef(null);

  const phoneErr  = touched.phone   && !isValidPhone(phone)   ? "Digite um número válido com DDI (ex: 5511999999999)" : "";
  const msgErr    = touched.message && !isValidMsg(message)   ? "A mensagem não pode ser vazia" : "";
  const canSubmit = isValidPhone(phone) && isValidMsg(message);

  const handleGenerate = async () => {
    setTouched({ phone: true, message: true });
    if (!canSubmit) return;

    setApiError("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ phoneNumber: phone.replace(/\D/g, ""), message }),
      });

      if (!res.ok) {
        const txt = await res.text();
        setApiError(txt || "Erro ao gerar o QR Code. Tente novamente.");
        return;
      }

      const data = await res.json();
      setQrBase64(data.imageBase64);
      setStep("result");

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch {
      setApiError("Não foi possível conectar à API. Verifique se o servidor está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("form");
    setQrBase64(null);
    setApiError("");
    setTouched({ phone: false, message: false });
  };

const handleDownload = () => {
  const byteChars   = atob(qrBase64);
  const byteNumbers = Array.from(byteChars, c => c.charCodeAt(0));
  const blob        = new Blob([new Uint8Array(byteNumbers)], { type: "image/png" });
  const url         = URL.createObjectURL(blob);

  const a      = document.createElement("a");
  a.href       = url;
  a.download   = `whatsapp-qr-${phone.replace(/\D/g, "")}.png`;
  a.click();

  setTimeout(() => URL.revokeObjectURL(url), 5000); // limpa memória
};

const handleCopy = async () => {
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const res  = await fetch(`data:image/png;base64,${qrBase64}`);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      await navigator.clipboard.writeText(`data:image/png;base64,${qrBase64}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  } catch {
    setApiError("Seu navegador não suporta copiar imagens. Use o botão de download.");
  }
};

  return (
    <>
      {/* ── Top navigation bar ── */}
      <header className="topbar" role="banner">
        <div className="topbar-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 3C8.82 3 3 8.82 3 16c0 2.39.63 4.63 1.73 6.57L3 29l6.63-1.7A13 13 0 0016 29c7.18 0 13-5.82 13-13S23.18 3 16 3z" fill="white" />
            <path d="M21.5 18.9c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.22 1.36.19 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.34z" fill="#25D366" />
          </svg>
        </div>
        <div>
          <div className="topbar-title">WhatsApp QR</div>
          <div className="topbar-sub">Gerador de QR Code</div>
        </div>
      </header>

      <main className="main" role="main">

        {/* ── Form card ── */}
        <section className="card" aria-label="Formulário de geração">
          <p className="card-title">Dados para o QR Code</p>

          {/* Phone field */}
          <div className="field">
            <label htmlFor={phoneId}>Número do WhatsApp</label>
            <div className="input-wrap">
              <input
                id={phoneId}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="5511999999999"
                value={phone}
                maxLength={16}
                onChange={e => setPhone(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, phone: true }))}
                aria-describedby={`${phoneId}-hint`}
                aria-invalid={!!phoneErr}
              />
              <span className={`field-icon ${touched.phone ? (phoneErr ? "error" : "valid") : ""}`} aria-hidden="true">
                {touched.phone && !phoneErr
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                }
              </span>
            </div>
            {phoneErr
              ? <span id={`${phoneId}-hint`} className="field-hint error-hint" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  {phoneErr}
                </span>
              : <span id={`${phoneId}-hint`} className="field-hint">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  Inclua o DDI e DDD, sem espaços ou traços
                </span>
            }
          </div>

          {/* Message field */}
          <div className="field">
            <label htmlFor={msgId}>
              Mensagem pré-preenchida
              <span className={`char-count ${message.length > 900 ? "warn" : ""}`} aria-live="polite">
                {message.length}/1000
              </span>
            </label>
            <textarea
              id={msgId}
              placeholder="Olá! Gostaria de saber mais sobre..."
              value={message}
              maxLength={1000}
              onChange={e => setMessage(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, message: true }))}
              aria-describedby={`${msgId}-hint`}
              aria-invalid={!!msgErr}
            />
            {msgErr
              ? <span id={`${msgId}-hint`} className="field-hint error-hint" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  {msgErr}
                </span>
              : <span id={`${msgId}-hint`} className="field-hint">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  Texto que aparecerá automaticamente no chat ao escanear
                </span>
            }
          </div>
        </section>

        {/* ── API error ── */}
        {apiError && (
          <div className="api-error" role="alert" aria-live="assertive">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            {apiError}
          </div>
        )}

        {/* ── Submit button ── */}
        <button
          className={`btn-submit${loading ? " btn-loading" : ""}`}
          onClick={handleGenerate}
          disabled={loading}
          aria-busy={loading}
        >
          <span className="btn-text-idle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" /><path d="M14 14h3v3M17 20h3M20 17v3" />
            </svg>
            Gerar QR Code
          </span>
          <span className="btn-text-loading">
            <span className="spinner" aria-hidden="true" /> Gerando QR Code...
          </span>
        </button>

        {/* ── Result card ── */}
        {qrBase64 && step === "result" && (
          <section className="card result-section" ref={resultRef} aria-label="QR Code gerado" aria-live="polite">
            <p className="card-title">QR Code pronto</p>

            <div className="qr-wrapper">
              <div className="qr-frame">
                <img
                  src={`data:image/png;base64,${qrBase64}`}
                  alt={`QR Code para WhatsApp do número ${phone}`}
                />
              </div>
            </div>

            <div className="qr-meta">
              <p className="qr-meta-phone">+{phone.replace(/\D/g, "")}</p>
              <p className="qr-meta-hint">
                Aponte a câmera do celular para abrir o WhatsApp<br />
                com a mensagem pré-preenchida
              </p>
            </div>

            <div className="action-grid">
              <button className="btn-action" onClick={handleDownload} aria-label="Baixar QR Code como PNG">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Baixar PNG
              </button>
              <button
                className={`btn-action${copied ? " copied" : ""}`}
                onClick={handleCopy}
                aria-label={copied ? "Imagem copiada!" : "Copiar imagem para área de transferência"}
                aria-pressed={copied}
              >
                {copied ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    Copiado!
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copiar imagem
                  </>
                )}
              </button>
            </div>

            <button className="btn-reset" onClick={handleReset} aria-label="Gerar novo QR Code">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.9L1 10" />
              </svg>
              Gerar novo QR Code
            </button>
          </section>
        )}

        {/* ── Tip banner ── */}
        {step === "form" && (
          <div className="tip" role="note">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            Ao escanear o QR Code, o WhatsApp abrirá uma conversa com o número e a mensagem já preenchida — pronto para enviar.
          </div>
        )}

      </main>
    </>
  );
}
