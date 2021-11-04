import { Switch } from "@headlessui/react";
import Link from "next/link";
import router from "next/router";
import type { VFC } from "react";
import { useCallback, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { Data } from "src/interface/type";
import { client } from "src/libs/supabase";

const d = new Date();
const y = d.getFullYear();
const m = d.getMonth() + 1;
// const day = d.getDate();

const getItems = async (userID: string, y: number, m: number) => {
  let { data, error } = await client
    .from("users")
    .select("*")
    .eq("userID", userID);

  if (!error && data) {
    const userData = data[0];
    ({ data, error } = await client
      .from("purchasedItem")
      .select("*")
      .contains("date", [`year:${y}`, `month:${m}`])
      .eq("userID", userID));

    const totalPrice = data?.reduce((sum, element) => {
      return sum + element.price;
    }, 0);

    if (!error && data) {
      return { userData: userData, items: data, totalPrice: totalPrice };
    } else {
      return { userData: userData, items: null, totalPrice: null };
    }
  }

  return { userData: null, items: null, totalPrice: null };
};

const getUserData = async (userID: string) => {
  const { data, error } = await client
    .from("users")
    .select("*")
    .eq("userID", userID);

  if (!error && data) {
    return { userData: data[0] };
  } else {
    return { userData: null };
  }
};

type FormValue = {
  targetAmount: number;
};

const Setting: VFC = () => {
  const user = client.auth.user();
  const [isEnabled, setIdEnabled] = useState(false);
  const [userData, setUserData] = useState<Data>();
  const [isMenu, setIsMenu] = useState<boolean>(false);

  const { register, handleSubmit } = useForm<FormValue>();

  const onSubmit: SubmitHandler<FormValue> = (data) => {
    changeTargetAmount(data.targetAmount);
  };

  const signOut = async () => {
    const { error } = await client.auth.signOut();
    router.push("/");

    if (error) {
      throw new Error("");
    }
  };

  const getUser = useCallback(async () => {
    if (user) {
      const { userData } = await getUserData(user.id.toString());

      if (userData) {
        setUserData(userData);
      }
    }
  }, [user]);

  //カテゴリーの削除
  const changeTargetAmount = async (value: number) => {
    if (value < 0) {
      alert("金額の値が不適切です");
      return false;
    }
    if (userData) {
      const { error } = await client.from("users").upsert({
        id: userData.id,
        userID: userData.userID,
        targetAmount: value,
      });

      if (error) {
        alert(error);
      }

      // getItems(userData.id.toString(), y, m);
    }
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  return user ? (
    <>
      <div className="relative -z-10 h-1 opacity-0" />
      <main className="relative z-40 pt-6 pb-16 w-full min-h-screen text-white bg-gradient-to-b from-dark via-green-200 to-blue-500 rounded-t-3xl animate-slide-in-bottom md:p-5 md:w-1/2">
        <div className="flex relative justify-between px-5">
          <Link href="/" passHref>
            <button className="py-6 px-3 text-2xl">-Title-</button>
          </Link>
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
            } relative inline-flex items-center h-6 rounded-full ml-auto mr-1 w-11`}
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
              strokeWidth={1.2}
              d="M9 8l3 5m0 0l3-5m-3 5v4m-3-5h6m-6 3h6m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg">使用額変更</p>
          <p className="mx-1 mt-1 ml-auto opacity-80">
            ¥{userData?.targetAmount.toLocaleString()}
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 w-8 h-8"
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
        <div className="hidden">
          <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
            <input
              defaultValue={userData?.targetAmount.toLocaleString()}
              autoFocus
              type="number"
              {...register("targetAmount")}
              className="block mx-auto text-gray-600 bg-blue-100 bg-opacity-20 border-b outline-none"
            />
            <input type="submit" />
          </form>
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
              strokeWidth={1.3}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <p className="text-lg">ログアウト</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 ml-auto w-8 h-8"
            fill="none"
            onClick={signOut}
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
      <div className="flex fixed bottom-0 z-50 justify-around py-2 w-full bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 rounded-t-xl">
        {/* <AddItem
            userData={userData}
            uuid={user.id}
            getItemList={getItemList}
          /> */}
        <Link href="/" passHref>
          <div className="cursor-pointer">
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
                strokeWidth={1}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <p className="text-xs text-center">registration</p>
          </div>
        </Link>
        <Link href="/category" passHref>
          <div className={`cursor-pointer`}>
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
                strokeWidth={1}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <p className="text-xs text-center">Category</p>
          </div>
        </Link>
        <Link href="/chart" passHref>
          <div className={`cursor-pointer`}>
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
                strokeWidth={1.2}
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.3}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
            <p className="text-xs text-center">Chart</p>
          </div>
        </Link>
        <Link href="/setting" passHref>
          <div className={`cursor-pointer`}>
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
                strokeWidth={1.2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-xs text-center">Setting</p>
          </div>
        </Link>
      </div>
    </>
  ) : null;
};

export default Setting;
