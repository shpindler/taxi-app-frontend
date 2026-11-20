import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatMessage, DriverInfo } from './types';

interface UseDriverChatResult {
  messages: ChatMessage[];
  isDriverTyping: boolean;
  sendMessage: (text: string) => void;
  resetChat: () => void;
}

// Имитация автоответа водителя. Замените на реальный WebSocket/SSE.
const DRIVER_REPLIES = [
  'Добрый день! Уже выезжаю.',
  'Буду через пару минут.',
  'Стою у главного входа, машина белая.',
  'Хорошо, жду вас.',
  'Понял, спасибо!',
];

export function useDriverChat(driver: DriverInfo | null): UseDriverChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isDriverTyping, setIsDriverTyping] = useState(false);

  const replyIndexRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const schedule = (fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
  };

  const resetChat = useCallback(() => {
    clearTimers();
    setMessages([]);
    setIsDriverTyping(false);
    replyIndexRef.current = 0;
  }, []);

  // При смене водителя — приветственное сообщение и сброс истории
  useEffect(() => {
    clearTimers();
    setMessages([]);
    setIsDriverTyping(false);
    replyIndexRef.current = 0;

    if (!driver) return;

    schedule(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'system',
          text: `Водитель ${driver.name} найден. Машина: ${driver.car}, ${driver.plate}.`,
          timestamp: Date.now(),
        },
      ]);
    }, 200);

    schedule(() => {
      setIsDriverTyping(true);
      schedule(() => {
        setIsDriverTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `drv-${Date.now()}`,
            sender: 'driver',
            text: DRIVER_REPLIES[replyIndexRef.current % DRIVER_REPLIES.length],
            timestamp: Date.now(),
          },
        ]);
        replyIndexRef.current += 1;
      }, 1500);
    }, 1200);

    return () => clearTimers();
  }, [driver]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sender: 'passenger',
        text: trimmed,
        timestamp: Date.now(),
      },
    ]);

    setIsDriverTyping(true);
    schedule(() => {
      setIsDriverTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `drv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          sender: 'driver',
          text: DRIVER_REPLIES[replyIndexRef.current % DRIVER_REPLIES.length],
          timestamp: Date.now(),
        },
      ]);
      replyIndexRef.current += 1;
    }, 1200 + Math.random() * 800);
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => clearTimers();
  }, []);

  return { messages, isDriverTyping, sendMessage, resetChat };
}