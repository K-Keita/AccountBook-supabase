import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AddCategory } from "src/components/addCategory";
import { EditCategory } from "src/components/editCategory";
import { ItemList } from "src/components/itemList";
import { ChangeMonthButton } from "src/components/utils/changeMonthButton";
// import { getAllItem } from "src/hooks/getData";
// import { sortData } from "src/hooks/sortData";
import { useChangeMonth } from "src/hooks/useChangeMonth";
import { useGetItemList } from "src/hooks/useGetItemList";
// import type { ItemData, UserData } from "src/interface/type";
import { SecondLayout } from "src/layouts/secondLayout";
// import { client } from "src/libs/supabase";
import { colors } from "src/utils";

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

const Category = () => {
  // const user = client.auth.user();
  const router = useRouter();

  const { year, month, prevMonth, nextMonth } = useChangeMonth();
    const { userData, itemList, totalPrice, getItemList } = useGetItemList();

  const [isTop, setIsTop] = useState<boolean>(false);
  // const [itemList, setItemList] = useState<ItemData[]>([]);
  // const [userData, setItemData] = useState<UserData>();
  // const [totalPrice, setTotalPrice] = useState<number>();
  // const [categoryList, setCategoryList] = useState<string[]>([]);

  //IDと同じカテゴリーの商品を取得
  // const getItemList = useCallback(
  //   async (year, month) => {
  //     if (user) {
  //       const { userData, itemList, totalPrice } = await getAllItem(
  //         user.id.toString(),
  //         year,
  //         month
  //       );
  //       if (userData) {
  //         setItemData(userData);
  //         // setCategoryList(userData.categoryList);
  //       } else {
  //         router.push("/logIn");
  //       }
  //       if (itemList) {
  //         setItemList(sortData(itemList));
  //         setTotalPrice(totalPrice);
  //       }
  //     }
  //   },
  //   [router, user]
  // );

  useEffect(() => {
    getItemList(year, month);
  }, [getItemList, router, month, year]);

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

  return userData ? (
    <>
      <h2 className="py-3 px-4 text-4xl font-bold">Category</h2>
      <Tab.Group>
        <div className="pb-16 h-screen">
          {isTop ? (
            <h2 className="p-4 mt-10 text-4xl font-bold">History</h2>
          ) : null}
          <Tab.List
            className={`${
              isTop ? "overflow-x-scroll py-1" : "flex-wrap justify-around py-3"
            } flex px-2`}
          >
            <Tab
              className={isTop ? classes2 : classes}
              style={{ border: "solid 1px #fff" }}
            >
              全て
            </Tab>
            {userData.categoryList.map((category, index) => {
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
          {isTop ? null : (
            <AddCategory userData={userData} getItemList={getItemList} />
          )}
          {["全て", ...userData.categoryList].map((value, index) => {
            const categoryItemList = itemList.filter((item) => {
              return item.categoryID === value;
            });
            const categoryTotalPrice = categoryItemList?.reduce((sum, element) => {
              return sum + element.price;
            }, 0);
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
                      <h2 className={"py-4 text-xl font-bold text-center"}>
                        {value}
                      </h2>
                    ) : (
                      <div className="w-1/2">
                        <h2
                          className={"pt-4 pb-8 text-xl font-bold text-center"}
                        >
                          {value}
                        </h2>
                        {value !== "全て" ? (
                          <EditCategory
                            category={value}
                            getItemList={getItemList}
                            userData={userData}
                          />
                        ) : null}
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
                  <div className="px-8">
                    <ChangeMonthButton
                      prevMonth={prevMonth}
                      nextMonth={nextMonth}
                      month={month}
                    />
                  </div>
                  <ItemList
                    items={index === 0 ? itemList : itemList}
                    userData={userData}
                    getItemList={getItemList}
                  />
                </Tab.Panel>
              </Tab.Panels>
            );
          })}
        </div>
      </Tab.Group>
    </>
  ) : null;
};

Category.getLayout = SecondLayout;

export default Category;
