import "react-datepicker/dist/react-datepicker.css";

import ReactDatePicker from "react-datepicker";
import type { Control, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

type Props<T> = {
  label: string;
  name: Path<T>;
  error?: string;
  control: Control<T>;
  timeIntervals?: number;
};

export const DatePicker = <T,>(props: Props<T>) => {
  const Today = new Date();

  return (
    <>
      <label htmlFor={props.name}>{props.label}</label>
      <div className="table p-1 text-blue-500 border border-blue-400">
        <Controller
          control={props.control}
          name={props.name}
          render={({ field: { onChange, value } }) => {
            return (
              <ReactDatePicker
                dateFormat="yyyy.MM/dd"
                timeIntervals={props.timeIntervals}
                onChange={onChange}
                selected={!value ? Today : (value as Date)}
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
