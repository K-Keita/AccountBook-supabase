type Props = {
  changeMonthButton: JSX.Element;
  graph: JSX.Element;
};

export const ChartContainer = (props: Props) => {

  return (
    <section className="border-white sm:pt-16">
      <div className="flex justify-between my-3 sm:my-0">
        <h2 className="px-4 text-4xl font-bold">Chart</h2>
        <div className="px-8 mt-5 sm:mt-0">
          {props.changeMonthButton}
        </div>
      </div>
      {props.graph}
    </section>
  );
};
