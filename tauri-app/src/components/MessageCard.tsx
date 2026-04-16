import { useMemo, useState } from "react";
import type { MessageItem } from "@/lib/types";

type MessageCardProps = {
  item: MessageItem;
  appLabel?: string;
  onToggleFavorite: (id: number) => void;
  formatDate: (value?: string | number) => string;
};

function extractVerificationCode(title: string, body: string) {
  if ((title.includes("验证码") || body.includes("验证码")) && /\d{4,8}/.test(body)) {
    const match = body.match(/\d{4,8}/);
    return match?.[0] || "";
  }
  return "";
}

export function MessageCard({ item, appLabel, onToggleFavorite, formatDate }: MessageCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const rawMessage = String(item.message || "");
  const lines = rawMessage.split("\n");
  const maxLines = 4;
  const maxChars = 220;
  const overLineLimit = lines.length > maxLines;
  const overCharLimit = rawMessage.length > maxChars;
  const canCollapse = overLineLimit || overCharLimit;
  const collapsedText = useMemo(() => {
    const merged = lines.slice(0, maxLines).join("\n");
    if (merged.length <= maxChars) {
      return overLineLimit ? `${merged}...` : merged;
    }
    return `${merged.slice(0, maxChars)}...`;
  }, [rawMessage, overLineLimit]);

  const visibleMessage = expanded || !canCollapse ? rawMessage : collapsedText;
  const priorityColor = item.priority && item.priority >= 8 ? "#ef4444" : item.priority && item.priority >= 4 ? "#3b82f6" : "#22c55e";

  const code = extractVerificationCode(String(item.title || ""), rawMessage);

  const copyCode = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (code) {
      await navigator.clipboard.writeText(code).catch(() => undefined);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="message-card">
      <div className="message-priority" style={{ backgroundColor: priorityColor }}></div>
      <div>
        <div className="message-header">
          <div>
            <div className="message-title">{item.title || "无标题"}</div>
            <div className="message-app">{appLabel || `应用 #${item.appid || 0}`}</div>
          </div>
          <div className="message-meta">
            <button
              type="button"
              className={`favorite-button ${item.favorite ? "active" : ""}`}
              title={item.favorite ? "取消收藏" : "收藏"}
              onClick={() => item.id && onToggleFavorite(item.id)}
            >
              {item.favorite ? "★" : "☆"}
            </button>
            <span>{formatDate(item.date)}</span>
          </div>
        </div>
        <div className="message-body">{visibleMessage}</div>
        {code ? (
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              className="feishu-toast-code"
              onClick={copyCode}
              style={{ cursor: "pointer", height: "26px", fontSize: "13px" }}
            >
              {copied ? "已复制！" : `验证码 ${code} · 点击复制`}
            </button>
          </div>
        ) : null}
        {canCollapse ? (
          <div className="message-actions" style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button type="button" className="link-button" onClick={() => setExpanded((prev) => !prev)}>
              {expanded ? "收起" : "展开"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
