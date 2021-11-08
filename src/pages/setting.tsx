import { Switch } from "@headlessui/react";
import router from "next/router";
// import type { VFC } from "react";
import { useCallback, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { getUserData } from "src/hooks/getData";
import type { UserData } from "src/interface/type";
import { SecondLayout } from "src/layouts/secondLayout";
import { client } from "src/libs/supabase";

type FormValue = {
  targetAmount: number;
};

const Setting = () => {
  const user = client.auth.user();
  const [isMenu, setIsMenu] = useState<boolean>(false);
  const [isEnabled, setIdEnabled] = useState<boolean>(false);
  const [userData, setItemData] = useState<UserData>();

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
        setItemData(userData);
      }
    }
  }, [user]);

  //使用金額の変更
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

      getUser();
    }
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <>
      <h2 className="p-4 text-4xl font-bold">Setting</h2>
      <div className="flex py-2 my-5 mx-auto w-11/12 border-b">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-2 w-6 h-6"
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
        <p>ダークモード</p>
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
      <div className="py-2 my-5 mx-auto w-11/12 border-b">
        <div className="flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-2 w-6 h-6"
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
          <p>使用額変更</p>
          <p className="mx-2 ml-auto opacity-80">
            ¥{userData?.targetAmount.toLocaleString()}
          </p>
          {isMenu ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => {
                setIsMenu(false);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => {
                setIsMenu(true);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
        {isMenu ? (
          <form
            className="flex justify-center my-4 animate-slide-in-bck-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              defaultValue={userData ? userData.targetAmount : 0}
              autoFocus
              type="number"
              {...register("targetAmount")}
              className="block pl-2 text-white bg-blue-100 bg-opacity-20 border-b outline-none"
            />
            <input
              className="p-1 mx-2 text-sm bg-gray-50 bg-opacity-0 border"
              value="変更"
              type="submit"
            />
          </form>
        ) : null}
      </div>
      <div className="flex py-2 my-5 mx-auto w-11/12 border-b ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-2 w-6 h-6"
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
        <p>ログアウト</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-1 ml-auto w-6 h-6"
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
    </>
  );
};

Setting.getLayout = SecondLayout;

export default Setting;
