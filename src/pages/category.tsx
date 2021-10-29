import { Tab } from "@headlessui/react";
import { Auth } from "@supabase/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { useCallback, useEffect, useState } from "react";
import { EditCategory } from "src/components/editCategory";
import { AddCategory } from "src/components/addCategory";
import { Graph } from "src/components/Graph";
import { ItemList } from "src/components/itemList";
import { sortData } from "src/hooks/sortData";
import type { Data as TitleType } from "src/interface/type";
import type { UserData } from "src/interface/type";
import { client } from "src/libs/supabase";

const d = new Date();
const y = d.getFullYear();
const m = d.getMonth() + 1;
// const day = d.getDate();

const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

// const count = new Date(y, m, 0).getDate();

// const colors = [
//   "red",
//   "blue",
//   "green",
//   "orange",
//   "gray",
//   "pink",
//   "yellow",
//   "lime",
// ];

// データベースからカテゴリーごとの商品の取得
// const getCategoryItems = async (userID: string, categoryID: number) => {
//   let { data, error } = await client
//     .from("users")
//     .select("*")
//     .eq("userID", userID);

//   if (!error && data) {
//     const userData = data[0];
//     ({ data, error } = await client
//       .from("purchasedItem")
//       .select("*")
//       .eq("userID", userID)
//       .eq("categoryID", userData.categoryList[categoryID]));

//     const newData = data?.reduce((sum, element) => {
//       return sum + element.price;
//     }, 0);

//     if (!error && data) {
//       return { userData: userData, items: data, totalPrice: newData };
//     } else {
//       return { userData: userData, items: null, totalPrice: null };
//     }
//   }
//   return { userData: null, items: null, totalPrice: null };
// };

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
  const { user } = Auth.useUser();

  const [items, setItems] = useState<UserData[]>([]);
  const [userData, setUserData] = useState<TitleType>();
  const [totalPrice, setTotalPrice] = useState<number>();
  const [categories, setCategories] = useState<string[]>([]);

  const [categoryName, setCategoryName] = useState<string>("");
  const [year, setYear] = useState<number>(y);
  const [month, setMonth] = useState<number>(m);

  const [num, setNum] = useState<number>(0);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isTop, setIsTop] = useState<boolean>(false);

  const router = useRouter();
  const { id } = router.query;

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
          setCategories(["全て", ...userData.categoryList]);
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
      if (window.scrollY > 200) {
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

  const handleOpenCategory = () => {
    setIsOpen(true);
  };

  const handleCloseCategory = () => {
    setIsOpen(false);
  };

  //カテゴリーの追加
  const addCategory = async (text: string) => {
    if (text === "") {
      return false;
    }

    if (userData) {
      const arr = userData.categoryList;
      if (arr.indexOf(text) !== -1) {
        alert("すでに同じカテゴリー名があります");
        return false;
      }
      const newArr = [...arr, text];

      const { error } = await client.from("users").upsert({
        id: userData.id,
        userID: userData.userID,
        categoryList: newArr,
      });

      if (error) {
        alert(error);
      }
    }

    setCategoryName("");
    setIsOpen(false);
    getItemList(year, month);
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

  const itemList = userData
    ? items.filter((value) => {
        return value.categoryID === userData.categoryList[num - 1];
      })
    : null;

  const categoryTotalPrice = itemList?.reduce((sum, element) => {
    return sum + element.price;
  }, 0);

  //カテゴリーごとの合計金額
  const priceArr = userData?.categoryList.map((category) => {
    const arr = items.filter((value) => {
      return value.categoryID === category;
    });
    const totalPrice = arr.reduce((sum, element) => {
      return sum + element.price;
    }, 0);
    return totalPrice;
  });

  const graph = {
    // x 軸のラベル
    labels: userData?.categoryList,
    datasets: [
      {
        responsive: true,
        label: "Category",
        ticks: {
          beginAtZero: true,
          fontColor: "white",
        },
        // データの値
        data: priceArr,
        // グラフの背景色
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        // グラフの枠線の色
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        // グラフの枠線の太さ
        borderWidth: 1,
      },
    ],
  };

  return user ? (
    <div className="min-h-lg text-white">
      <div className="md:flex">
        <div className="relative z-40 pt-7 w-full bg-gradient-to-b from-dark via-green-200 to-blue-500 rounded-t-3xl md:p-5 md:w-1/2">
          <div className="flex justify-between pb-3">
            <Link href="/" passHref>
              <button className="px-4 text-2xl">-Title-</button>
            </Link>
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
          </div>
          <Tab.Group
            defaultIndex={num}
            onChange={(index) => {
              setNum(index);
            }}
          >
            <Tab.List className="flex flex-wrap justify-around py-3 px-2 mt-3">
              {categories.map((category) => {
                return (
                  <Tab
                    key={category}
                    className={({ selected }) => {
                      return classNames(
                        " py-2 min-w-xl text-xl leading-5 font-medium rounded-lg",
                        "focus:outline-none focus:ring-1 ring-offset-1 ring-offset-blue-400 ring-green-400",
                        selected
                          ? "shadow bg-opacity-50 text-white"
                          : "text-gray-200 text-sm min-w-lg hover:bg-white/[0.12]  hover:text-white"
                      );
                    }}
                  >
                    {category}
                  </Tab>
                );
              })}
            </Tab.List>
            <AddCategory userData={userData} getItemList={getItemList} />
            {categories.map((value) => {
              return (
                <Tab.Panels key={value}>
                  <Tab.Panel
                    className={classNames(
                      "rounded-b-xl min-h-lg",
                      "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                    )}
                  >
                    <div className="flex">
                      <div
                        className={`${
                          isTop ? "block" : "hidden"
                        } animate-slit-in-vertical text-base text-center py-3 mt-16 mb-3 px-4 min-w-4l table border-r`}
                      >
                        total:
                        <span className="block text-3xl font-bold">
                          ¥
                          {value === "全て"
                            ? totalPrice?.toLocaleString()
                            : categoryTotalPrice?.toLocaleString()}
                        </span>
                      </div>
                      <div className={`${isTop ? "mx-auto" : "w-1/2"}`}>
                        {userData && (
                          <>
                            <h2
                              className={`pt-4 pb-8 font-bold text-center ${
                                isTop ? "text-3xl" : "text-xl"
                              }`}
                            >
                              {num === 0
                                ? "全て"
                                : userData.categoryList[num - 1]}
                            </h2>
                            {userData &&
                              (id ? (
                                <EditCategory
                                  categoryList={userData.categoryList}
                                  num={num - 1}
                                  category={value}
                                  getItemList={getItemList}
                                  userData={userData}
                                />
                              ) : null)}
                          </>
                        )}
                      </div>
                      <div
                        className={`text-xl mt-4 py-3 px-4 font-semibold ${
                          isTop ? "hidden" : "block animate-slide-in-bck-center"
                        }`}
                      >
                        total: ¥
                        {value === "全て"
                          ? totalPrice?.toLocaleString()
                          : categoryTotalPrice?.toLocaleString()}
                      </div>
                    </div>
                    <div className="px-3 my-8">
                      {userData ? <Graph data={graph} /> : null}
                    </div>
                    <h2 className="p-4 text-4xl font-bold">History</h2>
                    <ItemList
                      items={value === "全て" && itemList ? items : itemList}
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
    </div>
  ) : null;
};

export default Title;
