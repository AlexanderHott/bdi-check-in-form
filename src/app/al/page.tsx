import { CheckForUpdates } from "~/components/CheckForUpdates";
import { SignOutReminder } from "~/components/SignOutReminder";

import { CardIdForm } from "../CardIdForm";

export default function ALPage() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h1 className="mb-8 font-bold text-4xl">Automation Lab Check-in</h1>
      <SignOutReminder />
      <CardIdForm lab="al" redirect="/al/" />
      <CheckForUpdates />
    </div>
  );
}
