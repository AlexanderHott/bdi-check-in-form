import { redirect } from "next/navigation";
import { CheckOutForm } from "~/components/CheckOutForm";
import { getPerson, getRecentCheckin } from "~/lib/server-actions/actions";
import { CONFIG } from "~/schemas";

export default async function ALCheckInPage({
  params,
}: Readonly<{
  params: Promise<{ cardId: string }>;
}>) {
  const { cardId } = await params;
  const config = CONFIG.al;
  const redirectUrl = "/al";
  if (cardId.length !== 15) {
    console.error("cardId is not 15 characters");
    redirect(redirectUrl);
  }
  const person = await getPerson(cardId);
  if (!person) {
    console.error("person not found");
    const redirectUrl = encodeURI(`/al/check-in/${cardId}`);
    redirect(`/new/${cardId}?redirect=${redirectUrl}`);
  }
  const checkin = await getRecentCheckin(config.sheetName, cardId);
  if (!checkin) {
    console.error("no checkin found");
    redirect(redirectUrl);
  }

  return <CheckOutForm checkin={checkin} lab="al" redirectUrl={redirectUrl} />;
}
