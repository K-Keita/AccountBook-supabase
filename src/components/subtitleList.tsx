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
    {/* <div className="grid grid-cols-3 gap-2 m-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8"> */}
      {/* <AddSubtitle
        userData={props.userData}
        uuid={props.uuid}
        getItemList={props.getItemList}
      /> */}
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
