"use client";

import { Button } from "~/components/ui/button";
import { sendEmail } from "~/lib/server-actions/actions";

export default function Debug() {
  return (
    <div>
      Debug
      <Button
        onClick={async () => {
          console.log("sending email");
          await sendEmail();
        }}
      >
        Send Email
      </Button>
    </div>
  );
}
