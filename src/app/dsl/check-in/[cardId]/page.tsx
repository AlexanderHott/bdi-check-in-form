import { CheckInForm } from "~/components/CheckInForm";
import { getDb } from "~/lib/db";
import { DSL_REASONS } from "~/schemas";
import { redirect } from "next/navigation";

export default async function MLCheckInPage({
  params,
}: {
  params: { cardId: string };
}) {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const { cardId } = await params; // nextjs 15 dynamicIO
  if (cardId.length !== 15) {
    redirect("/dsl");
  }
  const db = getDb();
  const person = await db.table("people-new").get(cardId);
  if (!person) {
    const redirectUrl = encodeURI(`/dsl/check-in/${cardId}`);
    redirect(`/new/${cardId}?redirect=${redirectUrl}`);
  }
  return (
    <>
      <CheckInForm
        person={person}
        // TODO: move back to al-checkins
        sheetName="dsl-checkins-new"
        redirectUrl="/dsl"
        reasons={DSL_REASONS}
        schemaName="dslCheckInSchema"
      />
    </>
  );
}
