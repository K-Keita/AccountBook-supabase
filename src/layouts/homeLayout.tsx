import type { ReactNode } from "react";
// import { Footer } from "src/layouts/footer";
// import { Header } from "src/layouts/header";

// type Props = {
//   children: ReactNode;
// };

export const HomeLayout = (page: ReactNode) => {
  return (
    <div
      className="text-white bg-gradient-to-b from-blue-800 via-purple-900 to-danger"
      style={{ fontFamily: "游明朝体" }}
    >
      {page}
    </div>
  );
};
