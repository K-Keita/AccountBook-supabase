import { Auth } from "@supabase/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { AddItem } from "src/components/addItem";
import { ItemList } from "src/components/itemList";
import { sortData } from "src/hooks/sortData";
import type { Data } from "src/interface/type";
import type { UserData } from "src/interface/type";
import { client } from "src/libs/supabase";

type Props = {
  children: ReactNode;
};

const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;
const day = d.getDate();

const getLastDate = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

const count = getLastDate(year, month);

const colors = ["red", "blue", "green", "orange", "gray", "pink", "yellow"];

// 全てのアイテムの取得
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

const Container = (props: Props) => {
  const { user } = Auth.useUser();

  const [text, setText] = useState<string>("");
  const [userData, setUserData] = useState<Data>();
  const [total, setTotal] = useState<number>();
  const [items, setItems] = useState<UserData[]>([]);
  const [oneDayTotal, setOneDayTotal] = useState<number>(0);
  const [m, setM] = useState<number>(month);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenCategory = () => {
    setIsOpen(true);
  };

  const handleCloseCategory = () => {
    setIsOpen(false);
  };

  const router = useRouter();
  const { id } = router.query;

  const getItemList = useCallback(
    async (year: number, month: number) => {
      if (user) {
        const { userData, items, totalPrice } = await getItems(
          user.id.toString(),
          year,
          month
        );
        if (userData) {
          setUserData(userData);
        } else {
          router.push("/");
        }
        if (items) {
          setItems(items);
          setTotal(totalPrice);
          const oneDayPrice = items.reduce((sum: number, element: any) => {
            if (element.buyDate[2] === day.toString()) {
              return sum + element.price;
            }
            return sum + 0;
          }, 0);
          setOneDayTotal(oneDayPrice);
        }
      }
    },
    [router, user]
  );

  useEffect(() => {
    getItemList(year, m);
  }, [user, getItemList, id, router, m]);

  //カテゴリーの追加
  const addCategory = async (text: string) => {
    if (text === "") {
      return false;
    }

    if (userData) {
      const arr = userData.categoryList;
      if (arr.indexOf(text) !== -1) {
        alert("すでに同じカテゴリー名があります");
        return false;
      }
      const newArr = [...arr, text];

      const { error } = await client.from("users").upsert({
        id: userData.id,
        userID: userData.userID,
        categoryList: newArr,
      });

      if (error) {
        alert(error);
      }
    }

    setText("");
    getItemList(year, m);
  };

  //前の月へ
  const prevMonth = useCallback(() => {
    const count = m - 1;
    setM(count);
  }, [m]);

  //次の月へ
  const nextMonth = useCallback(() => {
    if (m === month) {
      return false;
    }
    const count = m + 1;
    setM(count);
  }, [m]);

  const data = sortData(items);

  const targetAverage = userData ? userData.targetAmount / count : null;
  const nowAverage = total ? total / d.getDate() : null;

  if (user) {
    return (
      <div className="min-h-lg ">
        <div className="flex pt-8">
          <div className="p-5 w-1/2">
            <div className="flex">
              <button onClick={prevMonth}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-4 w-6 h-6"
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
              <h2 className="p-4 text-2xl">{m}月</h2>
              <button onClick={nextMonth}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-4 w-6 h-6"
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
              <div className="p-4">
                <p className="text-lg">
                  今月の金額：¥{userData?.targetAmount.toLocaleString()}
                </p>
                <p className="text-sm text-center">
                  (平均金額：
                  {targetAverage
                    ? Math.floor(targetAverage).toLocaleString()
                    : null}
                  )
                </p>
              </div>
            </div>
            <div className=" p-1 pb-4 my-4">
              <h2 className="p-2 text-lg">カテゴリー</h2>
              <div className="flex flex-wrap justify-around">
                {userData
                  ? userData.categoryList.map((value, index) => {
                      return (
                        <Link
                          key={index}
                          href={`/category?id=${index}`}
                          passHref
                        >
                          <p
                            className="table px-1 m-3 w-28 text-center rounded-lg cursor-pointer"
                            style={{ border: `solid 1px ${colors[index]}` }}
                          >
                            {value}
                          </p>
                        </Link>
                      );
                    })
                  : null}
              </div>
              {isOpen ? (
                <div className="flex justify-center p-4">
                  <input
                    className="px-4 h-12 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
                    placeholder="Filtering text"
                    value={text}
                    autoFocus
                    type="text"
                    onChange={(e) => {
                      return setText(e.target.value);
                    }}
                  />
                  <button
                    className="table p-1 mr-10 ml-auto bg-green-50 border border-gray-400 cursor-pointer"
                    onClick={() => {
                      return addCategory(text);
                    }}
                  >
                    カテゴリー追加
                  </button>
                  <button
                    onClick={handleCloseCategory}
                    className="table p-1 bg-green-100 cursor-pointer"
                  >
                    キャンセル
                  </button>
                </div>
              ) : null}
              <button
                onClick={handleOpenCategory}
                className="block p-1 mx-10 ml-auto w-24 bg-green-100 border border-gray-400 cursor-pointer"
              >
                追加
              </button>
            </div>
            <p className="text-sm text-center">
              今日の金額：
              {oneDayTotal.toLocaleString()}円
            </p>
            <p className="text-sm text-center">
              1日の平均金額：
              {nowAverage ? Math.floor(nowAverage).toLocaleString() : null}円
            </p>
            {total ? (
              <div className="px-8 pt-2 pb-1 text-2xl text-center">
                合計：{total.toLocaleString()}円
              </div>
            ) : null}
            <AddItem
              userData={userData}
              uuid={user.id}
              getItemList={getItemList}
            />
          </div>
          <div className="p-5 w-1/2">
            <h2 className="p-4 text-2xl">アイテムリスト</h2>
            {userData && (
              <ItemList
                items={data}
                userData={userData}
                uuid={user.id}
                getItemList={getItemList}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
  return <>{props.children}</>;
};

const Home = () => {
  return (
    <Container>
      <div className="flex justify-center pt-8">
        <div className="w-full sm:w-96">
          <Auth
            supabaseClient={client}
            providers={["google"]}
            socialColors={true}
          />
        </div>
      </div>
    </Container>
  );
};

export default Home;
