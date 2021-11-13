import router from "next/router";
import { useCallback, useState } from "react";
import { getAllItem } from "src/hooks/getData";
import {sortData} from 'src/hooks/sortData';
import type { ItemData,UserData } from "src/interface/type";

export const useGetItemList = () => {
  const [userData, setItemData] = useState<UserData>();
  const [itemList, setItemList] = useState<ItemData[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const getItemList = useCallback(async (id: string, year: number, month: number) => {
      const { userData, itemList, totalPrice } = await getAllItem(
        id.toString(),
        year,
        month
      );

      if (userData) {
        setItemData(userData);
      } else {
        router.push("/logIn");
        // const { data, error }: Data = await client.from("users").insert([
        //   {
        //     userID: id,
        //     targetAmount: 50000,
        //     categoryList: ["外食", "スーパー", "コンビニ"],
        //     userName: "",
        //   },
        // ]);
        // if (data) {
        //   setItemData(data);
        // } else {
        //   router.push("/logIn");
        // }

        // if (error) {
        //   throw new Error("");
        // }
      }
      if (itemList) {
        setItemList(sortData(itemList));
        setTotalPrice(totalPrice);
      }
  }, []);
  return { userData, itemList, totalPrice, getItemList };
};
