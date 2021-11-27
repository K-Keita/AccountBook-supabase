import type { ReactNode } from "react";
// import { Header } from "src/layouts/header";
import {ItemForm} from 'src/components/ItemForm';

export const HomeLayout = (page: ReactNode) => {
  return (
    <div className="text-white bg-gray-600" style={{ fontFamily: "游明朝体" }}>
      <div className="mx-auto sm:bg-blue-800 sm:flex h-screen">
        <div className="w-80"/>
        <div
          className="text-white bg-gradient-to-b from-blue-800 via-purple-900 to-danger sm:bg-none w-full sm:ml-auto sm:max-w-3xl md:p-5"
          style={{ fontFamily: "游明朝体" }}
        >
          {page}
        </div>
        <ItemForm/>
      </div>
    </div>
  );
};
