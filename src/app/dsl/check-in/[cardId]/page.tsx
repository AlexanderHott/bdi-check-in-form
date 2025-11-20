import { redirect } from "next/navigation";
import { CheckInForm } from "~/components/CheckInForm";
import { QUERIES } from "~/lib/server-actions";

export default async function MLCheckInPage({
  params,
}: Readonly<{
  params: Promise<{ cardId: string }>;
}>) {
  const { cardId } = await params;
  if (cardId.length !== 15) {
    redirect("/dsl");
  }
  const person = await QUERIES.getPerson(cardId);
  if (!person) {
    const redirectUrl = encodeURI(`/dsl/check-in/${cardId}`);
    redirect(`/new/${cardId}?redirect=${redirectUrl}`);
  }
  return <CheckInForm lab="dsl" person={person} redirectUrl="/dsl" />;
}
