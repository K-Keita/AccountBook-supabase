import { useCallback } from "react";
import { useToggleModal } from "src/hooks/useToggleModal";
import type { ItemData, UserData } from "src/interface/type";
import { client } from "src/libs/supabase";

import { EditDialog } from "./editDialog";

type Props = {
  item: ItemData;
  userData: UserData;
  getItemList: (id: string, year: number, month: number) => void;
};

const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;

const colors = [
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
  "rgb(153, 102, 255)",
  "rgb(201, 203, 207)",
];

export const ItemCard = (props: Props) => {
  const { isOpen, openModal, closeModal } = useToggleModal();

  const handleRemove = useCallback(async () => {
    if (!confirm("削除しますか？")) {
      return false;
    }
    const { error } = await client
      .from("purchasedItem")
      .delete()
      .eq("id", props.item.id);
    if (error) {
      alert(error);
    }
    props.getItemList(props.userData.id.toString(), year, month);
    closeModal();
  }, [props, closeModal]);

  //アイテムのアップデート
  const handleSave = useCallback(
    async (price, memo, category, dateTime) => {
      if (price == "") {
        alert("金額を入力してください");
        return;
      }

      if (category == "") {
        alert("カテゴリーを選択してください");
        return;
      }

      if (dateTime === "test") {
        return;
      }

      const { error } = await client.from("purchasedItem").upsert({
        id: props.item.id,
        userID: props.item.userID,
        buyDate: props.item.buyDate,
        categoryID: category,
        price: price,
        description: memo,
      });

      if (error) {
        alert(error);
      }
      props.getItemList(props.userData.id.toString(), year, month);
      closeModal();
    },
    [props, closeModal]
  );

  const date = `${props.item.buyDate[1]}/${props.item.buyDate[2]}`;

  const color =
    colors[props.userData.categoryList.indexOf(props.item.categoryID)];

  return (
    <>
      <div className="py-1 px-2 my-2 mx-1 text-lg text-white bg-item bg-opacity-60 rounded-lg cursor-pointer">
        <div className="flex mb-1 border-b">
          <p className="px-2 mr-1 w-20 text-lg font-bold text-left">
            ¥{props.item.price.toLocaleString()}
          </p>
          <p className="ml-auto w-16">{date}</p>
          <button className="px-2 my-1 border-r border-l" onClick={openModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-blue-400 hover:text-blue-500 hover:animate-jello-horizontal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button className="px-2 my-1" onClick={handleRemove}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-red-400 hover:text-red-500 hover:animate-jello-horizontal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
        <div className="flex py-1">
          <p className="ml-1 text-sm">{props.item.description}</p>
          <p
            className="px-1 ml-auto w-20 max-h-sm text-sm text-center"
            style={{ border: `solid 1px ${color}` }}
          >
            {props.item.categoryID}
          </p>
        </div>
      </div>

      <EditDialog
        isOpen={isOpen}
        title="商品編集"
        price={props.item.price}
        memo={props.item.description}
        closeModal={closeModal}
        userData={props.userData}
        getItemList={props.getItemList}
        handleSave={handleSave}
      />
    </>
  );
};
