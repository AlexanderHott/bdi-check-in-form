import { TimeOut } from "~/components/TimeOut";
import { NewPersonForm } from "./NewPersonForm";

export default async function NewPersonPage({
  params,
}: {
  params: { cardId: string };
}) {
  const { cardId } = params;
  return (
    <>
      <h1 className="mb-8 text-4xl font-bold">BDI Check-in Form</h1>
      <NewPersonForm cardId={cardId} />
      <TimeOut timeout={60} href="/" />
    </>
  );
}
