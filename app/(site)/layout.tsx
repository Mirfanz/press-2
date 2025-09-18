import { Suspense } from "react";

import Footer from "@/components/footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-dvh overflow-hidden max-w-sm mx-auto sm:border-x-2 border-primary">
      <div className="grow overflow-y-auto">
        <Suspense>{children}</Suspense>
      </div>
      <Footer />
    </div>
  );
}
