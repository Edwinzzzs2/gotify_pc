import { useMemo, useState } from "react";
import type { MessageItem } from "@/lib/types";

type MessageCardProps = {
  item: MessageItem;
  appLabel?: string;
  onToggleFavorite: (id: number) => void;
  formatDate: (value?: string | number) => string;
};

export function MessageCard({ item, appLabel, onToggleFavorite, formatDate }: MessageCardProps) {
  const [expanded, setExpanded] = useState(false);
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
        {canCollapse ? (
          <button type="button" className="link-button" onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? "收起" : "展开"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
