/* eslint-disable react-hooks/exhaustive-deps */
import { Tab } from "@headlessui/react";
import { useEffect, useState, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddCategory } from "src/components/addCategory";
import { AddItem } from "src/components/addItem";
import { EditCategory } from "src/components/editCategory";
import { Graph } from "src/components/Graph";
import { ItemList } from "src/components/itemList";
import { LinkButtonList } from "src/components/LinkButtonList";
import { MenuBar } from "src/components/menuBar";
import { ChangeMonthButton } from "src/components/utils/changeMonthButton";
import { DatePicker } from "src/components/utils/datePicker";
import { PriceDisplay } from "src/components/utils/PriceDisplay";
import { PrimaryButton } from "src/components/utils/primaryButton";
import { HeaderTitle, Title } from "src/components/utils/title";
import { useChangeMonth } from "src/hooks/useChangeMonth";
import { useGetItemList } from "src/hooks/useGetItemList";
import { useToggleModal } from "src/hooks/useToggleModal";
import { HomeLayout } from "src/layouts/homeLayout";
import { client } from "src/libs/supabase";
import { colors } from "src/utils";

const week = ["日", "月", "火", "水", "木", "金", "土"];

const d = new Date();
const m = d.getMonth() + 1;
const date = d.getDate();
const day = d.getDate();
const hours = d.getHours();

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

type FormValues = {
  price: number;
  memo: string;
  category: string;
  dateTime: string;
};

const PcPage = () => {
  const user = client.auth.user();
  const [isTop, setIsTop] = useState<boolean>(false);
  const { year, month, prevMonth, nextMonth } = useChangeMonth();
  const { isOpen, openModal, closeModal } = useToggleModal();
  const { userData, itemList, totalPrice, getItemList } = useGetItemList();

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  //商品の追加
  const addItem = useCallback(async (price, memo, category, dateTime) => {
    if (userData) {
      if (price === "") {
        alert("Priceが空です");
        return;
      }

      if (category === "") {
        alert("カテゴリーを選択してください");
        return;
      }

      const buyDate = dateTime
        ? [
            dateTime.getFullYear().toString(),
            (dateTime.getMonth() + 1).toString(),
            dateTime.getDate().toString(),
            hours.toString(),
          ]
        : [year.toString(), month.toString(), day.toString(), hours.toString()];

      const date = dateTime
        ? [
            `year:${dateTime.getFullYear()}`,
            `month:${dateTime.getMonth() + 1}`,
            `day:${dateTime.getDate()}`,
          ]
        : [
            `year:${year.toString()}`,
            `month:${month.toString()}`,
            `day:${day.toString()}`,
          ];

      const { data, error } = await client.from("purchasedItem").insert([
        {
          userID: userData.userID,
          categoryID: category,
          price: price,
          description: memo,
          buyDate: buyDate,
          date: date,
        },
      ]);

      if (error) {
        alert(error);
      } else {
        if (data) {
          getItemList
            ? getItemList(userData.userID.toString(), year, month)
            : null;
          closeModal();
        }
      }
    }
  }, []);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addItem(data.price, data.memo, data.category, data.dateTime);
    reset();
  };

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
  }, [getItemList, user, year, month]);

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

  const priceArr = userData?.categoryList.map((category) => {
    const arr = itemList.filter((value) => {
      return value.categoryID === category;
    });
    const totalPrice = arr.reduce((sum, element) => {
      return sum + element.price;
    }, 0);
    return totalPrice;
  });

  return userData ? (
    <>
      <div className="w-60 p-4">
        <HeaderTitle />
      </div>
      <main className="pt-1 min-h-lg text-white sm:flex">
        <div>
          <div className="flex">
            <section className="py-2 w-96 px-8">
              <div
                style={{ fontFamily: "游明朝体" }}
                className="inline-block overflow-hidden px-6 py-3 w-full text-left align-middle rounded-xl border border-gray-300 shadow-xl transition-all transform"
              >
                <h3 className="text-2xl font-semibold leading-6 text-white">
                  商品追加
                </h3>
                <form
                  className="mt-4 text-white"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="w-32 ml-auto">
                    <DatePicker
                      name="dateTime"
                      control={control}
                      error={errors.dateTime?.message}
                    />
                  </div>
                  <p>Price</p>
                  <input
                    defaultValue={""}
                    autoFocus
                    type="number"
                    {...register("price", { required: true, min: 0 })}
                    className="p-1 mb-3 w-full bg-white bg-opacity-40 rounded hover:border"
                  />
                  {errors.price && (
                    <span className="text-xs text-red-500">必須項目です</span>
                  )}
                  <p>Category</p>
                  <select
                    {...register("category")}
                    className="py-2 px-1 mb-3 w-full bg-white bg-opacity-40 rounded hover:border"
                  >
                    {userData?.categoryList?.map((value: string) => {
                      return (
                        <option value={value} key={value}>
                          {value}
                        </option>
                      );
                    })}
                  </select>
                  <p>Memo</p>
                  <input
                    defaultValue={""}
                    autoFocus
                    {...register("memo")}
                    className="p-1 mb-3 w-full bg-white bg-opacity-40 rounded hover:border"
                  />

                  <div className="flex justify-around mt-3">
                    <PrimaryButton
                      text={
                        <div className="flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <p>登録</p>
                        </div>
                      }
                      type="submit"
                      onClick={() => {
                        handleSubmit(onSubmit);
                      }}
                    />
                  </div>
                </form>
              </div>
            </section>
            <section className="">
              <div className="sm:flex">
                <h2 className="py-3 sm:py-2 px-4 text-4xl font-bold sm:table">
                  Category
                </h2>
                <div className="hidden sm:block py-4">
                  <AddCategory userData={userData} getItemList={getItemList} />
                </div>
              </div>
              <div className="m-3 shadow-2xl ">
                {userData.categoryList.map((category, index) => {
                  return (
                    <div
                      className={`flex justify-between p-2 sm:p-1 my-1 bg-blue-300 bg-opacity-30 rounded-sm border-b last:border-b-0 ${
                        index % 2 === 1
                          ? "animate-tilt-in-right-1"
                          : "animate-tilt-in-left-1"
                      } `}
                      key={category}
                    >
                      <p>
                        <span
                          style={{ borderColor: colors[index] }}
                          className="inline-block mr-2 w-3 h-3 rounded-full border-2"
                        ></span>
                        {category}
                      </p>
                      <EditCategory
                        category={category}
                        getItemList={getItemList}
                        userData={userData}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="sm:hidden">
                <AddCategory userData={userData} getItemList={getItemList} />
              </div>
            </section>
          </div>
          <section>
            <div className="flex justify-between my-3">
              <h2 className="px-4 text-4xl font-bold">Chart</h2>
            </div>
            <Graph arr={priceArr} labels={userData.categoryList} />
          </section>
        </div>
        <section className="relative z-40 pt-8 w-full max-w-2xl h-screen bg-home sm:bg-opacity-40 rounded-t-3xl animate-slide-in-bottom sm:h-auto md:p-5">
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
                    <p
                      className={`text-xs ${isSelectDate ? "" : "text-white"} `}
                    >
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
                      <div className="table p-3 mx-2 -mt-16 mb-3 w-5/12 text-base border-r animate-slit-in-vertical">
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
            {isTop ? <MenuBar page="/" /> : null}
          </Tab.Group>
        </section>
      </main>
    </>
  ) : null;
};

PcPage.getLayout = HomeLayout;

export default PcPage;
