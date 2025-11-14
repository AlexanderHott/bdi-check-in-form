import Link from "next/link";
import { CheckForUpdates } from "~/components/CheckForUpdates";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-bold text-4xl">Select Space</h1>
      <LocationCard
        desc="3D Printing, Laser Cutting..."
        href="/ml"
        title="Maker Lab"
      />
      <LocationCard
        desc="Soldering, Electronics..."
        href="/al"
        title="Automation Lab"
      />
      <LocationCard
        desc="Specialized computing, ..."
        href="/dsl"
        title="Digital Scholarship Lab"
      />
      <CheckForUpdates />
    </div>
  );
}

function LocationCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="group">
        <CardHeader>
          <div className="flex w-full items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{desc}</CardDescription>
            </div>
            <svg
              className="size-6 transition-transform duration-150 ease-in-out group-hover:translate-x-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Go to location</title>
              <path
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
