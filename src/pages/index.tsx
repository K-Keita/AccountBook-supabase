/* eslint-disable react-hooks/exhaustive-deps */
import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { AddItem } from "src/components/addItem";
import { ItemList } from "src/components/itemList";
import { ChangeMonthButton } from "src/components/utils/changeMonthButton";
import { LinkButton } from "src/components/utils/linkButton";
import { getItems } from "src/hooks/getData";
import { sortData } from "src/hooks/sortData";
import { useChangeMonth } from "src/hooks/useChangeMonth";
import { useToggleModal } from "src/hooks/useToggleModal";
import type { ItemData, UserData } from "src/interface/type";
import { HomeLayout } from "src/layouts/homeLayout";
import { client } from "src/libs/supabase";

const week = ["日", "月", "火", "水", "木", "金", "土"];

const d = new Date();
const m = d.getMonth() + 1;
const date = d.getDate();

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

const Home = () => {
  const user = client.auth.user();
  const router = useRouter();

  const [isTop, setIsTop] = useState<boolean>(false);
  const [userData, setItemData] = useState<UserData>();
  const [items, setItems] = useState<ItemData[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [oneDayTotalPrice, setOneDayTotalPrice] = useState<number>(0);

  const { year, month, prevMonth, nextMonth } = useChangeMonth();
  const { isOpen, openModal, closeModal } = useToggleModal();

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
          setItemData(userData);
        } else {
          router.push("/login");
        }
        if (items) {
          setItems(sortData(items));
          setTotalPrice(totalPrice);

          if (month === m) {
            const oneDayPrice = items.reduce(
              (sum: number, element: { buyDate: string[]; price: number }) => {
                if (element.buyDate[2] === date.toString()) {
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
    if (date < 5) {
      return;
    }
    if (target === null) {
      setTimeout(() => {
        moveScroll();
      }, 100);
    }
    target ? (target.scrollLeft += 48 * date - 1) : null;
  };

  //月の日数
  const count = new Date(year, month, 0).getDate();

  //月の日数の配列
  const thisMonthDays = [...Array(count)].map((_, i) => {
    return i + 1;
  });

  //月の初日の曜日
  const thisMonthFirstDays = new Date(year, month - 1, 1).getDay();

  //1日の平均金額(今月)
  const targetAverage = userData ? userData.targetAmount / count : null;

  //1日の平均金額(現在)
  const nowAverage = totalPrice / d.getDate();

  return userData ? (
    <div className="pt-1 min-h-lg text-white">
      <div className="fixed py-5 mt-2 w-full h-lg">
        <h2 className="px-2 text-3xl">TITLE</h2>
        <div className="flex justify-around my-8">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={openModal}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.3}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <p className="text-center">register</p>
            <AddItem
              isOpen={isOpen}
              closeModal={closeModal}
              userData={userData}
              getItemList={getItemList}
            />
          </div>
          <div className="py-8 border" />

          <LinkButton
            href="/chart"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto w-8 h-8"
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
            }
            text="Chart"
          />
        </div>
        <h2 className="mt-12 text-5xl text-center">TITLE</h2>
        <div className="py-1">
          <h3 className="text-3xl tracking-wide text-center">
            ¥ {totalPrice.toLocaleString()}
          </h3>
          <p className="text-xs text-center">
            残り：¥
            {(userData.targetAmount - totalPrice).toLocaleString()}
          </p>
        </div>
        <div className="flex justify-around mt-12">
          <LinkButton
            href="/category"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto w-8 h-8"
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
            }
            text={"Category"}
          />
          <div className="py-8 border" />
          <LinkButton
            href="/setting"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto w-9 h-9"
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
            }
            text="Setting"
          />
        </div>
      </div>
      <div className="relative -z-10 h-lg opacity-0" />
      <div className="relative z-40 pt-10 w-full h-screen bg-home rounded-t-3xl animate-slide-in-bottom md:p-5 md:w-1/2">
        <div className="flex px-4">
          <ChangeMonthButton
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            month={month}
          />
          <div className="mx-4 ml-auto text-sm border-white">
            <p>
              使用金額(月)：
              <span className="text-base">
                ¥{userData?.targetAmount.toLocaleString()}
              </span>
            </p>
            <p className="text-center">
              (平均金額：
              {targetAverage
                ? Math.floor(targetAverage).toLocaleString()
                : null}
              )
            </p>
          </div>
        </div>
        <Tab.Group defaultIndex={date - 1}>
          <Tab.List
            id="sc"
            className="flex overflow-x-scroll flex-nowrap py-3 px-4 mx-auto mt-3 space-x-2 w-11/12 border-b"
          >
            {thisMonthDays.map((value, index) => {
              const isSelectDate = value > date && month === m;
              const day = week[(index + thisMonthFirstDays) % 7];
              return (
                <Tab
                  key={value}
                  disabled={isSelectDate}
                  className={({ selected }) => {
                    return classNames(
                      `min-w-lg py-2.5 text-lg font-semibold leading-5 rounded-lg ${
                        isSelectDate ? "text-gray-400" : "text-pink-600"
                      }`,
                      "focus:outline-none focus:ring-1 ring-opacity-60",
                      selected
                        ? "shadow bg-selected bg-opacity-50"
                        : `${
                            isSelectDate
                              ? ""
                              : "text-pink-100 hover:bg-white/[0.12] hover:text-white"
                          }`
                    );
                  }}
                >
                  <p className={`text-xs ${isSelectDate ? "" : "text-white"} `}>
                    {day}
                  </p>
                  <p className="text-lg">{value}</p>
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
              {Math.floor(nowAverage).toLocaleString()}円
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
                    "rounded-b-xl",
                    "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
                  )}
                >
                  {isTop ? (
                    <div className="table py-3 px-4 mx-4 mb-3 text-base border-r animate-slit-in-vertical">
                      total:
                      <span className="block text-3xl font-bold">
                        ¥
                        {category.toString() === "全て"
                          ? totalPrice.toLocaleString()
                          : totalItems.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="py-3 px-4 mx-4 text-xl font-semibold animate-slide-in-bck-center">
                      total: ¥
                      {category.toString() === "全て"
                        ? totalPrice.toLocaleString()
                        : totalItems.toLocaleString()}
                    </div>
                  )}
                  <ItemList
                    items={category.toString() === "全て" ? items : item}
                    userData={userData}
                    getItemList={getItemList}
                  />
                </Tab.Panel>
              </Tab.Panels>
            );
          })}
        </Tab.Group>
      </div>
    </div>
  ) : null;
};

// Home.getLayout = HomeLayout;
Home.getLayout = HomeLayout;

export default Home;
