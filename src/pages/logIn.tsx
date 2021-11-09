/* eslint-disable react-hooks/exhaustive-deps */
import "tailwindcss/tailwind.css";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { AuthButton } from "src/components/utils/authButton";
import { GoogleButton } from "src/components/utils/googleButton";
import { Title } from "src/components/utils/title";
import { AuthLayout } from "src/layouts/authLayout";
import { client } from "src/libs/supabase";

type FormValues = {
  email: string;
  password: string;
};

const LogIn = () => {
  const user = client.auth.user();
  const router = useRouter();

  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    signInWithEmail(data.email, data.password);
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { user, error } = await client.auth.signIn({
      email: email,
      password: password,
    });

    if (user) {
      router.push("/");
    }

    if (error) {
      throw new Error("");
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await client.auth.signIn({
      provider: "google",
    });

    if (error) {
      throw new Error("");
    }
  };

  return (
    <AuthLayout>
      <div className="absolute top-0 w-full bg-blue-600 bg-opacity-20">
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          autoFocus
          placeholder="メールアドレス"
          {...register("email")}
          className="block py-2 px-1 my-5 mx-auto w-9/12 bg-white bg-opacity-10"
        />
        <input
          placeholder="パスワード"
          {...register("password")}
          className="block py-2 px-1 my-5 mx-auto w-9/12 bg-white bg-opacity-10"
        />
        <AuthButton text="ログイン" onClick={handleSubmit(onSubmit)} />
      </form>
      {/* <input
        placeholder="メールアドレス"
        className="block py-2 px-1 my-5 mx-auto w-9/12 bg-white bg-opacity-10"
      />
      <input
        placeholder="パスワード"
        className="block py-2 px-1 my-5 mx-auto w-9/12 bg-white bg-opacity-10"
      /> */}
      {/* <button
          onClick={() => {
            signInWithEmail("k.syarin2610@gmail.com", "12345678");
          }}
          className="block py-2 my-5 mx-auto w-9/12 text-center text-gray-600 bg-white bg-opacity-80 rounded-sm"
        >
          ログイン
        </button> */}
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
      <GoogleButton text="Googleでログイン" onClick={signInWithGoogle} />
      {/* <button
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
    </AuthLayout>
  );
};

export default LogIn;
