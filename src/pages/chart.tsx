import { useRouter } from "next/router";
import { useEffect } from "react";
import { Graph } from "src/components/Graph";
import { ChangeMonthButton } from "src/components/utils/changeMonthButton";
// import { getAllItem } from "src/hooks/getData";
// import { sortData } from "src/hooks/sortData";
import { useChangeMonth } from "src/hooks/useChangeMonth";
import { useGetItemList } from "src/hooks/useGetItemList";
// import type { ItemData, UserData } from "src/interface/type";
import { SecondLayout } from "src/layouts/secondLayout";
// import { client } from "src/libs/supabase";

const Chart = () => {
  // const user = client.auth.user();
  const router = useRouter();

    const { userData, itemList, totalPrice, getItemList } = useGetItemList();
  // const [itemList, setItemList] = useState<ItemData[]>([]);
  // const [userData, setItemData] = useState<UserData>();
  // const [totalPrice, setTotalPrice] = useState<number>();
  // const [categoryList, setCategoryList] = useState<string[]>([]);

  const { year, month, prevMonth, nextMonth } = useChangeMonth();

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
  //       }

  //       if (itemList) {
  //         setItemList(sortData(itemList));
  //         setTotalPrice(totalPrice);
  //       }
  //     }
  //   },
  //   [user]
  // );

  useEffect(() => {
    getItemList(year, month);
  }, [getItemList, router, month, year]);

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
      <Graph arr={priceArr} labels={userData.categoryList} />
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
    </>
  ) : null;
};

Chart.getLayout = SecondLayout;

export default Chart;
