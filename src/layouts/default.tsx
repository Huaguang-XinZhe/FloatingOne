export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col items-center h-screen">{children}</div>;
}
