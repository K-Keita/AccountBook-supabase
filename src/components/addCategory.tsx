import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useToggleModal } from "src/hooks/useToggleModal";
import type { UserData } from "src/interface/type";
import { client } from "src/libs/supabase";

import { PrimaryButton } from "./utils/primaryButton";

type Props = {
  userData: UserData;
  getItemList: (id: string, year: number, month: number) => void;
};

type FormValue = {
  categoryName: string;
};

const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;

export const AddCategory = (props: Props) => {
  const { isOpen, openModal, closeModal } = useToggleModal();

  const { register, handleSubmit } = useForm<FormValue>();

  const onSubmit: SubmitHandler<FormValue> = (data) => {
    addCategory(data.categoryName);
  };

  const addCategory = async (text: string) => {
    if (text === "") {
      return false;
    }

    if (props.userData) {
      const arr = props.userData.categoryList;
      if (arr.indexOf(text) !== -1) {
        alert("すでに同じカテゴリー名があります");
        return false;
      }
      const newArr = [...arr, text];

      const { error } = await client.from("users").upsert({
        id: props.userData.id,
        userID: props.userData.userID,
        categoryList: newArr,
      });

      if (error) {
        alert(error);
      }
    }

    closeModal();
    props.getItemList(props.userData.userID.toString(), year, month);
  };

  return (
    <>
      <div className="flex justify-end px-8">
        <PrimaryButton
          type="button"
          text={
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mt-1 mr-1 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p>追加</p>
            </div>
          }
          onClick={openModal}
        />
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="overflow-y-auto fixed inset-0 z-50"
          onClose={closeModal}
        >
          <div className="px-4 text-center" style={{ fontFamily: "游明朝体" }}>
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
              <div className="inline-block overflow-hidden p-6 my-6 w-full align-middle bg-blue-800 rounded-xl transition-all transform">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-center text-white"
                >
                  カテゴリー名
                </Dialog.Title>
                <button
                  onClick={closeModal}
                  type="reset"
                  className="absolute top-3 right-3 p-1 text-white hover:text-flower rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.6}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                  <input
                    autoFocus
                    {...register("categoryName")}
                    className="block py-2 px-1 my-5 mx-auto w-11/12 bg-white bg-opacity-40"
                  />
                  <div className="flex justify-around mt-3">
                    <PrimaryButton
                      text="追加"
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
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
