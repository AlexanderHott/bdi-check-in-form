import { Suspense } from "react";
import { Spinner } from "~/components/ui/spinner";

import { NewPersonForm } from "./NewPersonForm";

export default async function NewPersonPage({
  params,
}: Readonly<{
  params: Promise<{ cardId: string }>;
}>) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="mb-8 text-4xl font-bold">BDI Check-in Form</h1>
      <p>
        {`It looks like you haven't swiped into a Brandeis Design and Innovation space before. Please fill out this information about yourself. You will only need to do this once.`}
      </p>
      <Suspense fallback={<Spinner />}>
        <NewPersonFormWrapper cardId={params.then((p) => p.cardId)} />
      </Suspense>
    </div>
  );
}

async function NewPersonFormWrapper(props: { cardId: Promise<string> }) {
  const cardId = await props.cardId;
  return <NewPersonForm cardId={cardId} />;
}
