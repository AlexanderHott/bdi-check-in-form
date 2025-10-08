"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function TimeOut({
  timeout = 60,
  href,
}: {
  timeout?: number;
  href: string;
}) {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef(Date.now());

  const resetTimer = useCallback(() => {
    const now = Date.now();

    // only reset if at least 500ms have passed since last reset
    if (now - lastActivityRef.current >= 500) {
      lastActivityRef.current = now;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        router.replace(href);
      }, timeout * 1000);
    }
  }, [href, router, timeout]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      return;
    }

    timerRef.current = setTimeout(() => {
      router.replace(href);
    }, timeout * 1000);

    const throttledResetTimer = resetTimer;

    window.addEventListener("mousemove", throttledResetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("wheel", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    return () => {
      window.removeEventListener("mousemove", throttledResetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("wheel", resetTimer);
      window.removeEventListener("touchstart", resetTimer);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [href, router, timeout, resetTimer]);

  return null;
}
