import { redirect } from "next/navigation";
import { getPerson } from "~/lib/sheets";
import { ALCheckInForm } from "./ALCheckInForm";

export default async function MLCheckInPage({
  params,
}: {
  params: { cardId: string };
}) {
  const { cardId } = params;
  if (cardId.length !== 15) {
    redirect("/al");
  }
  const person = await getPerson(cardId);
  if (!person) {
    const redirectUrl = encodeURI(`/al/check-in/${cardId}`);
    redirect(`/new/${cardId}?redirect=${redirectUrl}`);
  }
  console.log("person", person);

  return (
    <>
      <h1 className="mb-8 text-4xl font-bold">Automation Lab Check-in Form</h1>
      <ALCheckInForm person={person} />
    </>
  );
}
