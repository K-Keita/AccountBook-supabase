import { Auth, Button, IconCornerDownLeft } from "@supabase/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { useCallback, useEffect, useState } from "react";
import { EditCategory } from "src/components/editCategory";
import { ItemList } from "src/components/itemList";
import type { Data as TitleType } from "src/interface/type";
import type { UserData } from "src/interface/type";
import { client } from "src/libs/supabase";

const d = new Date();
// const year = d.getFullYear();
const month = d.getMonth() + 1;
// const day = d.getDate();

// データベースからカテゴリーごとの商品の取得
const getCategoryItems = async (userID: string, categoryID: number) => {
  let { data, error } = await client
    .from("users")
    .select("*")
    .eq("userID", userID);

  if (!error && data) {
    const userData = data[0];
    ({ data, error } = await client
      .from("purchasedItem")
      .select("*")
      .eq("userID", userID)
      .eq("categoryID", userData.categoryList[categoryID]));

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

const Title: VFC = () => {
  const { user } = Auth.useUser();

  const [items, setItems] = useState<UserData[]>([]);
  const [userData, setUserData] = useState<TitleType>();
  const [total, setTotal] = useState<number>();

  const router = useRouter();
  const { id } = router.query;

  //IDと同じカテゴリーの商品を取得
  const getItemList = useCallback(async () => {
    if (user) {
      const { userData, items, totalPrice } = await getCategoryItems(
        user.id.toString(),
        Number(id)
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

  return (
    user ? (
      <div className="min-h-lg">
        <h2 className="p-4 text-2xl">{month}月</h2>
        <div className="flex">
          <div className="p-5 w-1/2">
            <div className="flex my-2 mr-2">
              <div className="w-24">
                <Link href="/" passHref>
                  <Button block size="medium" icon={<IconCornerDownLeft />}>
                    BACK
                  </Button>
                </Link>
              </div>
            </div>
            {userData && (
              <>
                <h2 className="pb-4 text-3xl font-bold text-center">
                  カテゴリー：
                  {id ? userData.categoryList[Number(id)] : null}
                </h2>
                {userData &&
                  (id ? (
                    <EditCategory
                      category={userData.categoryList[Number(id)]}
                      num={Number(id)}
                      getItemList={getItemList}
                      userData={userData}
                    />
                  ) : null)}
                <div className="px-8 pt-2 pb-1 text-2xl font-semibold text-center">
                  {total ? <p>合計：{total}</p> : null}
                </div>
              </>
            )}
          </div>
          <div className="p-5 w-1/2">
            <h2 className="p-4 text-2xl">アイテムリスト</h2>
            {userData && (
              <ItemList
                items={items}
                userData={userData}
                uuid={user.id}
                getItemList={getItemList}
              />
            )}
          </div>
        </div>
      </div>
    ) : (
      null
    )
  );
};

export default Title;
