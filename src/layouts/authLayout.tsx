import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const AuthLayout = (children: Props) => {
  return (
    <main
      className="h-screen text-white bg-gradient-to-b from-blue-800 via-purple-900 to-danger"
      style={{ fontFamily: "游明朝体" }}
    >
      {children}
      <div className="table absolute bottom-1 mx-auto w-full text-xs text-center">
        &copy;My-house-account
      </div>
    </main>
  );
};
