import { Tab } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { useCallback, useEffect, useState } from "react";
import { AddCategory } from "src/components/addCategory";
import { EditCategory } from "src/components/editCategory";
import { ItemList } from "src/components/itemList";
import { MenuBar } from "src/components/menuBar";
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
    `py-1 my-1 leading-5 font-medium rounded-lg min-w-3l`,
    selected
      ? "shadow bg-blue-500/[0.4] text-white"
      : "text-gray-200 text-sm hover:bg-white/[0.12] hover:text-white"
  );
};

const classes2 = ({ selected }: any) => {
  return classNames(
    `leading-5 font-medium rounded-lg p-1 mx-1 my-1 min-w-2lg`,
    "focus:outline-none focus:ring-1 ring-offset-1 ring-offset-blue-400 ring-green-400",
    selected
      ? "shadow text-white"
      : "text-gray-200 text-sm hover:bg-white/[0.12] hover:text-white"
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

// const colors = [
//   "rgb(255, 99, 132)",
//   "rgb(255, 159, 64)",
//   "rgb(255, 205, 86)",
//   "rgb(75, 192, 192)",
//   "rgb(54, 162, 235)",
//   "rgb(153, 102, 255)",
//   "rgb(201, 203, 207)",
// ];

const colors = [
  "rgba(255, 99, 132, 0.5)",
  "rgba(255, 159, 64, 0.5)",
  "rgba(255, 205, 86, 0.5)",
  "rgba(75, 192, 192, 0.5)",
  "rgba(54, 162, 235, 0.5)",
  "rgba(153, 102, 255, 0.5)",
  "rgba(201, 203, 207, 0.5)",
];

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
          <div className="relative -z-10 h-1 bg-blue-400" />
          <div className="relative z-40 w-full min-h-screen text-white bg-home rounded-t-3xl animate-slide-in-bottom md:p-5 md:w-1/2">
            <Link href="/" passHref>
              <button className="p-6 text-2xl">-Title-</button>
            </Link>
            <h2 className="py-3 px-4 text-4xl font-bold">Category</h2>
            <Tab.Group>
              <div className="pb-16 min-h-screen">
                {isTop ? (
                  <h2 className="p-4 mt-10 text-4xl font-bold">History</h2>
                ) : null}
                <Tab.List
                  className={`${
                    isTop
                      ? "overflow-x-scroll py-1"
                      : "flex-wrap justify-around py-3"
                  } flex px-2`}
                >
                  <Tab
                    className={isTop ? classes2 : classes}
                    style={{ border: "solid 1px #fff" }}
                  >
                    全て
                  </Tab>
                  {categories.map((category, index) => {
                    return (
                      <Tab
                        key={category}
                        className={isTop ? classes2 : classes}
                        style={{ border: `solid 1px ${colors[index]}` }}
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
                {["全て", ...categories].map((value, index) => {
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
                        <div className="flex justify-around">
                          {isTop ? (
                            <h2
                              className={"py-4 text-xl font-bold text-center"}
                            >
                              {value}
                            </h2>
                          ) : (
                            <div className="w-1/2">
                              {userData && (
                                <>
                                  <h2
                                    className={
                                      "pt-4 pb-8 text-xl font-bold text-center"
                                    }
                                  >
                                    {value}
                                  </h2>
                                  <EditCategory
                                    category={value}
                                    getItemList={getItemList}
                                    userData={userData}
                                  />
                                </>
                              )}
                            </div>
                          )}
                          {isTop ? (
                            <div
                              className={`animate-slide-in-bck-center text-lg p-4 font-semibold`}
                            >
                              total:¥
                              {index === 0
                                ? totalPrice?.toLocaleString()
                                : categoryTotalPrice?.toLocaleString()}
                            </div>
                          ) : (
                            <div
                              className={`animate-slit-in-vertical text-base text-center py-3 mt-10 mb-3 px-4 min-w-4l table w-1/2 border-l`}
                            >
                              total:
                              <span className="block text-3xl font-bold">
                                ¥
                                {index === 0
                                  ? totalPrice?.toLocaleString()
                                  : categoryTotalPrice?.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                        {isTop ? null : (
                          <h2 className="p-4 text-4xl font-bold">History</h2>
                        )}
                        <div className={`flex px-8`}>
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
                          items={index === 0 ? items : itemList}
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
      <MenuBar />
    </>
  ) : null;
};

export default Title;
