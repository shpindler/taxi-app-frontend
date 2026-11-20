import React, { useEffect, useRef, useState } from 'react';
import styles from './DriverChat.module.css';
import { QUICK_REPLIES, type ChatMessage, type DriverInfo } from './types';

interface Props {
  driver: DriverInfo;
  messages: ChatMessage[];
  isDriverTyping: boolean;
  onSend: (text: string) => void;
  onClose: () => void;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

const bubbleBySender: Record<ChatMessage['sender'], string> = {
  passenger: styles.bubblePassenger,
  driver: styles.bubbleDriver,
  system: styles.bubbleSystem,
};

export function DriverChatOverlay({
  driver,
  messages,
  isDriverTyping,
  onSend,
  onClose,
}: Props) {
  const [text, setText] = useState('');
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isDriverTyping]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.avatar}>{driver.name.charAt(0)}</div>
          <div>
            <div className={styles.title}>{driver.name}</div>
            <div className={styles.subtitle}>
              {driver.car} · {driver.plate}
            </div>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="Закрыть чат">
            ×
          </button>
        </div>

        <div className={styles.body} ref={bodyRef}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`${styles.bubble} ${bubbleBySender[m.sender]}`}
            >
              {m.text}
              <span className={styles.time}>{formatTime(m.timestamp)}</span>
            </div>
          ))}

          {isDriverTyping && (
            <div className={styles.typing} aria-label="Водитель печатает">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>

        <div className={styles.quick}>
          {QUICK_REPLIES.map((q) => (
            <button key={q} type="button" onClick={() => onSend(q)}>
              {q}
            </button>
          ))}
        </div>

        <div className={styles.inputRow}>
          <input
            type="text"
            placeholder="Сообщение водителю…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button onClick={handleSend} disabled={!text.trim()}>
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}