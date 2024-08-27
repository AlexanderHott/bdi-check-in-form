import { redirect } from "next/navigation";
import { getPerson } from "~/lib/sheets";
import { MLCheckInForm } from "./MLCheckInForm";

export default async function MLCheckInPage({
  params,
}: {
  params: { cardId: string };
}) {
  const { cardId } = params;
  if (cardId.length !== 15) {
    redirect("/ml");
  }
  const person = await getPerson(cardId);
  if (!person) {
    const redirectUrl = encodeURI(`/ml/check-in/${cardId}`);
    redirect(`/new/${cardId}?redirect=${redirectUrl}`);
  }
  console.log("person", person);

  return (
    <>
      <h1 className="mb-8 text-4xl font-bold">Maker Lab Check-in Form</h1>
      <MLCheckInForm person={person} />
    </>
  );
}
