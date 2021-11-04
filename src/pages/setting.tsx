import { Switch } from "@headlessui/react";
import Link from "next/link";
import router from "next/router";
import type { VFC } from "react";
import { useCallback, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { MenuBar } from "src/components/menuBar";
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
        <div className="border-b w-11/12  py-1 my-5 mx-auto">
          <div className="flex">
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
              onClick={() => {
                setIsMenu(true);
              }}
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
          {isMenu ? (
            <form
              className="mt-4 animate-slide-in-bck-center flex"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                defaultValue={userData?.targetAmount.toLocaleString()}
                autoFocus
                type="number"
                {...register("targetAmount")}
                className="block text-gray-600 bg-blue-100 bg-opacity-20 border-b outline-none"
              />
              <input
                className="text-sm bg-white text-gray-600"
                value="変更"
                type="submit"
              />
            </form>
          ) : null}
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
      <MenuBar />
    </>
  ) : null;
};

export default Setting;
