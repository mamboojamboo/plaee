"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Phase = "idle" | "running" | "finishing";

const SHOW_DELAY_MS = 80;
const TRICKLE_INTERVAL_MS = 200;
const FINISH_HOLD_MS = 200;
const FADE_OUT_MS = 250;
const SAFETY_AUTO_FINISH_MS = 30_000;
const TARGET_PROGRESS = 0.8;
const TRICKLE_FACTOR = 0.08;

export function TopProgressBar() {
  const [value, setValue] = useState(0);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  const pathname = usePathname();
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    let phase: Phase = "idle";
    let progress = 0;
    let trickleTimer: ReturnType<typeof setTimeout> | null = null;
    let showDelayTimer: ReturnType<typeof setTimeout> | null = null;
    let finishHoldTimer: ReturnType<typeof setTimeout> | null = null;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    let safetyTimer: ReturnType<typeof setTimeout> | null = null;

    const clearAll = () => {
      if (trickleTimer !== null) {
        clearTimeout(trickleTimer);
        trickleTimer = null;
      }
      if (showDelayTimer !== null) {
        clearTimeout(showDelayTimer);
        showDelayTimer = null;
      }
      if (finishHoldTimer !== null) {
        clearTimeout(finishHoldTimer);
        finishHoldTimer = null;
      }
      if (resetTimer !== null) {
        clearTimeout(resetTimer);
        resetTimer = null;
      }
      if (safetyTimer !== null) {
        clearTimeout(safetyTimer);
        safetyTimer = null;
      }
    };

    const setProgress = (next: number) => {
      progress = next;
      setValue(next);
    };

    const tick = () => {
      if (phase !== "running") return;
      const remaining = TARGET_PROGRESS - progress;
      if (remaining > 0.001) {
        setProgress(progress + remaining * TRICKLE_FACTOR);
      }
      trickleTimer = setTimeout(tick, TRICKLE_INTERVAL_MS);
    };

    const finish = () => {
      if (phase === "idle") return;
      clearAll();
      phase = "finishing";
      setVisible(true);
      setProgress(1);
      finishHoldTimer = setTimeout(() => {
        setVisible(false);
        resetTimer = setTimeout(() => {
          phase = "idle";
          setActive(false);
          setProgress(0);
        }, FADE_OUT_MS);
      }, FINISH_HOLD_MS);
    };

    const start = () => {
      if (phase === "running") return;
      clearAll();
      phase = "running";
      setActive(true);
      setProgress(0);
      setVisible(false);
      showDelayTimer = setTimeout(() => {
        if (phase !== "running") return;
        setVisible(true);
        tick();
      }, SHOW_DELAY_MS);
      safetyTimer = setTimeout(() => {
        finish();
      }, SAFETY_AUTO_FINISH_MS);
    };

    finishRef.current = finish;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      if (!anchor.getAttribute("href")) return;
      const targetAttr = anchor.getAttribute("target");
      if (targetAttr && targetAttr !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      let nextUrl: URL;
      try {
        nextUrl = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (nextUrl.origin !== window.location.origin) return;
      const samePath = nextUrl.pathname === window.location.pathname;
      const sameSearch = nextUrl.search === window.location.search;
      if (samePath && sameSearch) return;
      start();
    };

    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      clearAll();
      finishRef.current = () => {};
    };
  }, []);

  useEffect(() => {
    finishRef.current();
  }, [pathname]);

  return (
    <div
      role="progressbar"
      aria-hidden={!active}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[2px] motion-reduce:transition-none"
      style={{
        transform: `scaleX(${value})`,
        transformOrigin: "left",
        opacity: visible ? 1 : 0,
        transition:
          "transform 200ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms ease-out",
        backgroundColor: "var(--palette-filter-chip-active-fg)",
        willChange: "transform, opacity",
      }}
    />
  );
}
