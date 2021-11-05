import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { useCallback, useEffect, useState } from "react";
import { Graph } from "src/components/Graph";
import { MenuBar } from "src/components/menuBar";
import { sortData } from "src/hooks/sortData";
import type { ItemData, UserData } from "src/interface/type";
import { client } from "src/libs/supabase";

const d = new Date();
const y = d.getFullYear();
const m = d.getMonth() + 1;
// const day = d.getDate();

//全てのアイテムの取得
const getItems = async (userID: string, year: number, month: number) => {
  let { data, error } = await client
    .from("users")
    .select("*")
    .eq("userID", userID);

  if (!error && data) {
    const userData = data[0];
    ({ data, error } = await client
      .from("purchasedItem")
      .select("*")
      .contains("date", [`year:${year}`, `month:${month}`])
      .eq("userID", userID));

    const newData = data?.reduce((sum, element) => {
      return sum + element.price;
    }, 0);

    if (!error && data) {
      return { userData: userData, items: data, totalPrice: newData };
    } else {
      return { userData: userData, items: null, totalPrice: null };
    }
  }

  return { userData: null, items: null, totalPrice: null };
};

const Chart: VFC = () => {
  const user = client.auth.user();
  const router = useRouter();

  const [items, setItems] = useState<ItemData[]>([]);
  const [userData, setItemData] = useState<UserData>();
  const [totalPrice, setTotalPrice] = useState<number>();
  const [categoryList, setCategoryList] = useState<string[]>([]);

  const [year, setYear] = useState<number>(y);
  const [month, setMonth] = useState<number>(m);

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
        } else {
          router.push("/login");
        }
        if (items) {
          setItems(sortData(items));
          setTotalPrice(totalPrice);
        }
      }
    },
    [router, user]
  );

  useEffect(() => {
    getItemList(year, month);
  }, [user, getItemList, router, month, year]);

  //前の月へ
  const prevMonth = useCallback(() => {
    if (month === 1) {
      setYear((year) => {
        return year - 1;
      });
      setMonth(12);
      return;
    }
    setMonth((month) => {
      return month - 1;
    });
  }, [month]);

  //次の月へ
  const nextMonth = useCallback(() => {
    if (month === m && year === y) {
      return false;
    } else if (month === 12) {
      setYear((year) => {
        return year - 1;
      });
      setMonth(1);
      return;
    }

    setMonth((month) => {
      return month + 1;
    });
  }, [month, year]);

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

  return user ? (
    <>
      <div className="relative -z-10 h-1 bg-blue-400" />
      <main className="relative z-40 pb-16 w-full min-h-screen text-white bg-home rounded-t-3xl animate-slide-in-bottom md:p-5 md:w-1/2">
        <Link href="/" passHref>
          <button className="p-6 text-2xl">-Title-</button>
        </Link>
        <div className="flex justify-between my-3">
          <h2 className="px-4 text-4xl font-bold">Chart</h2>
          <div className={`flex justify-end px-8 mt-5`}>
            <button onClick={prevMonth}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className={`px-2 text-xl`}>{month}月</h2>
            <button onClick={nextMonth}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
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
      </main>
      <MenuBar />
    </>
  ) : null;
};

export default Chart;
