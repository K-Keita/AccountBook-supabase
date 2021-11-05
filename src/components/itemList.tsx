import { ItemCard } from "src/components/itemCard";
import type { ItemData,UserData } from "src/interface/type";


type Props = {
  items: ItemData[];
  userData: UserData;
  getItemList: (year: number, month: number) => void;
};

export const ItemList = (props: Props) => {
  return (
    <div className="overflow-y-scroll my-2 mx-1 h-2lg">
      {props.items
        ? props.items.map((item) => {
            return (
              <div key={item.id}>
                <ItemCard
                  item={item}
                  userData={props.userData}
                  getItemList={props.getItemList}
                />
              </div>
            );
          })
        : null}
    </div>
  );
};
