import type { CustomToast } from "@/lib/types";

type CustomToastProps = {
  toast: CustomToast;
  onClose: (id: string) => void;
  onCopyCode: (code: string) => void;
};

export function CustomToastCard({ toast, onClose, onCopyCode }: CustomToastProps) {
  return (
    <div className="toast-card">
      <div className="toast-top">
        <div>
          <div className="toast-title">{toast.title}</div>
          <div className="toast-subtitle">{toast.subtitle}</div>
        </div>
        <button type="button" className="ghost-button" onClick={() => onClose(toast.id)}>关闭</button>
      </div>
      <div className="toast-body">{toast.body}</div>
      <div className="toast-actions">
        {toast.verificationCode ? (
          <button type="button" className="primary-button" onClick={() => onCopyCode(toast.verificationCode || "")}>复制验证码</button>
        ) : null}
        <button type="button" className="secondary-button" onClick={() => onClose(toast.id)}>知道了</button>
      </div>
    </div>
  );
}
