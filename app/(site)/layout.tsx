import { Suspense } from "react";

import Footer from "@/components/footer";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";

import "swiper/css";
import "swiper/css/virtual";
import "swiper/css/pagination";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-dvh overflow-hidden max-w-sm mx-auto sm:border-x-2 border-primary">
      <div className="grow overflow-y-auto scrollbar-hide">
        <Suspense>{children}</Suspense>
      </div>
      <Footer />
    </div>
  );
}
