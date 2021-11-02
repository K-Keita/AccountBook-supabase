import "react-datepicker/dist/react-datepicker.css";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { DatePicker } from "src/components/utils/datePicker";
import { client } from "src/libs/supabase";

type Props = {
  userData: any;
  uuid: string;
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
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addItem(data.price, data.memo, data.category, data.dateTime);
  };

  //モーダルを開く
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  //モーダルを閉める
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

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

      const buyDate = dateTime ? (
        [
          dateTime.getFullYear().toString(),
          (dateTime.getMonth() + 1).toString(),
          dateTime.getDate().toString(),
          hours.toString(),
        ]
      ): (
        [
          year.toString(),
          month.toString(),
          day.toString(),
          hours.toString(),
        ]
      );

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
            userID: props.uuid,
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
            closeModal();
          }
        }
    },
    [props, closeModal]
  );

  return (
    <>
      <button
        className="block p-1 my-4 mx-auto w-24 text-sm text-center rounded-2xl border border-yellow-500 cursor-pointer"
        onClick={openModal}
      >
        登録
      </button>

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
              <div className="inline-block overflow-hidden p-6 my-8 w-full max-w-md text-left align-middle bg-gray-50 rounded-xl border border-gray-300 shadow-xl transition-all transform">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-medium leading-6 text-center text-gray-900"
                >
                  商品追加
                </Dialog.Title>
                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                  <DatePicker
                    name="dateTime"
                    control={control}
                    error={errors.dateTime?.message}
                  />
                  <p>Price</p>
                  <input
                    defaultValue={""}
                    autoFocus
                    type="number"
                    {...register("price", { required: true, min: 0 })}
                    className="col-span-3 p-2 w-full h-10 bg-white rounded hover:border shadow appearance-none"
                  />
                  {errors.price && <span>This field is required</span>}
                  <p>Memo</p>
                  <input
                    defaultValue={""}
                    autoFocus
                    {...register("memo")}
                    className="col-span-3 p-2 w-full h-10 bg-white rounded hover:border shadow appearance-none"
                  />
                  <select {...register("category")}>
                    {props.userData?.categoryList?.map((value: string) => {
                      return (
                        <option value={value} key={value}>
                          {value}
                        </option>
                      );
                    })}
                  </select>
                  <div className="flex justify-around mt-3">
                    <input
                      type="submit"
                      value="Add"
                      className="table p-1 mx-4 text-sm border border-green-400 cursor-pointer"
                    />
                    <input
                      type="reset"
                      onClick={closeModal}
                      className="table p-1 mx-4 text-sm border border-green-400 cursor-pointer"
                      value="Cancel"
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
