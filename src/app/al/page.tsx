import { CardIdForm } from "../CardIdForm";

export default function ALPage() {
  return (
    <>
      <h1 className="mb-8 text-4xl font-bold">Automation Lab Check-in</h1>
      <CardIdForm redirect="/al/check-in/" />
    </>
  );
}
