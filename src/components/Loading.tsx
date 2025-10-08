import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex w-full justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
