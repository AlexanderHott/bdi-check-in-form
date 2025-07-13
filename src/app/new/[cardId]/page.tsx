import { NewPersonForm } from "./NewPersonForm";

export default async function NewPersonPage({
  params,
}: Readonly<{
  params: Promise<{ cardId: string }>;
}>) {
  const { cardId } = await params;
  return (
    <div className="flex flex-col gap-4">
      <h1 className="mb-8 text-4xl font-bold">BDI Check-in Form</h1>
      <p>
        {`It looks like you haven't swiped into a Brandeis Design and Innovation space before. Please fill out this information about yourself. You will only need to do this once.`}
      </p>
      <NewPersonForm cardId={cardId} />
    </div>
  );
}
