import { CheckInForm } from "~/components/CheckInForm";
import { getPerson } from "~/lib/sheets";
import { AL_REASONS } from "~/schemas";
import { redirect } from "next/navigation";

export default async function MLCheckInPage({
  params,
}: {
  params: { cardId: string };
}) {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const { cardId } = await params; // nextjs 15 dynamicIO
  if (cardId.length !== 15) {
    redirect("/al");
  }
  const person = await getPerson(cardId);
  if (!person) {
    const redirectUrl = encodeURI(`/al/check-in/${cardId}`);
    redirect(`/new/${cardId}?redirect=${redirectUrl}`);
  }
  return (
    <>
      <CheckInForm
        person={person}
        // TODO: move back to al-checkins
        sheetName="al-checkins-new"
        redirectUrl="/al"
        reasons={AL_REASONS}
        schemaName="alCheckInSchema"
      />
    </>
  );
}
