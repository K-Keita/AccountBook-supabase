import { Tab } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { useCallback, useEffect, useState } from "react";
import { AddCategory } from "src/components/addCategory";
import { EditCategory } from "src/components/editCategory";
import { ItemList } from "src/components/itemList";
import { sortData } from "src/hooks/sortData";
import type { Data as TitleType } from "src/interface/type";
import type { UserData } from "src/interface/type";
import { client } from "src/libs/supabase";

const d = new Date();
const y = d.getFullYear();
const m = d.getMonth() + 1;

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

const classes = ({ selected }: any) => {
  return classNames(
    `py-1  leading-5 font-medium rounded-lg mb-1 min-w-3l`,
    "focus:outline-none focus:ring-1 ring-offset-1 ring-offset-blue-400 ring-green-400",
    selected
      ? "shadow bg-gradient-to-r from-yellow-200 via-green-200 to-green-300 bg-opacity-20 text-white"
      : "text-gray-200 text-sm hover:bg-white/[0.12]  hover:text-white"
  );
};

const classes2 = ({ selected }: any) => {
  return classNames(
    `min-w-2lg leading-5 font-medium rounded-lg mx-1 mt-1 min-w-xl`,
    "focus:outline-none focus:ring-1 ring-offset-1 ring-offset-blue-400 ring-green-400",
    selected
      ? "shadow text-white"
      : "text-gray-200 text-sm min-w-lg hover:bg-white/[0.12]  hover:text-white"
  );
};

//全てのアイテムの取得
const getItems = async (userID: string, year: number, month: number) => {
  let { data, error } = await client
    .from("users")
    .select("*")
    .eq("userID", userID);

  if (!error && data) {
    const userData = data[0];
    ({ data, error } = await client
      .from("purchasedItem")
      .select("*")
      .contains("date", [`year:${year}`, `month:${month}`])
      .eq("userID", userID));

    const newData = data?.reduce((sum, element) => {
      return sum + element.price;
    }, 0);

    if (!error && data) {
      return { userData: userData, items: data, totalPrice: newData };
    } else {
      return { userData: userData, items: null, totalPrice: null };
    }
  }

  return { userData: null, items: null, totalPrice: null };
};

