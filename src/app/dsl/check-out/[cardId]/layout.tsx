export default function ALLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <h1 className="mb-8 font-bold text-4xl">
        Digital Scholarship Lab Check-out Form
      </h1>
      {children}
    </div>
  );
}
