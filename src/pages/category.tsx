import { Tab } from "@headlessui/react";
import { useEffect, useState } from "react";
import { ItemList } from "src/components/itemList";
import { CategoryContainer } from "src/components/sectionContainer/CategoryContaiiner";
import { PcMenuContainer } from "src/components/sectionContainer/pcMenuContainer";
import { ChangeMonthButton } from "src/components/utils/changeMonthButton";
import { useChangeMonth } from "src/hooks/useChangeMonth";
import { useGetItemList } from "src/hooks/useGetItemList";
import { SecondLayout } from "src/layouts/secondLayout";
import { client } from "src/libs/supabase";
import { colors } from "src/utils";


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

const Category = () => {
  const user = client.auth.user();
  const [isTop, setIsTop] = useState<boolean>(false);
  const { year, month, prevMonth, nextMonth } = useChangeMonth();
  const { userData, itemList, totalPrice, getItemList } = useGetItemList();

  useEffect(() => {
    if (user) {
      getItemList(user.id, year, month);
    }
  }, [getItemList, user, month, year]);

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

  return userData ? (
    <div className="sm:flex">
      <PcMenuContainer
        totalPrice={totalPrice}
        targetAmount={userData.targetAmount}
        itemList={itemList}
      />
      <CategoryContainer userData={userData} getItemList={getItemList}/>
      <section className="border-white sm:w-1/3 sm:h-screen sm:border-l">
        <Tab.Group defaultIndex={0}>
          <div className="pb-16 h-screen">
            <h2 className="p-4 text-4xl font-bold">History</h2>
            <Tab.List
              className={`${
                isTop
                  ? "overflow-x-scroll py-1 flex"
                  : "flex-wrap justify-around "
              } px-2`}
            >
              {isTop ? (
                ["全て", ...userData.categoryList].map((category, index) => {
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
                })
              ) : (
                <Tab className="hidden"></Tab>
              )}
            </Tab.List>
            {["全て", ...userData.categoryList].map((value, index) => {
              const categoryItemList = itemList.filter((item) => {
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
                              ? totalPrice?.toLocaleString()
                              : categoryTotalPrice?.toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <div className="w-1/2"></div>
                      )}
                      <div className="my-auto mx-auto">
                        <ChangeMonthButton
                          prevMonth={prevMonth}
                          nextMonth={nextMonth}
                          month={month}
                        />
                      </div>
                    </div>
                    <ItemList
                      items={index === 0 ? itemList : categoryItemList}
                      userData={userData}
                      getItemList={getItemList}
                    />
                  </Tab.Panel>
                </Tab.Panels>
              );
            })}
          </div>
        </Tab.Group>
      </section>
    </div>
  ) : null;
};

Category.getLayout = SecondLayout;

export default Category;
