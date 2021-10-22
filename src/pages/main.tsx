import { Auth, Button, IconLogOut } from "@supabase/ui";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { AddSubtitle } from "src/components/addItem";
import { EditCategory } from "src/components/editCategory";
import { LayoutWrapper } from "src/components/layoutWrapper";
import { SubtitleList } from "src/components/subtitleList";
import type { Data } from "src/components/titleList";
import { client } from "src/libs/supabase";

type Props = {
  children: ReactNode;
};

const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;

const getItems = async (user_id: string) => {
  let { data, error } = await client
    .from("users")
    .select("*")
    .eq("user_id", user_id);

  if (!error && data) {
    const userData = data[0];
    ({ data, error } = await client
      .from("purchasedItem")
      .select("*")
      .contains("buyDate", [year, month])
      .eq("user_id", user_id));

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
  const [items, setItems] = useState<any>([]);

  const router = useRouter();
  const { id } = router.query;

  const getItemList = useCallback(async () => {
    if (user) {
      const { userData, items, totalPrice } = await getItems(
        user.id.toString()
      );
      if (userData) {
        setUserData(userData);
      } else {
        router.push("/");
      }
      if (items) {
        setItems(items);
        setTotal(totalPrice);
      }
    }
  }, [id, router, user]);

  useEffect(() => {
    getItemList();
  }, [user, getItemList, id, router]);

  //カテゴリーの追加
  const addCategory = async (text: string) => {
    if (text === "") {
      return false;
    }

    if (userData) {
      const arr = userData.categories_list;
      if (arr.indexOf(text) !== -1) {
        alert("すでに同じカテゴリー名があります");
        return false;
      }
      const newArr = [...arr, text];

      const { error } = await client.from("users").upsert({
        id: userData.id,
        user_id: userData.user_id,
        categories_list: newArr,
      });

      if (error) {
        alert(error);
      }
    }

    setText("");
    getItemList();
  };

  //timestampの型定義がわからない(後で確認)
  const sortData = (data: any) => {
    const arr = data.sort((a: any, b: any) => {
      if (Number(a.buyDate[2]) < Number(b.buyDate[2])) {
        return 1;
      } else {
        return -1;
      }
    });
    return arr;
  };

  const data = sortData(items);

  console.log(data);

  const getLastDate = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const count = getLastDate(year, month);

  const targetAverage = userData ? userData.targetAmount / count : null;
  const nowAverage = total ? total / d.getDate() : null;

  if (user) {
    return (
      <div>
        <h2 className="text-xl">{month}月</h2>
        <div className="flex gap-2 justify-center p-4">
          <input
            className="px-4 w-full h-12 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
            placeholder="Filtering text"
            value={text}
            autoFocus
            type="text"
            onChange={(e) => {
              return setText(e.target.value);
            }}
          />
        </div>
        <div className="flex justify-around ">
          {userData
            ? userData.categories_list.map((value) => {
                return (
                  <EditCategory
                    key={value}
                    category={value}
                    getItemList={getItemList}
                    userData={userData}
                  />
                );
              })
            : null}
        </div>
        <button
          className="table block p-1 mr-10 ml-auto text-lg bg-green-200 rounded-md cursor-pointer"
          onClick={() => {
            return addCategory(text);
          }}
        >
          カテゴリー追加
        </button>
        <p className="text-lg">今月の金額：{userData?.targetAmount}</p>
        <p className="text-lg">1日の平均金額：{Math.floor(targetAverage)}</p>
        <p className="text-lg">
          現在の1日平均金額：{nowAverage ? Math.floor(nowAverage) : null}
        </p>
        {total ? (
          <div className="px-8 pt-2 pb-1 text-2xl text-right border-b border-gray-300">
            合計：{total}
          </div>
        ) : null}
        <AddSubtitle
          userData={userData}
          uuid={user.id}
          getItemList={getItemList}
        />
        {userData && (
          <SubtitleList
            items={data}
            userData={userData}
            uuid={user.id}
            getItemList={getItemList}
          />
        )}
        <div className="flex justify-end my-4 mx-2">
          <Button
            size="medium"
            icon={<IconLogOut />}
            onClick={() => {
              return client.auth.signOut();
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }
  return <>{props.children}</>;
};

const Home = () => {
  return (
    <LayoutWrapper>
      <Auth.UserContextProvider supabaseClient={client}>
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
      </Auth.UserContextProvider>
    </LayoutWrapper>
  );
};

export default Home;
