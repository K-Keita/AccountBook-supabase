import { Auth, Button, IconCornerDownLeft } from "@supabase/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { EditTitle } from "src/components/editTitle";
import { LayoutWrapper } from "src/components/layoutWrapper";
import { SubtitleList } from "src/components/subtitleList";
import type { Data as TitleType } from "src/components/titleList";
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
const getItems = async (user_id: string) => {
  let { data, error } = await client.from("users").select("*").eq("user_id", user_id);

  if (!error && data) {
    const userData = data[0];
    ({ data, error } = await client
      .from("purchasedItem")
      .select("*")
      .eq("user_id", user_id));

    if (!error && data) {
      return { userData: userData, items: data };
    } else {
      return { userData: userData, items: null };
    }
  }
  return { userData: null, items: null };
};

const Title: VFC = () => {
  const Container = () => {
    const { user } = Auth.useUser();


    const [items, setItems] = useState<UserData[]>([]);
    const [userData, setTitle] = useState<TitleType>();

    const router = useRouter();

    console.log(userData)
    const { id } = router.query;

    //IDと同じカテゴリーの商品を取得
    const getItemList = useCallback(async () => {
      if (user) {
        const { userData, items } = await getItems(user.id.toString());
        if (userData) {
          setTitle(userData);
        } else {
          router.push("/");
        }
        if (items) {
          setItems(items);
        }
      }
    }, [id, router]);

    console.log(userData, items);
    useEffect(() => {
      // if (!id) {
      //   router.push("/");
      // }

      getItemList();
    }, [user, getItemList, id, router]);

    if (user) {
      return (
        <div>
          <div className="flex gap-2 justify-end my-2 mr-2">
            {userData && (
              <div className="w-24">
                <EditTitle userData={userData} getItemList={getItemList} />
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
                {userData.category}
              </h2>
              <p className="pb-4 text-2xl font-semibold text-center">
                {userData.user_name}
              </p>
            </>
          )}
          {userData && (
            <SubtitleList
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
