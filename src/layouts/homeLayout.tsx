import type { ReactNode } from "react";
import { Header } from "src/layouts/header";

export const HomeLayout = (page: ReactNode) => {
  return (
    <div
      className="text-white sm:bg-blue-800"
      style={{ fontFamily: "游明朝体" }}
    >
      <Header />
      <main className="mx-auto max-w-[1100px] h-screen sm:border-r sm:bg-home sm:border-l">{page}</main>
    </div>
  );
};
