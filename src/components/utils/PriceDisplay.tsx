type Props<T> = {
  totalPrice: T;
  targetAmount: T;
  totalItemsPrice: T;
  // nowAverage: T;
};

export const PriceDisplay = (props: Props<number>) => {
  return (
    <div className="px-4 flex py-3">
      <div className="py-1 w-1/2 mx-2 rounded-sm border-r">
        <p className="text-sm px-3">Total</p>
        <h3 className="text-2xl tracking-wide text-center">
          <span className="text-xl">¥ </span>
          {props.totalPrice.toLocaleString()}
        </h3>
        <p className="text-xs text-center">
          残り：¥
          {(props.targetAmount - props.totalPrice).toLocaleString()}
        </p>
      </div>
      <div className="py-2 pb-4 mx-2 ml-auto w-1/2 rounded-sm">
        <p className="text-sm px-3">Today</p>
        <h3 className="text-2xl tracking-wide text-center">
          <span className="text-xl">¥ </span>
          {props.totalItemsPrice.toLocaleString()}
        </h3>
      </div>
    </div>
  );
};
