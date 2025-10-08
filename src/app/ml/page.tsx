import { SignOutReminder } from "~/components/SignOutReminder";

import { CardIdForm } from "../CardIdForm";

export default function MLPage() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h1 className="mb-8 text-4xl font-bold">Maker Lab Check-in</h1>
      <SignOutReminder />
      <CardIdForm redirect="/ml/" lab="ml" />
    </div>
  );
}
