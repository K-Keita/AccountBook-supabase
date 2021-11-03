import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { client } from "src/libs/supabase";
// import { DatePicker } from "src/components/utils/DatePicker";

type Props = {
  item: any;
  userData: any;
  uuid: string;
  getItemList: (year: number, month: number) => void;
};

type FormValues = {
  price: number;
  memo: string;
  category: string;
  datetime: string;
};

const d = new Date();
const year = d.getFullYear();
const month = d.getMonth() + 1;

const colors = ["red", "blue", "green", "orange", "gray", "pink", "yellow"];

export const ItemCard = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    register,
    // control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    handleSave(data.price, data.memo, data.category);
  };

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

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
    props.getItemList(year, month);
    closeModal();
  }, [props, closeModal]);

  const handleSave = useCallback(
    async (price, memo, category) => {
      if (price == "") {
        alert("Input price as an integer.");
        return;
      }

      if (category == "") {
        alert("Input ISBN number.");
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
      props.getItemList(year, month);
      closeModal();
    },
    [props, closeModal]
  );

  const date = `${props.item.buyDate[1]}/${props.item.buyDate[2]}`;

  // const defaultDate = new Date(`${props.item.buyDate[0]}/${props.item.buyDate[1]}/${props.item.buyDate[2]}`)

  const color =
    colors[props.userData.categoryList.indexOf(props.item.categoryID)];

  return (
    <>
      <div className="p-2 m-1 text-lg text-white bg-item bg-opacity-60 rounded-xl cursor-pointer">
        <div className="flex border-b">
          <p className="px-2 w-20 text-lg font-bold text-left">
            ¥{props.item.price.toLocaleString()}
          </p>
          <p className="ml-auto w-16">{date}</p>
          <p
            className="px-1 my-1 mr-2 w-20 text-sm text-center"
            style={{ border: `solid 1px ${color}` }}
          >
            {props.item.categoryID}
          </p>
          <button className="px-2 my-1 border-r border-l" onClick={openModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-blue-400"
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
              className="w-6 h-6 text-red-400"
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
        <div className="flex">
          <p className="py-1 ml-3 text-sm">{props.item.description}</p>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="overflow-y-auto fixed inset-0 z-40"
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
                  編集
                </Dialog.Title>
                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                  <p>Price</p>
                  <input
                    defaultValue={props.item.price}
                    autoFocus
                    type="number"
                    {...register("price", { required: true, min: 0 })}
                    className="col-span-3 p-2 w-full h-10 bg-white rounded hover:border shadow appearance-none"
                  />
                  {errors.price && <span>This field is required</span>}
                  {/* <DatePicker
                    name="datetime"
                    defaultDate={defaultDate}
                    control={control}
                    error={errors.datetime?.message}
                  /> */}
                  <p>Memo</p>
                  <input
                    defaultValue={props.item.description}
                    autoFocus
                    {...register("memo")}
                    className="col-span-3 p-2 w-full h-10 bg-white rounded hover:border shadow appearance-none"
                  />
                  <select {...register("category")} defaultValue={props.item.categoryID}>
                    {props.userData?.categoryList?.map((value: string) => {
                      return (
                        <option
                          value={value}
                          key={value}
                        >
                          {value}
                        </option>
                      );
                    })}
                  </select>
                  <div className="flex justify-around mt-3">
                    <input
                      type="submit"
                      value="save"
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
