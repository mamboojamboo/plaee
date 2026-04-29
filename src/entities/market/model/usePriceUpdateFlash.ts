"use client";

import { useEffect, useRef, useState } from "react";

export type PriceUpdateFlash = "up" | "down" | null;

const FLASH_MS = 800;

export function usePriceUpdateFlash(price: number): PriceUpdateFlash {
  const prevRef = useRef<number | null>(null);
  const [flash, setFlash] = useState<PriceUpdateFlash>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = price;

    if (prev === null) {
      return;
    }

    const prevCents = Math.round(prev * 100);
    const nextCents = Math.round(price * 100);
    if (prevCents === nextCents) {
      return;
    }

    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
    }

    setFlash(price > prev ? "up" : "down");
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = undefined;
      setFlash(null);
    }, FLASH_MS);

    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
  }, [price]);

  return flash;
}
