import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { MenuBar } from "src/components/menuBar";
import { Header } from "src/layouts/header";

export const SecondLayout = (page: ReactNode) => {
  const router = useRouter();

  return (
    <div className="text-white bg-gray-600 font-body">
      <Header />
      <main className="mx-auto bg-blue-800">
        <div className="overflow-hidden relative z-20 sm:pt-12 md:px-16 w-full min-h-screen bg-home rounded-t-3xl animate-slide-in-bottom sm:animate-none mx-auto max-w-[800px]">
          {page}
        </div>
      </main>
      <MenuBar page={router.pathname} />
    </div>
  );
};
