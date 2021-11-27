import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { ItemForm } from "src/components/ItemForm";
import { MenuBar } from "src/components/menuBar";

export const SecondLayout = (page: ReactNode) => {
  const router = useRouter();

  return (
    <>
      <div
        className="text-white bg-gray-600"
        style={{ fontFamily: "游明朝体" }}
      >
        <div className="mx-auto  bg-blue-800 sm:flex">
          <div className="max-w-xl w-80"></div>
          <main className="overflow-hidden relative z-40 w-full min-h-screen bg-home rounded-t-3xl animate-slide-in-bottom sm:ml-auto sm:max-w-3xl md:p-5">
            <Link href="/" passHref>
              <button className="p-6 text-2xl sm:hidden">-Title-</button>
            </Link>
            {page}
          </main>
          <ItemForm />
        </div>
        <div>
          <MenuBar page={router.pathname} />
        </div>
      </div>
    </>
  );
};
