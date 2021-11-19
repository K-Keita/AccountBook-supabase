import Link from "next/link";
// import Head from 'next/head';
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { MenuBar } from "src/components/menuBar";

export const SecondLayout = (page: ReactNode) => {
  const router = useRouter();

  return (
    <>
      <div
        className="text-white bg-blue-800"
        style={{ fontFamily: "游明朝体" }}
      >
        <div className="relative -z-10 h-1" />
        <main className="relative z-40 w-full min-h-screen bg-home rounded-t-3xl animate-slide-in-bottom md:p-5 md:w-1/2 overflow-hidden">
          <Link href="/" passHref>
            <button className="p-6 text-2xl">-Title-</button>
          </Link>
          {page}
        </main>
        <MenuBar page={router.pathname} />
      </div>
    </>
  );
};
