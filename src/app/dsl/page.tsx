import { CardIdForm } from "../CardIdForm";

export default function DSLabPage() {
  return (
    <>
      <h1 className="mb-8 text-4xl font-bold">
        Digital Scholship Lab Check-in
      </h1>
      <CardIdForm redirect="/dsl/check-in/" />
    </>
  );
}
