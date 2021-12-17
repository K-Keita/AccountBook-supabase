import { useEffect } from "react";
import { AddCategory } from "src/components/addCategory";
import { CategoryContainer } from "src/components/sectionContainer/categoryContaiiner";
import { HistoryContainer } from "src/components/sectionContainer/historyContainer";
import { PcMenuContainer } from "src/components/sectionContainer/pcMenuContainer";
import { ChangeMonthButton } from "src/components/utils/changeMonthButton";
import { useChangeMonth } from "src/hooks/useChangeMonth";
import { useGetItemList } from "src/hooks/useGetItemList";
import { SecondLayout } from "src/layouts/secondLayout";
import { client } from "src/libs/supabase";

const Category = () => {
  const user = client.auth.user();
  const { year, month, prevMonth, nextMonth } = useChangeMonth();
  const { userData, itemList, totalPrice, getItemList } = useGetItemList();

  useEffect(() => {
    if (user) {
      getItemList(user.id, year, month);
    }
  }, [getItemList, user, month, year]);

  return userData ? (
    <main className="grid-cols-3 sm:grid">
      <PcMenuContainer
        totalPrice={totalPrice}
        targetAmount={userData.targetAmount}
        itemList={itemList}
      />
      <CategoryContainer
        userData={userData}
        getItemList={getItemList}
        addCategory={
          <AddCategory userData={userData} getItemList={getItemList} />
        }
      />
      <HistoryContainer
        userData={userData}
        itemList={itemList}
        totalPrice={totalPrice}
        getItemList={getItemList}
        changeMonthButton={
          <ChangeMonthButton
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            month={month}
          />
        }
      />
    </main>
  ) : null;
};

Category.getLayout = SecondLayout;

export default Category;
