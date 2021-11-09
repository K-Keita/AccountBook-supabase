/* eslint-disable react-hooks/exhaustive-deps */
import "tailwindcss/tailwind.css";

import Link from "next/link";
import { useRouter } from "next/router";
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

const SignUp = () => {
  const router = useRouter();

  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    signUpWithEmail(data.email, data.password);
  };

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
    <AuthLayout>
      <div className="absolute top-0 w-full bg-blue-600 bg-opacity-20">
        <p className="py-3 text-sm text-center cursor-pointer">
          <span className="opacity-80">既にアカウントをお持ちの方 </span>
          <Link href="/logIn" passHref>
            <span className="hover:underline">ログイン</span>
          </Link>
        </p>
      </div>
      <div className="px-8 pt-28 pb-5">
        <Title />
      </div>
      <GoogleButton text="Googleで登録" onClick={signUpWithGoogle} />
      {/* <button
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
      </button> */}
      <div className="flex mt-8 opacity-80">
        <div className="mx-auto mb-3 w-3/12 border-b" />
        <p>または</p>
        <div className="mx-auto mb-3 w-3/12 border-b" />
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
        <AuthButton text="登録" onClick={handleSubmit(onSubmit)} />
      </form>
      {/* <button
        onClick={() => {
          signUpWithEmail("k.syarin2610@gmail.com", "12345678");
        }}
        className="block py-2 my-5 mx-auto w-9/12 text-center text-gray-600 bg-white bg-opacity-80 rounded-sm"
      >
        登録
      </button> */}
    </AuthLayout>
  );
};

export default SignUp;
