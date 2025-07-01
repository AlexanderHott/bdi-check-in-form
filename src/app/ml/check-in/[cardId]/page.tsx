import { CheckInForm } from "~/components/CheckInForm";
import { getPerson } from "~/lib/server-actions/actions";
import { ML_REASONS } from "~/schemas";
import { redirect } from "next/navigation";

export default async function MLCheckInPage({
  params,
}: {
  params: { cardId: string };
}) {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const { cardId } = await params; // nextjs 15 dynamicIO
  if (cardId.length !== 15) {
    redirect("/ml");
  }
  const person = await getPerson(cardId);
  if (!person) {
    const redirectUrl = encodeURI(`/ml/check-in/${cardId}`);
    redirect(`/new/${cardId}?redirect=${redirectUrl}`);
  }
  return (
    <>
      <CheckInForm
        person={person}
        // TODO: move back to ml-checkins
        sheetName="ml-checkins-new"
        redirectUrl="/ml"
        reasons={ML_REASONS}
        schemaName="mlCheckInSchema"
      />
    </>
  );
}
