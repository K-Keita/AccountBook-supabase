import { AddSubtitle } from "src/components/addSubtitle";
import { SubtitleCard } from "src/components/subtitleCard";
import type { Title } from "src/components/titleList";
import type { subtitle } from "src/pages/title";

type Props = {
  items: subtitle[];
  title: Title;
  uuid: string;
  getItemList: VoidFunction;
};

export const SubtitleList = (props: Props) => {

  return (
    <div className="grid grid-cols-3 gap-2 m-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
      <AddSubtitle
        title={props.title}
        uuid={props.uuid}
        getItemList={props.getItemList}
      />
      {props.items.map((subtitle) => {
        return (
          <div key={subtitle.id}>
            <SubtitleCard
              subtitle={subtitle}
              title={props.title}
              created_at={subtitle.created_at}
              uuid={props.uuid}
              getItemList={props.getItemList}
            />
          </div>
        );
      })}
    </div>
  );
};
