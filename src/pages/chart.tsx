import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Graph } from "src/components/Graph";
import { ChangeMonthButton } from "src/components/utils/changeMonthButton";
import { getItems } from "src/hooks/getData";
import { sortData } from "src/hooks/sortData";
import { useChangeMonth } from "src/hooks/useChangeMonth";
import type { ItemData, UserData } from "src/interface/type";
import { SecondLayout } from "src/layouts/secondLayout";
import { client } from "src/libs/supabase";

const Chart = () => {
  const user = client.auth.user();
  const router = useRouter();

  const [items, setItems] = useState<ItemData[]>([]);
  const [userData, setItemData] = useState<UserData>();
  const [totalPrice, setTotalPrice] = useState<number>();
  const [categoryList, setCategoryList] = useState<string[]>([]);

  const { year, month, prevMonth, nextMonth } = useChangeMonth();

  //IDと同じカテゴリーの商品を取得
  const getItemList = useCallback(
    async (year, month) => {
      if (user) {
        const { userData, items, totalPrice } = await getItems(
          user.id.toString(),
          year,
          month
        );
        if (userData) {
          setItemData(userData);
          setCategoryList(userData.categoryList);
        }

        if (items) {
          setItems(sortData(items));
          setTotalPrice(totalPrice);
        }
      }
    },
    [user]
  );

  useEffect(() => {
    getItemList(year, month);
  }, [user, getItemList, router, month, year]);

  //カテゴリーごとの合計金額
  const priceArr = userData?.categoryList.map((category) => {
    const arr = items.filter((value) => {
      return value.categoryID === category;
    });
    const totalPrice = arr.reduce((sum, element) => {
      return sum + element.price;
    }, 0);
    return totalPrice;
  });

  return (
    <>
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
      {userData ? (
        <div className="p-2 my-2">
          <Graph arr={priceArr} labels={userData.categoryList} />
        </div>
      ) : (
        <div className="h-96" />
      )}
      <h2 className="p-4 text-4xl font-bold">By Category</h2>
      <p className="p-4 text-lg text-right">
        合計<span>({items.length})</span>:{""}
        <span className="mx-3 text-xl font-bold">
          ¥{totalPrice?.toLocaleString()}
        </span>
      </p>
      <div className="pb-28">
        {categoryList.map((category) => {
          const arr = items.filter((value) => {
            return value.categoryID === category;
          });
          const totalPrice = arr.reduce((sum, element) => {
            return sum + element.price;
          }, 0);
          return (
            <div
              className="flex justify-between py-1 my-5 mx-auto w-10/12 border-b "
              key={category}
            >
              <div className="text-xl">
                {category}
                <span className="mx-1 text-lg">({arr.length})</span>
              </div>
              <p className="text-lg">¥{totalPrice.toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

Chart.getLayout = SecondLayout;

export default Chart;
