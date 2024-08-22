import { NewPersonForm } from "./NewPersonForm";

export default async function NewPersonPage({
  params,
}: {
  params: { cardId: string };
}) {
  const { cardId } = params;
  return (
    <>
      <h1 className="text-4xl">BDI Check-in Form</h1>
      <NewPersonForm cardId={cardId} />
    </>
  );
}
