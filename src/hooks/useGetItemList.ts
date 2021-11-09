import { useCallback, useState } from "react";
import { getAllItem } from "src/hooks/getData";
import {sortData} from 'src/hooks/sortData';
import type { ItemData,UserData } from "src/interface/type";
import { client } from "src/libs/supabase";

// const d = new Date();
// const m = d.getMonth() + 1;
// const date = d.getDate();

type Data = {
  data: any | null;
  error: any;
};


export const useGetItemList = () => {
  const user = client.auth.user();
  const [userData, setItemData] = useState<UserData>();
  const [itemList, setItemList] = useState<ItemData[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  // const [oneDayTotalPrice, setOneDayTotalPrice] = useState<number>(0);

  const getItemList = useCallback(async (year: number, month: number) => {
    if (user) {
      const { userData, itemList, totalPrice } = await getAllItem(
        user.id.toString(),
        year,
        month
      );
      if (userData) {
        setItemData(userData);
      } else {
        const { data, error }: Data = await client.from("users").insert([
          {
            userID: user.id,
            targetAmount: 50000,
            categoryList: ["外食", "スーパー", "コンビニ"],
            userName: "",
          },
        ]);
        if (data) {
          setItemData(data);
        }

        if (error) {
          throw new Error("");
        }
      }
      if (itemList) {
        setItemList(sortData(itemList));
        setTotalPrice(totalPrice);
      }
    }
  }, [user]);
  return { userData, itemList, totalPrice, getItemList };
};
