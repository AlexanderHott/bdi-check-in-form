import { CheckForUpdates } from "~/components/CheckForUpdates";
import { SignOutReminder } from "~/components/SignOutReminder";

import { CardIdForm } from "../CardIdForm";

export default function DSLabPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h1 className="mb-8 text-4xl font-bold">
        Digital Scholarship Lab Check-in
      </h1>
      <SignOutReminder />
      <CardIdForm redirect="/dsl/" lab="dsl" />
      <CheckForUpdates />
    </div>
  );
}
