import { Tab } from "@headlessui/react";
import { Auth } from "@supabase/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AddItem } from "src/components/addItem";
import { ItemList } from "src/components/itemList";
import { TabList } from "src/components/tab";
import { sortData } from "src/hooks/sortData";
import type { Data } from "src/interface/type";
import type { UserData } from "src/interface/type";
import { client } from "src/libs/supabase";
// import throttle from "lodash.throttle";

type Props = {
  children: ReactNode;
};

const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;
const day = d.getDate();

const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

const getLastDate = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

// データベースからカテゴリーごとの商品の取得
const getCategoryItems = async (userID: string, categoryID: number) => {
  let { data, error } = await client
    .from("users")
    .select("*")
    .eq("userID", userID);

  if (!error && data) {
    const userData = data[0];
    ({ data, error } = await client
      .from("purchasedItem")
      .select("*")
      .eq("userID", userID)
      .eq("categoryID", userData.categoryList[categoryID]));

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

const count = getLastDate(year, month);

const colors = [
  "red",
  "blue",
  "green",
  "orange",
  "gray",
  "pink",
  "yellow",
  "lime",
];

// 全てのアイテムの取得
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

const Container = (props: Props) => {
  const { user } = Auth.useUser();

  const [text, setText] = useState<string>("");
  const [userData, setUserData] = useState<Data>();
  const [total, setTotal] = useState<number>();
  const [items, setItems] = useState<UserData[]>([]);
  const [oneDayTotal, setOneDayTotal] = useState<number>(0);
  const [m, setM] = useState<number>(month);

  const [categories, setCategories] = useState<string[]>([]);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  // const isHome = router === "/";
  const [isTop, setIsTop] = useState<boolean>(false);

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
  const handleOpenCategory = () => {
    setIsOpen(true);
  };

  const handleCloseCategory = () => {
    setIsOpen(false);
  };

  const router = useRouter();
  const { id } = router.query;

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
          setCategories(["全て", ...userData.categoryList]);
        } else {
          router.push("/");
        }
        if (items) {
          setItems(items);
          setTotal(totalPrice);
          const oneDayPrice = items.reduce((sum: number, element: any) => {
            if (element.buyDate[2] === day.toString()) {
              return sum + element.price;
            }
            return sum + 0;
          }, 0);
          setOneDayTotal(oneDayPrice);
        }
      }
    },
    [router, user]
  );

  useEffect(() => {
    getItemList(year, m);
  }, [user, getItemList, id, router, m]);

  useEffect(() => {
    moveScroll();
  }, []);

  const moveScroll = () => {
    const target = document.getElementById("sc");
    if (target === null) {
      setTimeout(() => {
        moveScroll();
      }, 100);
    }
    target ? (target.scrollLeft += 48 * day - 1) : null;
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

    setText("");
    getItemList(year, m);
  };

  //前の月へ
  const prevMonth = useCallback(() => {
    const count = m - 1;
    setM(count);
  }, [m]);

  //次の月へ
  const nextMonth = useCallback(() => {
    if (m === month) {
      return false;
    }
    const count = m + 1;
    setM(count);
  }, [m]);

  const data = sortData(items);

  const targetAverage = userData ? userData.targetAmount / count : null;
  const nowAverage = total ? total / d.getDate() : null;

  const test = [...Array(count)].map((_, i) => {
    return i + 1;
  });

  if (user) {
    return (
      <div className="min-h-lg text-white">
        <div className="pt-1 md:flex">
          <div className="fixed p-5 w-full h-lg md:w-1/2">
            <h2 className="mt-12 text-5xl text-center">TITLE</h2>
            <AddItem
              userData={userData}
              uuid={user.id}
              getItemList={getItemList}
            />
            {total ? (
              <div className="px-8 pt-2 pb-1 text-3xl text-center ">
                残り：¥
                {userData
                  ? (userData.targetAmount - total).toLocaleString()
                  : null}
              </div>
            ) : null}
            <div className="z-10 p-1 pb-2 my-4">
              <div className="flex flex-wrap justify-around">
                {userData
                  ? userData.categoryList.map((value, index) => {
                      return (
                        <Link
                          key={index}
                          href={`/category?id=${index}`}
                          passHref
                        >
                          <p
                            className="table px-1 m-1 w-24 text-sm text-center hover:text-blue-600 bg-gray-50 bg-opacity-20 rounded-lg cursor-pointer"
                            style={{ border: `solid 1px ${colors[index]}` }}
                          >
                            {value}
                          </p>
                        </Link>
                      );
                    })
                  : null}
              </div>
              {isOpen ? (
                <div className="flex justify-center px-4">
                  <input
                    className="px-4 h-12 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
                    placeholder="Filtering text"
                    value={text}
                    autoFocus
                    type="text"
                    onChange={(e) => {
                      return setText(e.target.value);
                    }}
                  />
                  <button
                    className="table p-1 mr-10 ml-auto bg-green-50 border border-gray-400 cursor-pointer"
                    onClick={() => {
                      return addCategory(text);
                    }}
                  >
                    カテゴリー追加
                  </button>
                  <button
                    onClick={handleCloseCategory}
                    className="table p-1 bg-green-100 cursor-pointer"
                  >
                    キャンセル
                  </button>
                </div>
              ) : null}
              {/* <button
                onClick={handleOpenCategory}
                className="block p-1 mx-10 ml-auto w-24 text-sm bg-green-100 border border-gray-400 cursor-pointer"
              >
                追加
              </button> */}
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
              <h2 className="p-2 text-2xl">{m}月</h2>
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
                <p className="">
                  今月の金額：¥{userData?.targetAmount.toLocaleString()}
                </p>
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
                {/* {categories.map((category) => { */}
                {test.map((category) => {
                  return (
                    // <TabList key={category} category={category} />
                    <Tab
                      key={category}
                      disabled={category > day}
                      className={({ selected }) => {
                        return classNames(
                          `min-w-lg py-2.5 text-lg font-semibold leading-5 rounded-lg ${
                            category > day ? "text-gray-400" : "text-blue-600"
                          }`,
                          // "focus:outline-none focus:ring-1 ring-offset-1 ring-offset-blue-400 ring-white ring-opacity-60",
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
                  {oneDayTotal.toLocaleString()}円
                </p>
                <p className="text-sm">
                  1日の平均金額：
                  {nowAverage ? Math.floor(nowAverage).toLocaleString() : null}
                  円
                </p>
              </div>
              {/* {categories.map((category) => { */}
              {test.map((category) => {
                // const item = data.filter((value) => {
                //   return value.categoryID === category;
                // });
                const item = data.filter((value) => {
                  return value.buyDate[2] === category.toString();
                });
                const totalItems = item.reduce((sum, element) => {
                  return sum + element.price;
                }, 0);
                return (
                  <Tab.Panels className="" key={category}>
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
                          ? total?.toLocaleString()
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
                            ? total?.toLocaleString()
                            : totalItems.toLocaleString()}
                        </span>
                      </div>
                      <ItemList
                        items={category.toString() === "全て" ? data : item}
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
