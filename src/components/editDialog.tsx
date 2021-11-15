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
                {props.title}
              </Dialog.Title>
              <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                <p>Price</p>
                <input
                  defaultValue={props.price}
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
                  defaultValue={props.memo}
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
                  <PrimaryButton
                    text="Add"
                    type="submit"
                    onClick={() => {
                      handleSubmit(onSubmit);
                    }}
                  />
                  <PrimaryButton
                    type="reset"
                    text="Cancel"
                    onClick={props.closeModal}
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
