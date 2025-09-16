import Footer from "@/components/footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-dvh overflow-hidden">
      {/* <Navbar /> */}
      <div className="grow overflow-y-auto">{children}</div>
      <Footer />
    </div>
  );
}
