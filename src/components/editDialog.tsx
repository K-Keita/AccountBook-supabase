import "react-datepicker/dist/react-datepicker.css";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { DatePicker } from "src/components/utils/datePicker";
import type { UserData } from "src/interface/type";

import { PrimaryButton } from "./utils/primaryButton";

type Props = {
  isOpen: boolean;
  title: string;
  price?: number;
  memo?: string;
  userData: UserData;
  closeModal: () => void;
  getItemList?: (id: string, year: number, month: number) => void;
  handleSave: (
    price: number,
    memo: string,
    category: string,
    dateTime: string
  ) => void;
};

type FormValues = {
  price: number;
  memo: string;
  category: string;
  dateTime: string;
};

export const EditDialog = (props: Props) => {
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    props.handleSave(data.price, data.memo, data.category, data.dateTime);
    reset();
  };

  return (
    <Transition appear show={props.isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="overflow-y-auto fixed inset-0 z-50"
        onClose={props.closeModal}
      >
        <div className="relative px-3 text-center w-96 mx-auto">
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
              className="inline-block overflow-hidden px-6 pt-10 pb-6 w-full text-left align-middle bg-blue-800 rounded-xl border border-gray-300 shadow-xl transition-all transform"
            >
              <button
                onClick={props.closeModal}
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
              <Dialog.Title
                as="h3"
                className="text-xl font-medium leading-6 text-center text-white"
              >
                {props.title}
              </Dialog.Title>
              <form
                className="mt-4 text-white"
                onSubmit={handleSubmit(onSubmit)}
              >
                <p>Price</p>
                <input
                  defaultValue={props.price}
                  autoFocus
                  type="number"
                  {...register("price", { required: true, min: 0 })}
                  className="p-1 mb-3 w-full bg-white bg-opacity-40 rounded hover:border"
                />
                {errors.price && (
                  <span className="text-xs text-red-500">必須項目です</span>
                )}
                <p>Category</p>
                <select
                  {...register("category")}
                  className="py-2 px-1 mb-3 w-full bg-white bg-opacity-40 rounded hover:border"
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
                  defaultValue={props.memo}
                  autoFocus
                  {...register("memo")}
                  className="p-1 mb-3 w-full bg-white bg-opacity-40 rounded hover:border"
                />
                <div className="absolute top-0 w-32">
                  <DatePicker
                    name="dateTime"
                    control={control}
                    error={errors.dateTime?.message}
                  />
                </div>

                <div className="flex justify-around mt-3">
                  <PrimaryButton
                    text={
                      <div className="flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1 w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <p>登録</p>
                      </div>
                    }
                    type="submit"
                    onClick={() => {
                      handleSubmit(onSubmit);
                    }}
                  />
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
