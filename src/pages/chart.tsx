import { useEffect } from "react";
import { ByCategoryContainer } from "src/components/sectionContainer/byCategoryContainer";
import { ChartContainer } from "src/components/sectionContainer/ChartContainer";
import { PcMenuContainer } from "src/components/sectionContainer/pcMenuContainer";
import { useChangeMonth } from "src/hooks/useChangeMonth";
import { useGetItemList } from "src/hooks/useGetItemList";
import { SecondLayout } from "src/layouts/secondLayout";
import { client } from "src/libs/supabase";

const Chart = () => {
  const user = client.auth.user();
  const { year, month, prevMonth, nextMonth } = useChangeMonth();
  const { userData, itemList, totalPrice, getItemList } = useGetItemList();

  useEffect(() => {
    if (user) {
      getItemList(user.id, year, month);
    }
  }, [getItemList, user, month, year]);

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
    <div className="sm:flex sm:overflow-y-scroll">
      <PcMenuContainer
        totalPrice={totalPrice}
        targetAmount={userData.targetAmount}
        itemList={itemList}
      />
      <ChartContainer prevMonth={prevMonth} nextMonth={nextMonth} month={month} priceArr={priceArr} categoryList={userData.categoryList} />
      <ByCategoryContainer itemList={itemList} totalPrice={totalPrice} categoryList={userData.categoryList}/>
    </div>
  ) : null;
};

Chart.getLayout = SecondLayout;

export default Chart;
