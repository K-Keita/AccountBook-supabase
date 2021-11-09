import "react-datepicker/dist/react-datepicker.css";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { DatePicker } from "src/components/utils/datePicker";
import type { UserData } from "src/interface/type";
import { client } from "src/libs/supabase";

import { PrimaryButton } from "./utils/primaryButton";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  userData: UserData;
  getItemList: (year: number, month: number) => void;
};
const d = new Date();

const year = d.getFullYear();
const month = d.getMonth() + 1;
const day = d.getDate();
const hours = d.getHours();

type FormValues = {
  price: number;
  memo: string;
  category: string;
  dateTime: string;
};

export const AddItem = (props: Props) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addItem(data.price, data.memo, data.category, data.dateTime);
  };

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
          props.getItemList(year, month);
          props.closeModal();
        }
      }
    },
    [props]
  );

  return (
    <>
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        onClick={openModal}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
      <p className="text-xs text-center">registration</p> */}

      <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="overflow-y-auto fixed inset-0 z-50"
          onClose={props.closeModal}
        >
          <div className="relative px-3 text-center border-2">
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
              <div
                style={{ fontFamily: "游明朝体" }}
                className="inline-block overflow-hidden p-6 py-10 w-full text-left align-middle bg-gradient-to-r from-indigo-300 to-purple-400 rounded-xl border border-gray-300 shadow-xl transition-all transform"
              >
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-center text-gray-900"
                >
                  商品追加
                </Dialog.Title>
                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                  <p>Price</p>
                  <input
                    defaultValue={""}
                    autoFocus
                    type="number"
                    {...register("price", { required: true, min: 0 })}
                    className="col-span-3 p-1 w-full bg-white rounded hover:border"
                  />
                  {errors.price && (
                    <span className="text-xs text-red-500">必須項目です</span>
                  )}
                  <p>Category</p>
                  <select
                    {...register("category")}
                    className="block p-2 mb-3 w-full text-lg"
                  >
                    {props.userData?.categoryList?.map((value: string) => {
                      return (
                        <option value={value} key={value}>
                          {value}
                        </option>
                      );
                    })}
                  </select>
                  <p>Memo</p>
                  <input
                    defaultValue={""}
                    autoFocus
                    {...register("memo")}
                    className="p-1 mb-3 w-full bg-white rounded hover:border"
                  />
                  <div className="absolute top-0 w-32">
                    <DatePicker
                      name="dateTime"
                      control={control}
                      error={errors.dateTime?.message}
                    />
                  </div>
                  <div className="flex justify-around mt-3">
                    <PrimaryButton text="Add" onClick={() => {handleSubmit(onSubmit)}} />
                    <PrimaryButton text="Cancel" onClick={props.closeModal} />
                    {/* <input
                      type="submit"
                      value="Add"
                      className="table p-1 mx-4 w-16 text-sm border border-green-400 cursor-pointer"
                    />
                    <input
                      type="reset"
                      onClick={props.closeModal}
                      className="table p-1 mx-4 w-16 text-sm border border-green-400 cursor-pointer"
                      value="Cancel"
                    /> */}
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
