import type { ReactNode } from "react";
import { Header } from "src/layouts/header";

export const HomeLayout = (page: ReactNode) => {
  return (
    <div
      className="font-body text-white sm:bg-blue-800"
    >
      <Header />
      <main className="mx-auto max-w-[800px]">{page}</main>
    </div>
  );
};
