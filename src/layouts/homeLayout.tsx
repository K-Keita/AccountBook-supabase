import type { ReactNode } from "react";
import { Header } from "src/layouts/header";


export const HomeLayout = (page: ReactNode) => {


  return (
    <div>
      <div className="hidden sm:block">
        <Header />
      </div>
      <div
        className="text-white bg-gradient-to-b from-blue-800 via-purple-900 to-danger"
        style={{ fontFamily: "游明朝体" }}
      >
        {page}
      </div>
    </div>
  );
};
