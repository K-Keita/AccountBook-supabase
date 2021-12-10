/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { ItemForm } from "src/components/ItemForm";
import { PcMenuContainer } from "src/components/sectionContainer/pcMenuContainer";
import { PurchasedItemList } from "src/components/sectionContainer/purchasedItemList";
import { TopTitleContainer } from "src/components/sectionContainer/topTitleContainer";
import { useChangeMonth } from "src/hooks/useChangeMonth";
import { useGetItemList } from "src/hooks/useGetItemList";
import { HomeLayout } from "src/layouts/homeLayout";
import { client } from "src/libs/supabase";

const Home = () => {
  const user = client.auth.user();
  const { year, month } = useChangeMonth();
  const { userData, itemList, totalPrice, getItemList } = useGetItemList();

  useEffect(() => {
    if (user) {
      getItemList(user.id, year, month);
    }
  }, [getItemList, user, year, month]);

  return userData ? (
    <main
      className="w-full min-h-lg text-white bg-gradient-to-b from-blue-800 via-purple-900 to-danger sm:flex  sm:bg-none"
      style={{ fontFamily: "游明朝体" }}
    >
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
      <ItemForm />
    </main>
  ) : null;
};

Home.getLayout = HomeLayout;

export default Home;
