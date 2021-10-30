import { Switch } from "@headlessui/react";
import Link from "next/link";
import type { VFC } from "react";
import { useState } from "react";

const Setting: VFC = () => {
  const [isEnabled, setIdEnabled] = useState(false);

  return (
    <main className="relative z-40 pt-7 pb-16 w-full min-h-screen text-white bg-gradient-to-b from-dark via-green-200 to-blue-500 rounded-t-3xl md:p-5 md:w-1/2">
      <div className="flex justify-between pb-3">
        <Link href="/" passHref>
          <button className="px-4 text-2xl">-Title-</button>
        </Link>
        <div className="flex">
          <Link href="/category" passHref>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-2 w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.0}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </Link>
          <Link href="/chart" passHref>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-4 w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.0}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </Link>
        </div>
      </div>
      <h2 className="p-4 text-4xl font-bold">Setting</h2>
      <div className="flex py-1 my-5 mx-auto w-11/12 border-b">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-2 w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
        <p className="text-lg">ダークモード</p>
        <Switch
          checked={isEnabled}
          onChange={setIdEnabled}
          className={`${
            isEnabled
              ? "bg-blue-600 bg-opacity-30"
              : "bg-gray-200 bg-opacity-30"
          } relative inline-flex items-center h-6 rounded-full ml-auto mr-2 w-11`}
        >
          <span className="sr-only">Enable notifications</span>
          <span
            className={`${
              isEnabled ? "translate-x-6" : "translate-x-1"
            } inline-block w-4 h-4 transform bg-white rounded-full`}
          />
        </Switch>
      </div>
      <div className="flex py-1 my-5 mx-auto w-11/12 border-b ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-2 w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <p className="text-lg">ログアウト</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-3 ml-auto w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </main>
  )
};

export default Setting;
