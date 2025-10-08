"use client";

import { useQuery } from "@tanstack/react-query";
import packageJson from "~/../package.json";
import { Button } from "~/components/ui/button";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";

function AnimatedDot() {
  return (
    <span className="relative flex size-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>{" "}
      <span className="relative inline-flex size-3 rounded-full bg-cyan-500"></span>
    </span>
  );
}

export function CheckForUpdates() {
  const { data, error, refetch, isPending, isRefetching } = useQuery({
    queryKey: ["version"],
    queryFn: async () => {
      const response = await fetch("/api/version");
      if (!response.ok) {
        throw new Error("Failed to fetch version");
      }
      return (await response.json()) as { version: string };
    },
    refetchInterval: 1000 * 60 * 60, // 1 hour
  });
  if (error) {
    console.error(error);
  }

  const needsUpdate = data && data.version !== packageJson.version;

  return (
    <Button
      variant={needsUpdate ? "outline" : "ghost"}
      className={"text-sm absolute bottom-4 right-4"}
      onClick={() => {
        if (needsUpdate) {
          window.location.reload();
        } else {
          void refetch();
        }
      }}
    >
      <ButtonContent
        isLoading={isPending || isRefetching}
        clientVersion={packageJson.version}
        serverVersion={data?.version ?? ""}
      />
      {needsUpdate && <AnimatedDot />}
    </Button>
  );
}

function ButtonContent({
  isLoading,
  clientVersion,
  serverVersion,
}: {
  isLoading: boolean;
  clientVersion: string;
  serverVersion: string;
}) {
  if (isLoading) {
    return <Loader2Icon className="h-4 w-4 animate-spin" />;
  }
  if (serverVersion === clientVersion) {
    return <pre>v{clientVersion}</pre>;
  }
  return (
    <pre className="inline-flex items-center gap-1">
      v{clientVersion} <ArrowRightIcon className="h-3 w-3" /> v{serverVersion}
    </pre>
  );
}
