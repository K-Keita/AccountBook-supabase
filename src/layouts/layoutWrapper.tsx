import type { ReactNode } from "react";
// import { Footer } from "src/layouts/footer";
// import { Header } from "src/layouts/header";

type Props = {
  children: ReactNode;
};

export const LayoutWrapper = (props: Props) => {
  return (
      <div
        className="text-white bg-gradient-to-b from-purple-600 via-blue-500 to-green-300"
        style={{ fontFamily: "游明朝体" }}
      >
        {props.children}
      </div>
  );
};
