/* eslint-disable react-hooks/exhaustive-deps */
import { Tab } from "@headlessui/react";
import { Auth } from "@supabase/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { AddItem } from "src/components/addItem";
import { ItemList } from "src/components/itemList";
import { sortData } from "src/hooks/sortData";
import type { Data } from "src/interface/type";
import type { UserData } from "src/interface/type";
import { client } from "src/libs/supabase";

type Props = {
  children: ReactNode;
};

const d = new Date();
const y = d.getFullYear();
const m = d.getMonth() + 1;
const day = d.getDate();
const count = new Date(y, m, 0).getDate();
const thisMonthDays = [...Array(count)].map((_, i) => {
  return i + 1;
});

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

// 全てのアイテムの取得
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

const Container = (props: Props) => {
  const { user } = Auth.useUser();

  const [userData, setUserData] = useState<Data>();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [items, setItems] = useState<UserData[]>([]);
  const [oneDayTotalPrice, setOneDayTotalPrice] = useState<number>(0);
  const [year, setYear] = useState<number>(y);
  const [month, setMonth] = useState<number>(m);

  const [isTop, setIsTop] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const scrollAction = () => {
      if (window.scrollY > 100) {
        setIsTop(true);
      } else {
        setIsTop(false);
      }
    };
    window.addEventListener("scroll", scrollAction, {
      capture: false,
      passive: true,
    });
    scrollAction();

    return () => {
      window.removeEventListener("scroll", scrollAction);
    };
  }, []);

  //ユーザーデータ、アイテムの取得
  const getItemList = useCallback(
    async (year: number, month: number) => {
      if (user) {
        const { userData, items, totalPrice } = await getItems(
          user.id.toString(),
          year,
          month
        );
        if (userData) {
          setUserData(userData);
        } else {
          router.push("/login");
        }
        if (items) {
          setItems(sortData(items));
          setTotalPrice(totalPrice);

          if (month === m) {
            const oneDayPrice = items.reduce(
              (sum: number, element: { buyDate: string[]; price: number }) => {
                if (element.buyDate[2] === day.toString()) {
                  return sum + element.price;
                }
                return sum + 0;
              },
              0
            );
            setOneDayTotalPrice(oneDayPrice);
          }
        }
      }
    },
    [router, user]
  );

  useEffect(() => {
    getItemList(year, month);
  }, [user, getItemList, router, year, month]);

  useEffect(() => {
    if (process.browser) {
      moveScroll();
    }
  }, [process.browser]);

  //ボタンの位置へ移動
  const moveScroll = () => {
    const target = document.getElementById("sc");
    if (target === null) {
      setTimeout(() => {
        moveScroll();
      }, 100);
    }
    target ? (target.scrollLeft += 48 * day - 1) : null;
  };

  //前の月へ
  const prevMonth = useCallback(() => {
    if (month === 1) {
      setYear((year) => {
        return year - 1;
      });
      setMonth(12);
      return;
    }
    setMonth((month) => {
      return month - 1;
    });
  }, [month]);

  //次の月へ
  const nextMonth = useCallback(() => {
    if (month === m && year === y) {
      return false;
    } else if (month === 12) {
      setYear((year) => {
        return year - 1;
      });
      setMonth(1);
      return;
    }

    setMonth((month) => {
      return month + 1;
    });
  }, [month, year]);

  //1日の平均金額(今月)
  const targetAverage = userData ? userData.targetAmount / count : null;

  //1日の平均金額(現在)
  const nowAverage = totalPrice / d.getDate();

  if (user) {
    return (
      <div className="pt-1 min-h-lg text-white md:flex">
        <div className="fixed p-5 mt-10 w-full h-lg md:w-1/2">
          <h2 className="mt-24 text-5xl text-center">TITLE</h2>
          <div className="mt-16 mb-8">
            <AddItem
              userData={userData}
              uuid={user.id}
              getItemList={getItemList}
            />
          </div>
          {totalPrice ? (
            <div className="px-8 pt-2 pb-1 text-3xl text-center ">
              残り：¥
              {userData
                ? (userData.targetAmount - totalPrice).toLocaleString()
                : null}
            </div>
          ) : null}
          <div className="flex justify-around">
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
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <Link href="/category" passHref>
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
                  strokeWidth={1.2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </Link>
            <Link href="/setting" passHref>
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
          </div>
        </div>
        <div className="relative -z-10 h-lg opacity-0" />
        <div className="relative z-40 pt-10 w-full bg-gradient-to-b from-dark via-green-200 to-blue-500 rounded-t-3xl md:p-5 md:w-1/2">
          <div className="flex px-4  ">
            <button onClick={prevMonth}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="p-2 text-2xl">{month}月</h2>
            <button onClick={nextMonth}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
            <div className="mx-4 ml-auto border-white">
              <p>今月の金額：¥{userData?.targetAmount.toLocaleString()}</p>
              <p className="text-sm text-center">
                (平均金額：
                {targetAverage
                  ? Math.floor(targetAverage).toLocaleString()
                  : null}
                )
              </p>
            </div>
          </div>
          <Tab.Group defaultIndex={day - 1}>
            <Tab.List
              id="sc"
              className="flex overflow-x-scroll flex-nowrap py-3 px-4 mx-auto mt-3 space-x-1 w-11/12 border-b"
            >
              {thisMonthDays.map((category) => {
                return (
                  <Tab
                    key={category}
                    disabled={category > day}
                    className={({ selected }) => {
                      return classNames(
                        `min-w-lg py-2.5 text-lg font-semibold leading-5 rounded-lg ${
                          category > day ? "text-gray-400" : "text-blue-600"
                        }`,
                        "focus:outline-none focus:ring-1 ring-opacity-60",
                        selected
                          ? "shadow bg-selected bg-opacity-50"
                          : `${
                              category > day
                                ? ""
                                : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                            }`
                      );
                    }}
                  >
                    {category}
                  </Tab>
                );
              })}
            </Tab.List>
            <div
              className={`${
                isTop ? "block" : "hidden"
              } animate-slide-in-bck-center ml-auto mt-5 w-1/2`}
            >
              <p className="py-1">
                今日の金額：
                {oneDayTotalPrice.toLocaleString()}円
              </p>
              <p className="text-sm">
                1日の平均金額：
                {nowAverage ? Math.floor(nowAverage).toLocaleString() : null}円
              </p>
            </div>
            {thisMonthDays.map((category) => {
              const item = items.filter((value) => {
                return value.buyDate[2] === category.toString();
              });
              const totalItems = item.reduce((sum, element) => {
                return sum + element.price;
              }, 0);
              return (
                <Tab.Panels key={category}>
                  <Tab.Panel
                    className={classNames(
                      "rounded-b-xl min-h-lg",
                      "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                    )}
                  >
                    <div
                      className={`text-xl py-3 mx-4 px-4 font-semibold ${
                        isTop ? "hidden" : "block animate-slide-in-bck-center"
                      }`}
                    >
                      total: ¥
                      {category.toString() === "全て"
                        ? totalPrice.toLocaleString()
                        : totalItems.toLocaleString()}
                    </div>
                    <div
                      className={`${
                        isTop ? "block" : "hidden"
                      } animate-slit-in-vertical text-base mx-4 py-3 my-3 px-4 table border-r`}
                    >
                      total:
                      <span className="block text-3xl font-bold">
                        ¥
                        {category.toString() === "全て"
                          ? totalPrice.toLocaleString()
                          : totalItems.toLocaleString()}
                      </span>
                    </div>
                    <ItemList
                      items={category.toString() === "全て" ? items : item}
                      userData={userData}
                      uuid={user.id}
                      getItemList={getItemList}
                    />
                  </Tab.Panel>
                </Tab.Panels>
              );
            })}
          </Tab.Group>
        </div>
      </div>
    );
  }
  return <>{props.children}</>;
};

const Home = () => {
  return (
    <Container>
      <div className="flex justify-center pt-8">
        <div className="w-full sm:w-96">
          <Auth
            supabaseClient={client}
            providers={["google"]}
            socialColors={true}
          />
        </div>
      </div>
    </Container>
  );
};

export default Home;
