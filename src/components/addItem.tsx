import "react-datepicker/dist/react-datepicker.css";

import { useCallback } from "react";
import type { UserData } from "src/interface/type";
import { client } from "src/libs/supabase";

import { EditDialog } from "./editDialog";

type Props = {
  isOpen: boolean;
  userData: UserData;
  closeModal: () => void;
  getItemList?: (id: string, year: number, month: number) => void;
};
const d = new Date();

const year = d.getFullYear();
const month = d.getMonth() + 1;
const day = d.getDate();
const hours = d.getHours();

export const AddItem = (props: Props) => {
  //商品の追加
  const addItem = useCallback(
    async (price, memo, category, dateTime) => {
      if (price === "") {
        alert("Priceが空です");
        return;
      }

      if (category === "") {
        alert("カテゴリーを選択してください");
        return;
      }

      const buyDate = dateTime
        ? [
            dateTime.getFullYear().toString(),
            (dateTime.getMonth() + 1).toString(),
            dateTime.getDate().toString(),
            hours.toString(),
          ]
        : [year.toString(), month.toString(), day.toString(), hours.toString()];

      const date = dateTime
        ? [
            `year:${dateTime.getFullYear()}`,
            `month:${dateTime.getMonth() + 1}`,
            `day:${dateTime.getDate()}`,
          ]
        : [
            `year:${year.toString()}`,
            `month:${month.toString()}`,
            `day:${day.toString()}`,
          ];

      const { data, error } = await client.from("purchasedItem").insert([
        {
          userID: props.userData.userID,
          categoryID: category,
          price: price,
          description: memo,
          buyDate: buyDate,
          date: date,
        },
      ]);

      if (error) {
        alert(error);
      } else {
        if (data) {
          props.getItemList ? props.getItemList(props.userData.userID.toString(), year, month) : null;
          props.closeModal();
        }
      }
    },
    [props]
  );

  return (
    <>
      <EditDialog
        isOpen={props.isOpen}
        title="商品追加"
        closeModal={props.closeModal}
        userData={props.userData}
        getItemList={props.getItemList}
        handleSave={addItem}
      />
    </>
  );
};
