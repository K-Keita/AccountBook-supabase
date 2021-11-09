type Props<T> = {
  totalPrice: T;
  targetAmount: T;
  totalItemsPrice: T;
  // nowAverage: T;
};

export const PriceDisplay = (props: Props<number>) => {
  return (
    <div className="flex py-3 px-4">
      <div className="py-1 mx-2 w-1/2 rounded-sm border-r">
        <p className="px-3 text-sm">Total</p>
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
        <p className="px-3 text-sm">Today</p>
        <h3 className="text-2xl tracking-wide text-center">
          <span className="text-xl">¥ </span>
          {props.totalItemsPrice.toLocaleString()}
        </h3>
      </div>
    </div>
  );
};
