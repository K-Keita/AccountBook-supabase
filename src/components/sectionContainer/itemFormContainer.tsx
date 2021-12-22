import { useCallback } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { DatePicker } from "src/components/utils/datePicker";
import { PrimaryButton } from "src/components/utils/primaryButton";
import type { UserData } from "src/interface/type";
import { client } from "src/libs/supabase";

const d = new Date();

const year = d.getFullYear();
const month = d.getMonth() + 1;
const day = d.getDate();
const hours = d.getHours();

type Props = {
  getItemList: (id: string, year: number, month: number) => Promise<void>;
  userData: UserData;
};

type FormValues = {
  price: number;
  memo: string;
  category: string;
  dateTime: string;
};

export const ItemFormContainer = (props: Props) => {
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

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
          props.getItemList
            ? props.getItemList(props.userData.userID.toString(), year, month)
            : null;
        }
      }
    },
    [props]
  );

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addItem(data.price, data.memo, data.category, data.dateTime);
    reset();
  };

  return (
    <section className="hidden py-2 mx-auto w-80 sm:block">
      <div
        style={{ fontFamily: "游明朝体" }}
        className="inline-block overflow-hidden px-4 w-full text-left align-middle rounded-xl transition-all transform"
      >
        <h3 className="text-2xl font-semibold leading-6 text-white">
          商品追加
        </h3>
        <form className="mt-4 text-white" onSubmit={handleSubmit(onSubmit)}>
          <div className="ml-auto w-32">
            <DatePicker
              name="dateTime"
              control={control}
              error={errors.dateTime?.message}
            />
          </div>
          <p>Price</p>
          <input
            defaultValue={""}
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
            defaultValue={""}
            autoFocus
            {...register("memo")}
            className="p-1 mb-3 w-full bg-white bg-opacity-40 rounded hover:border"
          />
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
    </section>
  );
};
