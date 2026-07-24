'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const QuoteContext = createContext(null);

export const CONDITIONS = ['Sıfır', '2.El', 'Takas', 'Tamir'];

const makeRow = (id, patch) => ({ id, code: '', qty: 1, cond: 'Sıfır', ...patch });

export function QuoteProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rows, setRows] = useState(() => [makeRow(1)]);
  const idRef = useRef(2);
  const newId = () => idRef.current++;

  const openQuote = useCallback(() => {
    setOpen(true);
    setSubmitted(false);
  }, []);

  const closeQuote = useCallback(() => setOpen(false), []);

  // Ürün kartlarından "Teklife Ekle": aynı kod varsa adedi artır, yoksa yeni satır.
  const addItem = useCallback((code, cond = 'Sıfır') => {
    const trimmed = (code || '').trim();
    setOpen(true);
    setSubmitted(false);
    if (!trimmed) return;
    setRows((prev) => {
      if (prev.some((r) => r.code === trimmed)) {
        return prev.map((r) => (r.code === trimmed ? { ...r, qty: Number(r.qty) + 1 } : r));
      }
      return [...prev.filter((r) => r.code.trim()), makeRow(newId(), { code: trimmed, cond })];
    });
  }, []);

  const patchRow = useCallback((id, patch) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const removeRow = useCallback((id) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }, []);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, makeRow(newId())]);
  }, []);

  const submitQuote = useCallback(() => setSubmitted(true), []);

  const resetQuote = useCallback(() => {
    setOpen(false);
    setSubmitted(false);
    idRef.current = 2;
    setRows([makeRow(1)]);
  }, []);

  const rowCount = useMemo(() => rows.filter((r) => r.code.trim()).length, [rows]);

  const value = useMemo(
    () => ({
      open,
      submitted,
      rows,
      rowCount,
      openQuote,
      closeQuote,
      addItem,
      patchRow,
      removeRow,
      addRow,
      submitQuote,
      resetQuote,
    }),
    [open, submitted, rows, rowCount, openQuote, closeQuote, addItem, patchRow, removeRow, addRow, submitQuote, resetQuote],
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error('useQuote, QuoteProvider içinde kullanılmalı');
  return ctx;
}
