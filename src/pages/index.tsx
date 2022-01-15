/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
// import { ItemFormContainer } from "src/components/sectionContainer/itemFormContainer";
// import { PcMenuContainer } from "src/components/sectionContainer/pcMenuContainer";
import { PurchasedItemList } from "src/components/sectionContainer/purchasedItemList";
import { TopTitleContainer } from "src/components/sectionContainer/topTitleContainer";
import { ChangeMonthButton } from "src/components/utils/changeMonthButton";
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
  }, [getItemList, user, month, year]);


  return userData ? (
    <main
      className="w-full min-h-lg font-body text-white bg-gradient-to-b from-blue-800 via-purple-900 to-danger"
    >
      <div className="max-w-4xl mx-auto">

      <TopTitleContainer
        totalPrice={totalPrice}
        userData={userData}
        itemList={itemList}
        getItemList={getItemList}
        />
      <PurchasedItemList
        changeMonthButton={
          <ChangeMonthButton
          month={month}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
          />
        }
        year={year}
        month={month}
        userData={userData}
        itemList={itemList}
        totalPrice={totalPrice}
        getItemList={getItemList}
        />
        </div>
    </main>
  ) : null;
};

Home.getLayout = HomeLayout;

export default Home;
