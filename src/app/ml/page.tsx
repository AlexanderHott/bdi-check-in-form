import { CardIdForm } from "../CardIdForm";

export default function MLPage() {
  return (
    <>
      <h1 className="mb-8 text-4xl font-bold">Maker Lab Check-in</h1>
      <CardIdForm redirect="/ml/check-in/" />
    </>
  );
}
