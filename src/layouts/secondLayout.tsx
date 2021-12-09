import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { MenuBar } from "src/components/menuBar";

export const SecondLayout = (page: ReactNode) => {
  const router = useRouter();

  return (
    <div className="text-white bg-gray-600" style={{ fontFamily: "游明朝体" }}>
      <div className="justify-center mx-auto bg-blue-800 sm:flex">
        <main className="overflow-hidden relative z-40 w-full min-h-screen bg-home rounded-t-3xl animate-slide-in-bottom sm:rounded-none sm:animate-none md:p-5">
          <Link href="/" passHref>
            <button className="p-6 text-2xl sm:hidden">-Title-</button>
          </Link>
          {page}
        </main>
      </div>
      <div className="block sm:hidden">
        <MenuBar page={router.pathname} />
      </div>
    </div>
  );
};
