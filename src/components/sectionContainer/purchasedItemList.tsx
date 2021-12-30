/* eslint-disable react-hooks/exhaustive-deps */
import { Tab } from "@headlessui/react";
import { useEffect, useState } from "react";
import { ItemList } from "src/components/itemList";
import { MenuBar } from "src/components/menuBar";
import type { ItemData, UserData } from "src/interface/type";

type Props = {
  changeMonthButton: JSX.Element;
  year: number;
  month: number;
  userData: UserData;
  itemList: ItemData[];
  totalPrice: number;
  getItemList: (id: string, year: number, month: number) => Promise<void>;
};

const week = ["日", "月", "火", "水", "木", "金", "土"];

const d = new Date();
const m = d.getMonth() + 1;
const date = d.getDate();

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const PurchasedItemList = (props: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
  const oneDayTotalPrice = props.itemList.reduce(
    (sum: number, element: { buyDate: string[]; price: number }) => {
      if (element.buyDate[2] === date.toString()) {
        return sum + element.price;
      }
      return sum + 0;
    },
    0
  );

  //月の日数
  const count = new Date(props.year, props.month, 0).getDate();

  //月の日数の配列
  const thisMonthDays = [...Array(count)].map((_, i) => {
    return i + 1;
  });

  //月の初日の曜日
  const thisMonthFirstDays = new Date(props.year, props.month - 1, 1).getDay();

  //1日の平均金額(今月)
  const targetAverage = props.userData
    ? props.userData.targetAmount / count
    : null;

  //1日の平均金額(現在)
  const nowAverage = props.totalPrice / d.getDate();

  return (
    <section className="relative z-40 pt-8 w-full h-screen bg-home rounded-t-3xl animate-slide-in-bottom sm:px-2">
      <div className="flex px-4">
        {props.changeMonthButton}
        <div className="mx-4 ml-auto text-sm border-white">
          <p>
            使用金額(月)：
            <span className="text-base">
              ¥{props.userData?.targetAmount.toLocaleString()}
            </span>
          </p>
          <p className="text-center">
            (平均金額：
            {targetAverage ? Math.floor(targetAverage).toLocaleString() : null})
          </p>
        </div>
      </div>
      <Tab.Group defaultIndex={date - 1}>
        <Tab.List
          id="sc"
          className="flex overflow-x-scroll flex-nowrap p-3 mx-auto space-x-2 w-11/12 border-b"
        >
          {thisMonthDays.map((value, index) => {
            const isSelectDate = value > date && props.month === m;
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
            ¥ {props.month === m ? oneDayTotalPrice.toLocaleString() : null}
          </p>
          <p className="text-sm">1日の平均金額：</p>
          <p className="text-right ">
            ¥ {Math.floor(nowAverage).toLocaleString()}
          </p>
        </div>
        {thisMonthDays.map((category) => {
          const item = props.itemList.filter((value) => {
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
                  <div className="table p-3 mx-2 -mt-16 mb-3 w-5/12 text-base border-r animate-slit-in-vertical">
                    total:
                    <span className="block text-3xl font-bold text-center">
                      ¥
                      {category.toString() === "全て"
                        ? props.totalPrice.toLocaleString()
                        : totalItemsPrice.toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <div className="py-3 px-4 mx-4 text-xl font-semibold animate-slide-in-bck-center">
                    total: ¥
                    {category.toString() === "全て"
                      ? props.totalPrice.toLocaleString()
                      : totalItemsPrice.toLocaleString()}
                  </div>
                )}
                <ItemList
                  items={category.toString() === "全て" ? props.itemList : item}
                  userData={props.userData}
                  getItemList={props.getItemList}
                />
              </Tab.Panel>
            </Tab.Panels>
          );
        })}
        {isTop ? <MenuBar page="/" /> : null}
      </Tab.Group>
    </section>
  );
};
