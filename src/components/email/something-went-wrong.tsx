import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Link,
  pixelBasedPreset,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { AlertTriangle } from "lucide-react";

interface SomethingWentWrongEmailProps {
  comment: string;
  lab: string;
  checkinTime: string;
  checkoutTime: string;
  rating: string;
  name: string;
  email: string;
  checkinReasons: string[];
  //   sheetUrl: string;
}

function InfoRow(props: { label: string; value: string }) {
  return (
    <Row className="mt-2">
      <Column align="left" className="text-neutral-600">
        {props.label}:
      </Column>
      <Column align="right">{props.value}</Column>
    </Row>
  );
}

export function SomethingWentWrongEmail(props: SomethingWentWrongEmailProps) {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
      }}
    >
      <Html>
        <Head />

        <Preview>🚨 Something went wrong in the {props.lab}</Preview>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[600px] rounded border border-[#eaeaea] border-solid p-[20px]">
            {/* Header */}
            <Section className="">
              <Row className="bg-black mx-auto p-4">
                <Column align="center">
                  <AlertTriangle className="text-white w-12 h-12" />
                </Column>
                <Column align="center">
                  <Heading className="text-white text-2xl">
                    Something went wrong in the {props.lab}
                  </Heading>
                </Column>
              </Row>
            </Section>

            {/* Info */}
            <Section className="mt-4 p-4 bg-neutral-100">
              <InfoRow label="Lab" value={props.lab} />
              <InfoRow label="Person Name" value={props.name} />
              <InfoRow label="Email" value={props.email} />
              <InfoRow label="Checkin Time" value={props.checkinTime} />
              <InfoRow label="Checkout Time" value={props.checkoutTime} />
              <InfoRow label="Rating" value={`${props.rating} / 4`} />
              <InfoRow
                label="Checkin Reasons"
                value={props.checkinReasons.join(", ")}
              />
            </Section>

            {/* What went wrong */}
            <Section className="mt-4">
              <Text className="font-bold">Comment:</Text>
              <code
                // className="inline-block px-[16px] py-[8px] w-full bg-[#f4f4f4] rounded-md border border-[#eee] text-[#333]"
                style={{
                  display: "inline-block",
                  padding: "16px 4.5%",
                  width: "90.5%",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "5px",
                  border: "1px solid #eee",
                  color: "#333",
                  fontSize: "1rem",
                }}
              >
                {props.comment}
              </code>
              <Section className="mt-4">
                <Button
                  // href={`mailto:${props.email}&subject=${props.lab} visit ${props.checkinTime} - ${props.checkoutTime}`}
                  href={`mailto:${props.email}?subject=${props.lab} visit ${props.checkinTime} followup`}
                  className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] text-white no-underline font-semibold mr-4"
                >
                  Follow up
                </Button>
                {/* <Button
                  href={props.sheetUrl}
                  target="_blank"
                  className="rounded bg-[#f5f5f5] px-5 py-3 text-center text-[12px] text-black no-underline font-semibold"
                >
                  View entry in the Google Sheet
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button> */}
              </Section>
            </Section>

            {/* Footer */}
            <Section className="mt-4">
              <Text
                style={{
                  color: "#898989",
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
                  fontSize: "12px",
                  lineHeight: "22px",
                  marginTop: "12px",
                  marginBottom: "24px",
                }}
              >
                This is an automated incident notification from the{" "}
                <Link
                  href="https://bdi-check-in-form.vercel.app/"
                  target="_blank"
                  style={{ ...link, color: "#898989" }}
                >
                  bdi-check-in-form
                </Link>
                {": "}
                BDI space tracking system.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

SomethingWentWrongEmail.PreviewProps = {
  comment:
    "The drill is missing it's battery, and there is no battery charger.",
  lab: "Lab 1",
  checkinTime: "2025-01-01 10:00:00",
  checkoutTime: "2025-01-01 11:00:00",
  name: "Jonathan Blowey Joey",
  email: "example@example.com",
  checkinReasons: [
    "High Performance Computing",
    "using Brotar",
    "Other",
    "Word",
    "Aaaaaaaaaaaaaaa",
    "asdfasdfasdfs",
    "Fdsafdsafdsa",
  ],
  rating: "3",
  //   sheetUrl: "https://example.com",
} satisfies SomethingWentWrongEmailProps;

export default SomethingWentWrongEmail;

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};
