import { ItemCard } from "src/components/itemCard";
import type { UserData } from "src/pages/category";

type Props = {
  items: UserData[];
  userData: any;
  uuid: string;
  getItemList: VoidFunction;
};

export const ItemList = (props: Props) => {
  return (
    <div>
      {props.items.map((item) => {
        return (
          <div key={item.id}>
            <ItemCard
              item={item}
              userData={props.userData}
              uuid={props.uuid}
              getItemList={props.getItemList}
            />
          </div>
        );
      })}
    </div>
  );
};
