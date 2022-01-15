import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { MenuBar } from "src/components/menuBar";
import { Header } from "src/layouts/header";

export const SecondLayout = (page: ReactNode) => {
  const router = useRouter();

  return (
    <div className="font-body text-white bg-gray-600">
      <Header />
      <main className="mx-auto bg-blue-800">
        <div className="overflow-hidden relative z-20 mx-auto w-full max-w-4xl min-h-screen bg-home rounded-t-3xl animate-slide-in-bottom sm:pt-12 sm:animate-none md:px-4">
          {page}
        </div>
      </main>
      <MenuBar page={router.pathname} />
    </div>
  );
};
