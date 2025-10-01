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
import { AlertTriangle, ExternalLink } from "lucide-react";

interface SomethingWentWrongEmailProps {
  comment: string;
  lab: string;
  checkinTime: string;
  checkoutTime: string;
  name: string;
  email: string;
  checkinReason: string[];
  sheetUrl: string;
}

/*
// - what went wrong
// - which lab
- log in time 
- log out time
// - name
// - email
- checkin reason
- view line in google sheet
- follow up

*/

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export function SomethingWentWrongEmail(props: SomethingWentWrongEmailProps) {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
      }}
    >
      <Html>
        <Head />

        <Preview>Something went wrong in the AL</Preview>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="px-3 mx-auto ">
            {/* Header */}
            <Section className="">
              <Row className="bg-black mx-auto p-4">
                <Column align="center">
                  <AlertTriangle className="text-white w-12 h-12" />
                </Column>
                <Column align="center">
                  <Heading className="text-white text-2xl">
                    Something went wrong in the AL
                  </Heading>
                </Column>
              </Row>
            </Section>

            {/* What went wrong */}
            <Section className="mt-[32px]">
              <Row>
                <Column align="left">
                  <Text>{`${props.name} (${props.email})`}</Text>
                </Column>
                <Column align="center">{props.checkinReason}</Column>
                <Column align="right">
                  <Text>
                    {props.checkinTime} - {props.checkoutTime}
                  </Text>
                </Column>
              </Row>
              <code style={code}>{props.comment}</code>

              <Section className="mt-4">
                <Button
                  // href={`mailto:${props.email}&subject=${props.lab} visit ${props.checkinTime} - ${props.checkoutTime}`}
                  href={`mailto:${props.email}`}
                  className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] text-white no-underline font-semibold "
                >
                  Follow up
                </Button>
                <Button
                  href={props.sheetUrl}
                  target="_blank"
                  className="ml-4 rounded bg-[#f5f5f5] px-5 py-3 text-center text-[12px] text-black no-underline font-semibold"
                  // style={{
                  //   ...link,
                  //   display: "block",
                  //   marginBottom: "16px",
                  // }}
                >
                  View entry in the Google Sheet
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="mt-[32px]">
              <Text style={footer}>
                <Link
                  href="https://bdi-check-in-form.vercel.app/"
                  target="_blank"
                  style={{ ...link, color: "#898989" }}
                >
                  bdi-checkin-form
                </Link>
                , maker space tracking
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
  checkinReason: ["High Performance Computing", "using Brotar"],
  sheetUrl: "https://example.com",
} satisfies SomethingWentWrongEmailProps;

export default SomethingWentWrongEmail;

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const footer = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
};
