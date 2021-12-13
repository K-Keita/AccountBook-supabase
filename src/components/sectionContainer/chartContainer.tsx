import { Graph } from "../Graph";
import { ChangeMonthButton } from "../utils/changeMonthButton";

type Props = {
  prevMonth: () => void;
  nextMonth: () => void;
  month: number;
  priceArr: number[] | undefined;
  categoryList: string[];
};

export const ChartContainer = (props: Props) => {

  return (
    <section className="border-white sm:h-screen sm:border-l">
      <div className="flex justify-between my-3">
        <h2 className="px-4 text-4xl font-bold">Chart</h2>
        <div className="px-8 mt-5 sm:mt-0">
          <ChangeMonthButton
            prevMonth={props.prevMonth}
            nextMonth={props.nextMonth}
            month={props.month}
          />
        </div>
      </div>
      <Graph arr={props.priceArr} labels={props.categoryList} />
    </section>
  );
};
