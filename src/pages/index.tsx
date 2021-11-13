/* eslint-disable react-hooks/exhaustive-deps */
import { Tab } from "@headlessui/react";
import { useEffect, useState } from "react";
import { AddItem } from "src/components/addItem";
import { ItemList } from "src/components/itemList";
import { LinkButtonList } from "src/components/LinkButtonList";
import { MenuBar } from "src/components/menuBar";
import { ChangeMonthButton } from "src/components/utils/changeMonthButton";
import { PriceDisplay } from "src/components/utils/PriceDisplay";
import { Title } from "src/components/utils/title";
import { useChangeMonth } from "src/hooks/useChangeMonth";
import { useGetItemList } from "src/hooks/useGetItemList";
import { useToggleModal } from "src/hooks/useToggleModal";
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
  const [isTop, setIsTop] = useState<boolean>(false);
  const { year, month, prevMonth, nextMonth } = useChangeMonth();
  const { isOpen, openModal, closeModal } = useToggleModal();
  const { userData, itemList, totalPrice, getItemList } = useGetItemList();

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

  useEffect(() => {
    if (user) {
      getItemList(user.id, year, month);
    }
  }, [getItemList,user,  year, month]);

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

  //本日の合計金額
  const oneDayTotalPrice = itemList.reduce(
    (sum: number, element: { buyDate: string[]; price: number }) => {
      if (element.buyDate[2] === date.toString()) {
        return sum + element.price;
      }
      return sum + 0;
    },
    0
  );

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

  const item = itemList.filter((value) => {
    return value.buyDate[2] === date.toString();
  });
  const totalItemsPrice = item.reduce((sum, element) => {
    return sum + element.price;
  }, 0);

  return userData ? (
    <div className="pt-1 min-h-lg text-white">
      <div className="fixed py-2 w-full h-lg">
        <h2 className="px-3 text-2xl">TITLE</h2>
        <div className="flex flex-col justify-end h-3lg">
          <div className="py-4 px-8">
            <Title />
          </div>
          <PriceDisplay
            totalPrice={totalPrice}
            targetAmount={userData.targetAmount}
            totalItemsPrice={totalItemsPrice}
          />
          <button
            onClick={openModal}
            className="flex justify-center py-1 px-2 my-3 mx-auto bg-flower bg-opacity-40 rounded-lg border cursor-pointer"
          >
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
                strokeWidth={1.0}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <p className="text-lg text-center">register</p>
            <AddItem
              isOpen={isOpen}
              closeModal={closeModal}
              userData={userData}
              getItemList={getItemList}
            />
          </button>
          <LinkButtonList />
        </div>
      </div>
      <div className="relative -z-10 h-lg opacity-0" />
      <div className="relative z-40 pt-8 w-full h-screen bg-home rounded-t-3xl animate-slide-in-bottom md:p-5 md:w-1/2">
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
            className="flex overflow-x-scroll flex-nowrap p-3 mx-auto space-x-2 w-11/12 border-b"
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
            } animate-slide-in-bck-center ml-auto mt-5 w-1/2 pr-4`}
          >
            <p className="text-sm">今日の金額：</p>
            <p className="mb-2 text-right">
              ¥ {month === m ? oneDayTotalPrice.toLocaleString() : null}
            </p>
            <p className="text-sm">1日の平均金額：</p>
            <p className="text-right ">
              ¥ {Math.floor(nowAverage).toLocaleString()}
            </p>
          </div>
          {thisMonthDays.map((category) => {
            const item = itemList.filter((value) => {
              return value.buyDate[2] === category.toString();
            });
            const totalItemsPrice = item.reduce((sum, element) => {
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
                    <div className="table p-3 mx-2 -mt-12 mb-3 w-5/12 text-base border-r animate-slit-in-vertical">
                      total:
                      <span className="block text-3xl font-bold text-center">
                        ¥
                        {category.toString() === "全て"
                          ? totalPrice.toLocaleString()
                          : totalItemsPrice.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="py-3 px-4 mx-4 text-xl font-semibold animate-slide-in-bck-center">
                      total: ¥
                      {category.toString() === "全て"
                        ? totalPrice.toLocaleString()
                        : totalItemsPrice.toLocaleString()}
                    </div>
                  )}
                  <ItemList
                    items={category.toString() === "全て" ? itemList : item}
                    userData={userData}
                    getItemList={getItemList}
                  />
                </Tab.Panel>
              </Tab.Panels>
            );
          })}
          {isTop ? <MenuBar /> : null}
        </Tab.Group>
      </div>
    </div>
  ) : null;
};

Home.getLayout = HomeLayout;

export default Home;
