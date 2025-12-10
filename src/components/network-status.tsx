"use client";
import { WifiOffIcon } from "lucide-react";
import { useNetworkState } from "~/hooks/use-network-state";

export function NetworkStatus() {
  const network = useNetworkState();
    if (network.online) return null;
  return (
    <div className="flex w-full items-center justify-center gap-2 bg-red-600 p-2 text-white">
      <WifiOffIcon className="size-6" />
      <div>You are offline</div>
    </div>
  );
}
