import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'warning' | 'info' | 'event'

export interface Toast {
  id: string
  title: string
  body?: string
  type: ToastType
}

const listeners = new Set<(t: Toast) => void>()

export function emitToast(t: Omit<Toast, 'id'>) {
  const toast: Toast = { ...t, id: 't_' + Math.random().toString(36).slice(2, 9) }
  listeners.forEach((l) => l(toast))
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])
  useEffect(() => {
    const fn = (t: Toast) => setToasts((prev) => [...prev, t].slice(-4))
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  }, [])
  const dismiss = (id: string) => setToasts((prev) => prev.filter((x) => x.id !== id))
  return { toasts, dismiss }
}
