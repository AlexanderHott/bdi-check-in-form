import { CheckInForm } from "~/components/CheckInForm";
import { getPerson } from "~/lib/server-actions/actions";
import { redirect } from "next/navigation";

export default async function MLCheckInPage({
  params,
}: Readonly<{
  params: Promise<{ cardId: string }>;
}>) {
  const { cardId } = await params;
  if (cardId.length !== 15) {
    redirect("/dsl");
  }
  const person = await getPerson(cardId);
  if (!person) {
    const redirectUrl = encodeURI(`/dsl/check-in/${cardId}`);
    redirect(`/new/${cardId}?redirect=${redirectUrl}`);
  }
  return <CheckInForm person={person} redirectUrl="/dsl" lab="dsl" />;
}
