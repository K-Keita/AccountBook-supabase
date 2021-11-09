// import Link from "next/link";
import type { ReactNode } from "react";
// import { MenuBar } from "src/components/menuBar";
// import { client } from "src/libs/supabase";
// import { Footer } from "src/layouts/footer";
// import { Header } from "src/layouts/header";

type Props = {
  children: ReactNode;
};

export const AuthLayout = (children: Props) => {
  // const user = client.auth.user();

  return (
    <>
      <div
        className="h-screen text-white bg-gradient-to-b from-blue-800 via-purple-900 to-danger"
        style={{ fontFamily: "游明朝体" }}
      >
        {children}
        {/* <div className="absolute top-0 w-full bg-blue-600 bg-opacity-20">
          <p className="py-3 text-sm text-center cursor-pointer">
            <span className="opacity-80">アカウントをお持ちでない方 </span>
            <Link href="/signUp" passHref>
              <span className="hover:underline">登録はこちら</span>
            </Link>
          </p>
        </div>
        <div className="px-8 pt-28 pb-5">
          <Title />
        </div>
        <input
          placeholder="メールアドレス"
          className="block py-2 px-1 my-5 mx-auto w-9/12 bg-white bg-opacity-10"
        />
        <input
          placeholder="パスワード"
          className="block py-2 px-1 my-5 mx-auto w-9/12 bg-white bg-opacity-10"
        />
        <button
          onClick={() => {
            signInWithEmail("k.syarin2610@gmail.com", "12345678");
          }}
          className="block py-2 my-5 mx-auto w-9/12 text-center text-gray-600 bg-white bg-opacity-80 rounded-sm"
        >
          ログイン
        </button>
        <p className="text-xs text-center text-gray-100">
          ログインパスワードを忘れてしまった方は
          <span className="text-blue-500 hover:underline cursor-pointer">
            こちら
          </span>
        </p>
        <div className="flex mt-16 opacity-80">
          <div className="mx-auto mb-3 w-3/12 border-b" />
          <p className="">または</p>
          <div className="mx-auto mb-3 w-3/12 border-b" />
        </div>
        <button
          onClick={signInWithGoogle}
          className="flex py-1 px-1 my-6 mx-auto w-9/12 text-center bg-google bg-opacity-50 rounded-sm"
        >
          <div className="p-1 h-8 bg-white rounded-sm">
            <Image
              alt="Google_icon"
              src="/icons/Google.png"
              width={24}
              height={24}
            />
          </div>
          <p className="flex-1 mt-1 text-center">Googleでログイン</p>
        </button> */}
        <div className="table absolute bottom-1 mx-auto w-full text-xs text-center">
          &copy;My-house-account
        </div>
      </div>
    </>
  );
};
