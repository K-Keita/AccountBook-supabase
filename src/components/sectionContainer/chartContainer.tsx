type Props = {
  changeMonthButton: JSX.Element;
  graph: JSX.Element;
};

export const ChartContainer = (props: Props) => {

  return (
    <section>
      <div className="flex justify-between pt-8 my-3 sm:my-0">
        <h2 className="px-4 text-4xl font-bold">Chart</h2>
        <div className="px-8 mt-5 sm:mt-0">
          {props.changeMonthButton}
        </div>
      </div>
      {props.graph}
    </section>
  );
};
