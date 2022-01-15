import { Tab } from "@headlessui/react";
import { useEffect, useState } from "react";
import { ItemList } from "src/components/itemList";
import type { ItemData, UserData } from "src/interface/type";
import { colors } from "src/utils";

type Props = {
  userData: UserData;
  itemList: ItemData[];
  totalPrice: number;
  getItemList: (id: string, year: number, month: number) => Promise<void>;
  changeMonthButton: JSX.Element;
};

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

const classes = ({ selected }: any) => {
  return classNames(
    `py-1 my-1 leading-5 font-medium rounded-lg mx-1 min-w-2lg`,
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

export const HistoryContainer = (props: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isTop, setIsTop] = useState<boolean>(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
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

  return (
    <section className="border-white sm:pt-16">
      <Tab.Group defaultIndex={0}>
        <div className="pb-16 h-screen">
          <h2 className={`p-4 text-4xl font-bold ${isTop ? "sm:pt-20" : ""}`}>History</h2>
          <Tab.List
            className={`${
              isTop
                ? "overflow-x-scroll py-1 flex"
                : "flex-wrap justify-around "
            } px-2`}
          >
            {isTop ? (
              ["全て", ...props.userData.categoryList].map(
                (category, index) => {
                  return (
                    <Tab
                      key={category}
                      className={isTop ? classes : classes2}
                      style={
                        index === 0
                          ? { border: "solid 1px #fff" }
                          : { border: `solid 1px ${colors[index - 1]}` }
                      }
                    >
                      {category}
                    </Tab>
                  );
                }
              )
            ) : (
              <Tab className="hidden"></Tab>
            )}
          </Tab.List>
          {["全て", ...props.userData.categoryList].map((value, index) => {
            const categoryItemList = props.itemList.filter((item) => {
              return item.categoryID === value;
            });
            const categoryTotalPrice = categoryItemList?.reduce(
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
                  <div className="flex justify-between">
                    {isTop ? (
                      <div
                        className={`animate-slide-in-bck-center text-lg py-2 my-2 px-6 font-semibold border-r w-1/2`}
                      >
                        <p>{value}</p>
                        <p>
                          total:¥
                          {index === 0
                            ? props.totalPrice?.toLocaleString()
                            : categoryTotalPrice?.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div className="w-1/2"></div>
                    )}
                    <div className="my-auto mx-auto">
                      {props.changeMonthButton}
                    </div>
                  </div>
                  <ItemList
                    items={index === 0 ? props.itemList : categoryItemList}
                    userData={props.userData}
                    getItemList={props.getItemList}
                  />
                </Tab.Panel>
              </Tab.Panels>
            );
          })}
        </div>
      </Tab.Group>
    </section>
  );
};
