import type { ReactNode } from "react";
import { Footer } from "src/layouts/footer";
import { Header } from "src/layouts/header";

type Props = {
  children: ReactNode;
};

export const LayoutWrapper = (props: Props) => {
  return (
    <div>
      <Header />
      <main className="text-gray-600 bg-gray-50">
        <div>{props.children}</div>
      </main>
      <Footer />
    </div>
  );
};
