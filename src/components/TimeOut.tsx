"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function TimeOut({ timeout, href }: { timeout: number; href: string }) {
  const router = useRouter();
  useEffect(() => {
    const backTimeout = setTimeout(() => {
      router.replace(href);
    }, timeout * 1000);

    return () => {
      clearInterval(backTimeout);
    };
  }, [href, router, timeout]);
  return <></>;
}
