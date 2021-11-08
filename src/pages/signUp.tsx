/* eslint-disable react-hooks/exhaustive-deps */
import "tailwindcss/tailwind.css";

import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { client } from "src/libs/supabase";

const SignUp = () => {
  const user = client.auth.user();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, []);

  const signUpWithEmail = async (email: string, password: string) => {
    const { user, error } = await client.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      throw new Error("");
    }

    if (user) {
      const { data, error } = await client.from("users").insert([
        {
          userID: user.id,
          targetAmount: 50000,
          categoryList: ["外食", "スーパー", "コンビニ"],
        },
      ]);

      if (error) {
        throw new Error("");
      }

      if (data) {
        router.push("/");
      }
    }
  };

  const signUpWithGoogle = async () => {
    const { error } = await client.auth.signIn({
      provider: "google",
    });
    if (error) {
      throw new Error("");
    }
  };

  return (
    <>
      <div
        className="h-screen text-white bg-gradient-to-b from-blue-800 via-purple-900 to-danger"
        style={{ fontFamily: "游明朝体" }}
      >
        <div className="absolute top-0 w-full bg-blue-600 bg-opacity-20">
          <p className="py-3 text-sm text-center cursor-pointer">
            <span className="opacity-80">既にアカウントをお持ちの方 </span>
            <span className="hover:underline">ログイン</span>
          </p>
        </div>
        <div className="px-8 pt-28 pb-5">
          <div className="flex relative justify-around border-b">
            <h2 className="absolute top-20 z-40 text-3xl font-bold tracking-lg text-center animate-slit-in-vertical">
              Title
            </h2>
            <div className="mt-auto w-8 h-24 bg-blue-400 animate-scale-in-ver-bottom"></div>
            <div className="mt-auto w-8 h-12 bg-blue-400 animate-scale-in-ver-bottom"></div>
            <div className="mt-auto w-8 h-20 bg-blue-400 animate-scale-in-ver-bottom"></div>
            <div className="mt-auto w-8 h-32 bg-blue-400 animate-scale-in-ver-bottom"></div>
            <div className="mt-auto w-8 h-16 bg-blue-400 animate-scale-in-ver-bottom"></div>
          </div>
        </div>
        <button
          onClick={() => {
            signUpWithGoogle();
          }}
          className="flex py-1 px-1 mx-auto mt-24 w-9/12 text-center bg-google bg-opacity-50 rounded-sm"
        >
          <div className="p-1 h-8 bg-white rounded-sm">
            <Image
              alt="Google_icon"
              src="/icons/Google.png"
              width={24}
              height={24}
            />
          </div>
          <p className="flex-1 mt-1 text-center">Googleで登録</p>
        </button>
        <div className="flex mt-8 opacity-80">
          <div className="mx-auto mb-3 w-3/12 border-b" />
          <p className="">または</p>
          <div className="mx-auto mb-3 w-3/12 border-b" />
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
            signUpWithEmail("k.syarin2610@gmail.com", "12345678");
          }}
          className="block py-2 my-5 mx-auto w-9/12 text-center text-gray-600 bg-white bg-opacity-80 rounded-sm"
        >
          登録
        </button>
        <div className="table absolute bottom-1 py-1 mx-auto w-full text-xs text-center">
          &copy;My-house-account
        </div>
      </div>
    </>
  );
};

export default SignUp;
