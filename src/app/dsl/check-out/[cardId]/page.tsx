import { CheckOutForm } from "~/components/CheckOutForm";
import { getPerson, getRecentCheckin } from "~/lib/server-actions/actions";
import { CONFIG } from "~/schemas";
import { redirect } from "next/navigation";

export default async function DSLCheckInPage({
  params,
}: Readonly<{
  params: Promise<{ cardId: string }>;
}>) {
  const { cardId } = await params;
  const config = CONFIG.dsl;
  const redirectUrl = "/dsl";
  if (cardId.length !== 15) {
    console.error("cardId is not 15 characters");
    redirect(redirectUrl);
  }
  const person = await getPerson(cardId);
  if (!person) {
    console.error("person not found");
    const redirectUrl = encodeURI(`/dsl/check-in/${cardId}`);
    redirect(`/new/${cardId}?redirect=${redirectUrl}`);
  }
  const checkin = await getRecentCheckin(config.sheetName, cardId);
  if (!checkin) {
    console.error("no checkin found");
    redirect(redirectUrl);
  }

  return <CheckOutForm checkin={checkin} lab="dsl" redirectUrl={redirectUrl} />;
}
