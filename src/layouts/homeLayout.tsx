import type { ReactNode } from "react";

export const HomeLayout = (page: ReactNode) => {
  return (
    <div
      className="text-white sm:bg-gray-600"
      style={{ fontFamily: "游明朝体" }}
    >
      <div className="mx-auto h-screen sm:bg-blue-800">{page}</div>
    </div>
  );
};
