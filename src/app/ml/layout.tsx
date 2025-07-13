export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h1 className="mb-8 text-4xl font-bold">Maker Lab Check-in</h1>
      {children}
    </>
  );
}
