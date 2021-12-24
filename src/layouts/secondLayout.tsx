import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { MenuBar } from "src/components/menuBar";
import { Header } from "src/layouts/header";

export const SecondLayout = (page: ReactNode) => {
  const router = useRouter();

  return (
    <div className="text-white bg-gray-600 font-body">
      <Header />
      <main className="justify-center mx-auto bg-blue-800 sm:flex">
        <div className="overflow-hidden relative z-40 w-full min-h-screen bg-home rounded-t-3xl animate-slide-in-bottom sm:mx-auto sm:max-w-[1100px] sm:h-screen sm:rounded-none sm:border-r sm:border-l sm:animate-none">
          {page}
        </div>
      </main>
      <MenuBar page={router.pathname} />
    </div>
  );
};
