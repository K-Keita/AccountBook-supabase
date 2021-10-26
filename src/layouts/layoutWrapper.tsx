import type { ReactNode } from "react";
import { Footer } from "src/layouts/footer";
import { Header } from "src/layouts/header";

type Props = {
  children: ReactNode;
};

export const LayoutWrapper = (props: Props) => {
  return (
    // <div className="bg-gradient-to-b from-blue-400 to-red-500">
    <div className="bg-gradient-to-b from-purple-600 via-blue-500 to-breen-300">
      <Header />
      <main className="text-gray-600 ">
        <div>{props.children}</div>
      </main>
      <Footer />
    </div>
  );
};
