import "react-datepicker/dist/react-datepicker.css";

import ReactDatePicker from "react-datepicker";
import type { Control, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

type Props<T> = {
  name: Path<T>;
  error?: string;
  control: Control<T>;
  defaultDate?: Date;
  timeIntervals?: number;
};
const Today = new Date();

export const DatePicker = <T,>(props: Props<T>) => {

  return (
    <>
      <div className="block p-1 text-white">
        <Controller
          control={props.control}
          name={props.name}
          render={({ field: { onChange, value } }) => {
            return (
              <ReactDatePicker
                dateFormat="yyyy.MM/dd"
                onChange={onChange}
                className="px-1 w-28 text-center bg-white bg-opacity-0 cursor-pointer"
                timeIntervals={props.timeIntervals}
                selected={!value ? props.defaultDate : (value as Date)}
                maxDate={Today}
              />
            );
          }}
        />
      </div>
      <span>{props.error}</span>
    </>
  );
};

DatePicker.defaultProps = {
  timeIntervals: 15,
  defaultDate: Today,
};
