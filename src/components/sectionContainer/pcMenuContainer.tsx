import { LinkButtonList } from "src/components/LinkButtonList";
import { PriceDisplay } from "src/components/utils/PriceDisplay";
import { Title as TitleArea } from "src/components/utils/title";
import type { ItemData } from "src/interface/type";

// import { LinkBar } from "../utils/LinkBar";

const d = new Date();
const date = d.getDate();

type Props = {
  totalPrice: number;
  targetAmount: number;
  itemList: ItemData[];
}

export const PcMenuContainer = (props: Props) => {
    const item = props.itemList.filter((value) => {
      return value.buyDate[2] === date.toString();
    });
    const totalItemsPrice = item.reduce((sum, element) => {
      return sum + element.price;
    }, 0);

  return (
    <section className="hidden fixed py-2 w-full sm:block sm:relative sm:pt-16 sm:h-screen sm:border-r">
      <h2 className="px-3 text-2xl">TITLE</h2>
      <div className="flex flex-col justify-around h-[70vh]">
        <div className="py-4 px-8">
          <TitleArea />
        </div>
        <PriceDisplay
          totalPrice={props.totalPrice}
          targetAmount={props.targetAmount}
          totalItemsPrice={totalItemsPrice}
        />
        <LinkButtonList />
      </div>
    </section>
  );
};
