import { redirect } from "next/navigation";
import { getPerson } from "~/lib/sheets";
import { CheckInForm } from "./CheckInForm";

export default async function CheckInPage({
  params,
}: {
  params: { cardId: string };
}) {
  const { cardId } = params;
  if (cardId.length !== 15) {
    redirect("/");
  }
  const person = await getPerson(cardId);
  if (!person) redirect(`/new/${cardId}`);

  return (
    <>
      <h1 className="text-4xl">BDI Check-in Form</h1>
      <CheckInForm person={person} />
    </>
  );
}
