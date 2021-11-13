import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useToggleModal } from "src/hooks/useToggleModal";
import type { UserData } from "src/interface/type";
import { client } from "src/libs/supabase";

import { PrimaryButton } from "./utils/primaryButton";

type Props = {
  getItemList: (id: string, year: number, month: number) => void;
  userData: UserData;
  category: string;
};

type FormValue = {
  categoryName: string;
};

const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;

export const EditCategory = (props: Props) => {
  const { isOpen, openModal, closeModal } = useToggleModal();

  const { register, handleSubmit } = useForm<FormValue>();

  const onSubmit: SubmitHandler<FormValue> = (data) => {
    editCategoryName(data.categoryName, props.category);
  };

  //アイテムの削除
  const removeItems = useCallback(
    async (categoryID, userID) => {
      const { error } = await client
        .from("purchasedItem")
        .delete()
        .eq("categoryID", categoryID)
        .eq("userID", userID);
      if (error) {
        alert(error);
      }
      props.getItemList(props.userData.userID.toString(), year, month);
      closeModal();
    },
    [props, closeModal]
  );

  //カテゴリーの削除
  const removeCategory = async (value: string) => {
    if (
      !confirm(
        "削除しますが、よろしいですか？ *このカテゴリーに属している商品も削除されます。"
      )
    ) {
      return false;
    }
    if (props.userData) {
      const arr = props.userData.categoryList;

      const newArr = arr.filter((v: any) => {
        return v !== value;
      });

      const { error } = await client.from("users").upsert({
        id: props.userData.id,
        userID: props.userData.userID,
        categoryList: newArr,
      });

      if (error) {
        alert(error);
      }

      removeItems(value, props.userData.userID);

      props.getItemList(props.userData.id.toString(), year, month);
    }
  };

  //カテゴリー名の変更
  const editCategoryName = async (newValue: string, prevValue: string) => {
    if (newValue === prevValue) {
      return false;
    }
    if (props.userData) {
      const list = props.userData.categoryList;
      if (list.indexOf(newValue) !== -1) {
        alert("すでに同じカテゴリー名があります");
        return false;
      }

      const arr = props.userData.categoryList;
      const num = arr.indexOf(prevValue);

      arr.splice(num, 1, newValue);

      const { error } = await client.from("users").upsert({
        id: props.userData.id,
        userID: props.userData.userID,
        categoryList: arr,
      });

      if (error) {
        alert(error);
        return false;
      }

      editItems(newValue, prevValue);
    }
  };

  //アイテムのカテゴリー名の変更
  const editItems = async (newValue: string, prevValue: string) => {
    const { error } = await client
      .from("purchasedItem")
      .update({
        categoryID: newValue,
      })
      .match({ categoryID: prevValue, userID: props.userData.userID });

    if (error) {
      alert(error);
      return false;
    }


    props.getItemList(props.userData.userID.toString(), year, month);
    closeModal();
  };

  return (
    <>
      <div className="flex justify-around">
        <button className="px-2 border-r" onClick={openModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.3}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          className="px-2"
          onClick={() => {
            removeCategory(props.category);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.3}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="overflow-y-auto fixed inset-0 z-50"
          onClose={closeModal}
        >
          <div className="px-4 text-center border-2">
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block overflow-hidden p-6 my-6 w-full align-middle bg-gray-50 rounded-xl border border-gray-300 transition-all transform">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-center text-gray-900"
                >
                  CategoryName
                </Dialog.Title>
                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                  <input
                    defaultValue={props.category}
                    autoFocus
                    {...register("categoryName")}
                    className="col-span-3 p-2 w-full h-10 bg-white rounded hover:border shadow appearance-none"
                  />
                  <div className="flex justify-around mt-3">
                    {/* <input
                      type="submit"
                      value="Change"
                      className="table p-1 mx-4 text-sm border border-green-400 cursor-pointer"
                    />
                    <input
                      type="reset"
                      onClick={closeModal}
                      className="table p-1 mx-4 text-sm border border-green-400 cursor-pointer"
                      value="Cancel"
                    /> */}
                    <PrimaryButton
                      text="Change"
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                    />
                    <PrimaryButton
                      type="reset"
                      text="Cancel"
                      onClick={closeModal}
                    />
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
