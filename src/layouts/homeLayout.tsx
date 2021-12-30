import type { ReactNode } from "react";
import { Header } from "src/layouts/header";

export const HomeLayout = (page: ReactNode) => {
  return (
    <div
      className="text-white sm:bg-blue-800 font-body"
    >
      <Header />
      <main className="mx-auto max-w-[800px]">{page}</main>
    </div>
  );
};
