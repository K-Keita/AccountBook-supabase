import Link from "next/link";
// import Head from 'next/head';
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AddCategory } from "src/components/addCategory";
import { AddItem } from "src/components/addItem";
import { EditCategory } from "src/components/editCategory";
import { LinkButtonList } from "src/components/LinkButtonList";
import { MenuBar } from "src/components/menuBar";
import { PriceDisplay } from "src/components/utils/PriceDisplay";
import { Title } from "src/components/utils/title";
import { useChangeMonth } from "src/hooks/useChangeMonth";
import { useGetItemList } from "src/hooks/useGetItemList";
import { useToggleModal } from "src/hooks/useToggleModal";
import { Header } from "src/layouts/header";
import { client } from "src/libs/supabase";
import { colors } from "src/utils";
// import { MenuBar } from "src/components/menuBar";

const d = new Date();
const m = d.getMonth() + 1;
const date = d.getDate();

export const SecondLayout = (page: ReactNode) => {
  const router = useRouter();

  const user = client.auth.user();
  const [isTop, setIsTop] = useState<boolean>(false);

  const { year, month, prevMonth, nextMonth } = useChangeMonth();
  const { userData, itemList, totalPrice, getItemList } = useGetItemList();
  const { isOpen, openModal, closeModal } = useToggleModal();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  // const { ref, inView } = useInView({
  //   // オプション
  //   rootMargin: "300px", // ref要素が現れてから50px過ぎたら
  //   triggerOnce: false, // 最初の一度だけ実行
  // });

  useEffect(() => {
    if (user) {
      getItemList(user.id, year, month);
    }
  }, [getItemList, user, month, year]);

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

  return (
    <>
      {userData ? (
        <div
          className="text-white bg-gray-600"
          style={{ fontFamily: "游明朝体" }}
        >
          {/* <div className="hidden sm:block">
            <Header />
          </div> */}
          {/* <div className="relative -z-10 h-1" /> */}
          <div className="sm:flex bg-blue-800 max-w-6xl mx-auto">
            <section className="py-2 h-lg w-1/2 sm:relative hidden sm:block max-w-2xl min-w-3xl">
              <h2 className="px-3 text-2xl">TITLE</h2>
              <div className="flex flex-col justify-end h-3lg w-full">
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
                  className="flex justify-center py-1 px-1 my-3 mx-auto hover:bg-flower hover:bg-opacity-60 border border-flower shadow-2xl transition duration-300 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
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
                  <p className="px-1 text-lg text-center">register</p>
                  <AddItem
                    isOpen={isOpen}
                    closeModal={closeModal}
                    userData={userData}
                    getItemList={getItemList}
                  />
                </button>
                <LinkButtonList />
              </div>
            </section>
            <main className="overflow-hidden relative z-40 w-full min-h-screen bg-home rounded-t-3xl animate-slide-in-bottom sm:ml-auto sm:max-w-4xl md:p-5">
              <Link href="/" passHref>
                <button className="p-6 text-2xl sm:hidden">-Title-</button>
              </Link>
              {page}
            </main>
          </div>
          <div className="sm:hidden">
            <MenuBar page={router.pathname} />
          </div>
        </div>
      ) : null}
    </>
  );
};
