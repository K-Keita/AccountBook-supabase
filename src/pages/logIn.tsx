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
    <main
      className="h-screen text-white bg-gradient-to-b from-blue-800 via-purple-900 to-danger"
      style={{ fontFamily: "游明朝体" }}
    >
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
      <div className="table absolute bottom-1 mx-auto w-full text-xs text-center">
        &copy;My-house-account
      </div>
    </main>
  );
};

export default LogIn;
