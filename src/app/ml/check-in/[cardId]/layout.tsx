export default function MLLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <h1 className="mb-8 font-bold text-4xl">Maker Lab Check-in Form</h1>
      {children}
    </div>
  );
}
