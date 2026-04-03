import type { CustomToast } from "@/lib/types";

type CustomToastProps = {
  toast: CustomToast;
  onClose: (id: string) => void;
  onCopyCode: (code: string) => void;
  onActivate?: () => void;
};

function getInitial(text: string) {
  const value = String(text || "").trim();
  return value ? value.slice(0, 1) : "G";
}

export function CustomToastCard({ toast, onClose, onCopyCode, onActivate }: CustomToastProps) {
  return (
    <div className={`feishu-toast ${onActivate ? "clickable" : ""}`} role="status" aria-live="polite" onClick={onActivate}>
      <div className="feishu-toast-avatar-wrap">
        <div className="feishu-toast-avatar">{getInitial(toast.subtitle || toast.title)}</div>
      </div>
      <div className="feishu-toast-main">
        <div className="feishu-toast-head">
          <div className="feishu-toast-title-row">
            <div className="feishu-toast-title" title={toast.title}>{toast.title || "Gotify 消息"}</div>
            <div className="feishu-toast-group" title={toast.subtitle}>{toast.subtitle || "Gotify"}</div>
          </div>
        </div>
        <div className="feishu-toast-line" title={toast.body}>{toast.body}</div>
        {toast.verificationCode ? (
          <button
            type="button"
            className="feishu-toast-code"
            onClick={(event) => {
              event.stopPropagation();
              onCopyCode(toast.verificationCode || "");
            }}
          >
            验证码 {toast.verificationCode} · 点击复制
          </button>
        ) : null}
      </div>
      <button
        type="button"
        className="feishu-toast-close"
        onClick={(event) => {
          event.stopPropagation();
          onClose(toast.id);
        }}
        aria-label="关闭通知"
      >
        ×
      </button>
    </div>
  );
}
