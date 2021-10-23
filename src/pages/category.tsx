import { Auth, Button, IconCornerDownLeft } from "@supabase/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";
import { EditCategory } from "src/components/editCategory";
import { useCallback, useEffect, useState } from "react";
import { ItemList } from "src/components/itemList";
import type { Data as TitleType } from "src/interface/type";
import { LayoutWrapper } from "src/layouts/layoutWrapper";
import { client } from "src/libs/supabase";

export type UserData = {
  id: number;
  user_id: string;
  userData_id: number;
  created_at: string;
  volume: number;
  isbn: number;
  image_url: string;
  possession: boolean;
};

// データベースからカテゴリーごとの商品の取得
const getCategoryItems = async (user_id: string, category_id: string) => {
  let { data, error } = await client
    .from("users")
    .select("*")
    .eq("user_id", user_id);

  if (!error && data) {
    const userData = data[0];
    ({ data, error } = await client
      .from("purchasedItem")
      .select("*")
      .eq("user_id", user_id)
      .eq("category_id", userData.categories_list[category_id]));

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
  const Container = () => {
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
          String(id)
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

    console.log();

    if (user) {
      return (
        <div>
          <div className="flex gap-2 justify-end my-2 mr-2">
            {userData && (
              <div className="w-24">
                {id ? (
                  <EditCategory
                    category={userData.categories_list[Number(id)]}
                    num={Number(id)}
                    getItemList={getItemList}
                    userData={userData}
                  />
                ) : null}
              </div>
            )}
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
              <h2 className="pb-4 text-4xl font-bold text-center">
                カテゴリー：{id ? userData.categories_list[Number(id)] : null}
              </h2>
              <div className="px-8 pt-2 pb-1 text-2xl font-semibold text-right border-b border-gray-300">
                {total ? <p>合計：{total}</p> : null}
              </div>
            </>
          )}
          {userData && (
            <ItemList
              items={items}
              userData={userData}
              uuid={user.id}
              getItemList={getItemList}
            />
          )}
        </div>
      );
    }
    return <div></div>;
  };

  return (
    <LayoutWrapper>
      <Auth.UserContextProvider supabaseClient={client}>
        <Container />
      </Auth.UserContextProvider>
    </LayoutWrapper>
  );
};

export default Title;
