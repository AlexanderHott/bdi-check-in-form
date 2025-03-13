import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold">Select Space</h1>
      <LocationCard
        title="Maker Lab"
        desc="3D Printing, Laser Cutting..."
        href="/ml"
      />
      <LocationCard
        title="Automation Lab"
        desc="Soldering, Electronics..."
        href="/al"
      />
      <LocationCard
        title="Digital Scholarship Lab"
        desc="Specialized computing, ..."
        href="/dsl"
      />
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
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 transition-transform duration-150 ease-in-out group-hover:translate-x-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
