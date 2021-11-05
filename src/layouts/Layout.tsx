import type { ReactNode } from "react";
import { MenuBar } from "src/components/menuBar";
// import { client } from "src/libs/supabase";
// import { Footer } from "src/layouts/footer";
// import { Header } from "src/layouts/header";

type Props = {
  children: ReactNode;
};

export const Layout = (props: Props) => {
  // const user = client.auth.user();

  return (
    <>
      <div className="relative -z-10 h-1 bg-blue-400" />
      <main className="relative z-40 pb-16 w-full min-h-screen text-white bg-home rounded-t-3xl animate-slide-in-bottom md:p-5 md:w-1/2">
        {props.children}
      </main>
      <MenuBar />
    </>
  );
};
