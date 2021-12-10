import type { ItemData } from "src/interface/type";

type Props = {
  itemList: ItemData[];
  totalPrice: number;
  categoryList: string[];
};

export const ByCategoryContainer = (props: Props) => {
  return (
    <section className="border-white sm:w-1/3 sm:h-screen sm:border-l">
      <h2 className="px-4 text-4xl font-bold">By Category</h2>
      <p className="p-4 text-lg text-right">
        合計<span>({props.itemList.length})</span>:{""}
        <span className="mx-3 text-xl font-bold">
          ¥{props.totalPrice?.toLocaleString()}
        </span>
      </p>
      <div className="pb-28">
        {props.categoryList.map((category) => {
          const arr = props.itemList.filter((value) => {
            return value.categoryID === category;
          });
          const totalPrice = arr.reduce((sum, element) => {
            return sum + element.price;
          }, 0);
          return (
            <div
              className="flex justify-between p-1 my-5 mx-auto w-10/12 border-b"
              key={category}
            >
              <p className="text-lg">
                {category}
                <span className="mx-1">({arr.length})</span>
              </p>
              <p>¥{totalPrice.toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