const Title: VFC = () => {
  const user = client.auth.user();

  const [items, setItems] = useState<UserData[]>([]);
  const [userData, setUserData] = useState<TitleType>();
  const [totalPrice, setTotalPrice] = useState<number>();
  const [categories, setCategories] = useState<string[]>([]);
  const [isTop, setIsTop] = useState<boolean>(false);

  const [year, setYear] = useState<number>(y);
  const [month, setMonth] = useState<number>(m);

  const router = useRouter();

  //IDと同じカテゴリーの商品を取得
  const getItemList = useCallback(
    async (year, month) => {
      if (user) {
        const { userData, items, totalPrice } = await getItems(
          user.id.toString(),
          year,
          month
        );
        if (userData) {
          setUserData(userData);
          setCategories(userData.categoryList);
        } else {
          router.push("/login");
        }
        if (items) {
          setItems(sortData(items));
          setTotalPrice(totalPrice);
        }
      }
    },
    [router, user]
  );

  useEffect(() => {
    getItemList(year, month);
  }, [user, getItemList, router, month, year]);

  useEffect(() => {
    const scrollAction = () => {
      if (window.scrollY > 120) {
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

  return user ? (
    <>
      <div className="min-h-lg text-white">
        <div className="md:flex">
          <div className="relative -z-10 h-1 opacity-0" />
          <div className="relative z-40 pt-2 w-full bg-gradient-to-b from-dark via-green-200 to-blue-500 rounded-t-3xl animate-slide-in-bottom md:p-5 md:w-1/2">
            <Link href="/" passHref>
              <button className="px-4 text-2xl">-Title-</button>
            </Link>
            <div className="flex justify-between p-3">
              {/* <Link href="/category" passHref>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-2 w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </Link> */}
            </div>
            <h2 className="p-4 text-4xl font-bold">Category</h2>
            <Tab.Group>
              <div className="min-h-screen">
                <Tab.List
                  className={`${
                    isTop
                      ? "overflow-x-scroll py-1"
                      : "flex-wrap justify-around py-3"
                  } flex px-2`}
                >
                  <Tab className={isTop ? classes2 : classes}>全て</Tab>
                  {categories.map((category) => {
                    return (
                      <Tab
                        key={category}
                        className={isTop ? classes2 : classes}
                      >
                        {category}
                      </Tab>
                    );
                  })}
                </Tab.List>
                <div className={`${isTop ? "hidden" : ""}`}>
                  {userData ? (
                    <AddCategory
                      userData={userData}
                      getItemList={getItemList}
                    />
                  ) : null}
                </div>
                <Tab.Panels>
                  <Tab.Panel
                    className={classNames(
                      "rounded-b-xl",
                      "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                    )}
                  >
                    <div className="flex">
                      <div className={`${isTop ? "mx-auto" : "w-1/2"}`}>
                        {userData && (
                          <>
                            <h2
                              className={`pt-4 pb-8 font-bold text-center ${
                                isTop ? "text-2xl" : "text-xl"
                              }`}
                            >
                              全て
                            </h2>
                            <div className="m-8" />
                          </>
                        )}
                      </div>
                      {isTop ? (
                        <div
                          className={`animate-slit-in-vertical text-base text-center py-3 mt-10 mb-3 px-4 min-w-4l table w-1/2 border-l`}
                        >
                          total:
                          <span className="block text-3xl font-bold">
                            ¥{totalPrice?.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`text-xl w-1/2 table text-center mt-4 py-3 px-4 font-semibold`}
                        >
                          total: ¥{totalPrice?.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <h2 className="p-4 text-4xl font-bold">History</h2>
                    <div className={`flex justify-end px-8`}>
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
                      <h2 className={`px-2 text-xl`}>{month}月</h2>
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
                    </div>
                    <ItemList
                      items={items}
                      userData={userData}
                      uuid={user.id}
                      getItemList={getItemList}
                    />
                  </Tab.Panel>
                </Tab.Panels>
                {categories.map((value) => {
                  const itemList = userData
                    ? items.filter((item) => {
                        return item.categoryID === value;
                      })
                    : null;
                  const categoryTotalPrice = itemList?.reduce(
                    (sum, element) => {
                      return sum + element.price;
                    },
                    0
                  );
                  return (
                    <Tab.Panels key={value}>
                      <Tab.Panel
                        className={classNames(
                          "rounded-b-xl",
                          "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                        )}
                      >
                        <div className="flex">
                          <div className={`${isTop ? "mx-auto" : "w-1/2"}`}>
                            {userData && (
                              <>
                                <h2
                                  className={`pt-4 pb-8 font-bold text-center  ${
                                    isTop ? "text-2xl" : "text-xl "
                                  }`}
                                >
                                  {value}
                                </h2>
                                {userData && (
                                  <EditCategory
                                    category={value}
                                    getItemList={getItemList}
                                    userData={userData}
                                  />
                                )}
                              </>
                            )}
                          </div>
                          {isTop ? (
                            <div
                              className={`animate-slit-in-vertical text-base text-center py-3 mt-10 mb-3 px-4 min-w-4l table w-1/2 border-l`}
                            >
                              total:
                              <span className="block text-3xl font-bold">
                                ¥{categoryTotalPrice?.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <div
                              className={`animate-slide-in-bck-center text-xl w-1/2 table text-center mt-4 py-3 px-4 font-semibold`}
                            >
                              total: ¥{categoryTotalPrice?.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <h2 className="px-4 mt-6 text-4xl font-bold">
                          History
                        </h2>
                        <div className={`flex justify-end px-8`}>
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
                          <h2 className={`px-2 text-xl`}>{month}月</h2>
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
                        </div>
                        <ItemList
                          items={itemList}
                          userData={userData}
                          uuid={user.id}
                          getItemList={getItemList}
                        />
                      </Tab.Panel>
                    </Tab.Panels>
                  );
                })}
              </div>
            </Tab.Group>
          </div>
        </div>
      </div>
      <div className="flex fixed bottom-0 z-50 justify-around py-2 w-full bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 rounded-t-xl">
        {/* <AddItem
            userData={userData}
            uuid={user.id}
            getItemList={getItemList}
          /> */}
        <Link href="/" passHref>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
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

export default Title;
