import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { DoorOpenIcon } from "lucide-react";

export function SignOutReminder() {
  return (
    <Alert variant="important">
      <DoorOpenIcon />
      <AlertTitle>{"Don't forget to sign out!"}</AlertTitle>
      <AlertDescription>
        Before you leave, swipe your card again to sign out.
      </AlertDescription>
    </Alert>
  );
}
