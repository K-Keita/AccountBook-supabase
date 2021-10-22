import { AddSubtitle } from "src/components/addItem";
import { SubtitleCard } from "src/components/subtitleCard";
import type { Data } from "src/components/titleList";
import type { UserData } from "src/pages/title";

type Props = {
  items: UserData[];
  userData: any;
  uuid: string;
  getItemList: VoidFunction;
};

export const SubtitleList = (props: Props) => {
  return (
    <div className="">
      {props.items.map((item) => {
        return (
          <div key={item.id}>
            <SubtitleCard
              item={item}
              userData={props.userData}
              created_at={item.created_at}
              uuid={props.uuid}
              getItemList={props.getItemList}
            />
          </div>
        );
      })}
    </div>
  );
};
