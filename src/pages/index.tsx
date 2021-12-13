/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { ItemForm } from "src/components/ItemForm";
import { ChartContainer } from "src/components/sectionContainer/chartContainer";
import { PcMenuContainer } from "src/components/sectionContainer/pcMenuContainer";
import { PurchasedItemList } from "src/components/sectionContainer/purchasedItemList";
import { TopTitleContainer } from "src/components/sectionContainer/topTitleContainer";
import { useChangeMonth } from "src/hooks/useChangeMonth";
import { useGetItemList } from "src/hooks/useGetItemList";
import { HomeLayout } from "src/layouts/homeLayout";
import { client } from "src/libs/supabase";

const Home = () => {
  const user = client.auth.user();
  const { year, month, prevMonth, nextMonth } = useChangeMonth();
  const { userData, itemList, totalPrice, getItemList } = useGetItemList();

  useEffect(() => {
    if (user) {
      getItemList(user.id, year, month);
    }
  }, [getItemList, user, year, month]);

  //カテゴリーごとの合計金額
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
    <main
      className="w-full min-h-lg text-white bg-gradient-to-b from-blue-800 via-purple-900 to-danger sm:flex sm:bg-none"
      style={{ fontFamily: "游明朝体" }}
    >
      <div className="hidden h-10 sm:block" />
      <PcMenuContainer
        totalPrice={totalPrice}
        targetAmount={userData.targetAmount}
        itemList={itemList}
      />
      <TopTitleContainer
        totalPrice={totalPrice}
        userData={userData}
        itemList={itemList}
        getItemList={getItemList}
      />
      <PurchasedItemList
        userData={userData}
        itemList={itemList}
        totalPrice={totalPrice}
        getItemList={getItemList}
      />
      <div>
        <ItemForm />
        <ChartContainer
          prevMonth={prevMonth}
          nextMonth={nextMonth}
          month={month}
          priceArr={priceArr}
          categoryList={userData.categoryList}
        />
      </div>
    </main>
  ) : null;
};

Home.getLayout = HomeLayout;

export default Home;
