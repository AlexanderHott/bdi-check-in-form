import { TimeOut } from "~/components/TimeOut";
import { NewPersonForm } from "./NewPersonForm";

export default async function NewPersonPage({
  params,
}: {
  params: { cardId: string };
}) {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const { cardId } = await params; // nextjs 15 dynamicIO
  return (
    <div className="flex flex-col gap-4">
      <h1 className="mb-8 text-4xl font-bold">BDI Check-in Form</h1>
      <p>
        {`It looks like you haven't swiped into a Brandeis Design and Innovation space before. Please fill out this information about yourself. You will only need to do this once.`}
      </p>
      <TimeOut timeout={120} href="/" />
      <NewPersonForm cardId={cardId} />
    </div>
  );
}
