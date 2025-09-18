import { PropsWithChildren, Suspense } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative h-dvh max-w-sm mx-auto sm:border">
      <Suspense>{children}</Suspense>
    </div>
  );
}
