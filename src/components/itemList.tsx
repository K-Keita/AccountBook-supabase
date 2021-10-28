import { ItemCard } from "src/components/itemCard";
import type { UserData } from "src/interface/type";

type Props = {
  items: UserData[] | null;
  userData: any;
  uuid: string;
  getItemList: (year: number, month: number) => void;
};

export const ItemList = (props: Props) => {
  return (
    <div className="overflow-y-scroll p-1 h-2lg">
      {props.items ? (props.items.map((item) => {
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
      })): null}
    </div>
  );
};
