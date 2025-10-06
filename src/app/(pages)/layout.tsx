import SessionRefresher from "../context/session-refresher";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <SessionRefresher />
    </div>
  );
}
