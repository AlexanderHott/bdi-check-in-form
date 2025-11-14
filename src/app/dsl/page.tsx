import { CheckForUpdates } from "~/components/CheckForUpdates";
import { SignOutReminder } from "~/components/SignOutReminder";

import { CardIdForm } from "../CardIdForm";

export default function DSLabPage() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h1 className="mb-8 font-bold text-4xl">
        Digital Scholarship Lab Check-in
      </h1>
      <SignOutReminder />
      <CardIdForm lab="dsl" redirect="/dsl/" />
      <CheckForUpdates />
    </div>
  );
}
