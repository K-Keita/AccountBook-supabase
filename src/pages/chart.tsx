import { useEffect } from "react";
import { Graph } from "src/components/Graph";
import { ChangeMonthButton } from "src/components/utils/changeMonthButton";
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
    <div className="sm:overflow-y-scroll sm:h-screen">
      <section>
        <div className="flex justify-between my-3">
          <h2 className="px-4 text-4xl font-bold">Chart</h2>
          <div className="px-8 mt-5">
            <ChangeMonthButton
              prevMonth={prevMonth}
              nextMonth={nextMonth}
              month={month}
            />
          </div>
        </div>
        <Graph arr={priceArr} labels={userData.categoryList} />
      </section>
      <section >
        <h2 className="px-4 text-4xl font-bold">By Category</h2>
        <p className="p-4 text-lg text-right">
          合計<span>({itemList.length})</span>:{""}
          <span className="mx-3 text-xl font-bold">
            ¥{totalPrice?.toLocaleString()}
          </span>
        </p>
        <div className="pb-28">
          {userData.categoryList.map((category) => {
            const arr = itemList.filter((value) => {
              return value.categoryID === category;
            });
            const totalPrice = arr.reduce((sum, element) => {
              return sum + element.price;
            }, 0);
            return (
              <div
                className="flex justify-between p-1 my-5 mx-auto w-10/12 border-b"
                key={category}
              >
                <p className="text-lg">
                  {category}
                  <span className="mx-1">({arr.length})</span>
                </p>
                <p>¥{totalPrice.toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  ) : null;
};

Chart.getLayout = SecondLayout;

export default Chart;
