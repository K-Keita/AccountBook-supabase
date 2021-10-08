import { Auth, Button, IconCornerDownLeft } from "@supabase/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import type { VFC } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { EditTitle } from "src/components/editTitle";
import { LayoutWrapper } from "src/components/layoutWrapper";
import { SubtitleList } from "src/components/subtitleList";
import type { Title as TitleType } from "src/components/titleList";
import { client } from "src/libs/supabase";

export type subtitle = {
  id: number;
  user_id: string;
  title_id: number;
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
    const title = data[0];
    ({ data, error } = await client
      .from("purchasedItem")
      .select("*")
      .eq("user_id", user_id));

    if (!error && data) {
      return { title: title, items: data };
    } else {
      return { title: title, items: null };
    }
  }
  return { title: null, items: null };
};

const Title: VFC = () => {
  const Container = () => {
    const { user } = Auth.useUser();

    console.log(user)

    const [items, setItems] = useState<subtitle[]>([]);
    const [title, setTitle] = useState<TitleType>();

    const router = useRouter();

    const { id } = router.query;

    //IDと同じカテゴリーの商品を取得
    const getItemList = useCallback(async () => {
      if (user) {
        const { title, items } = await getItems(user.id.toString());
        if (title) {
          setTitle(title);
        } else {
          router.push("/");
        }
        if (items) {
          setItems(items);
        }
      }
    }, [id, router]);

    console.log(title, items);
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
            {title && (
              <div className="w-24">
                <EditTitle title={title} getItemList={getItemList} />
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
          {title && (
            <>
              <h2 className="pb-4 text-4xl font-bold text-center">
                {title.category}
              </h2>
              <p className="pb-4 text-2xl font-semibold text-center">
                {title.user_name}
              </p>
            </>
          )}
          {title && (
            <SubtitleList
              items={items}
              title={title}
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
