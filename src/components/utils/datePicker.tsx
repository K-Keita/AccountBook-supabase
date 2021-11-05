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
    // const MyContainer = (props) => {
    //   return (
    //     <div className="bg-blue-500 p-2">
    //       <CalendarContainer className={props.className}>
    //         <div style={{ position: "relative" }}>{props.children}</div>
    //       </CalendarContainer>
    //     </div>
    //   );
    // };

  return (
    <>
      <div className="block p-1 text-blue-500 ">
        <Controller
          control={props.control}
          name={props.name}
          render={({ field: { onChange, value } }) => {
            return (
              <ReactDatePicker
                dateFormat="yyyy.MM/dd"
                onChange={onChange}
                className="px-1 w-28 text-center cursor-pointer"
                timeIntervals={props.timeIntervals}
                selected={!value ? props.defaultDate : (value as Date)}
                maxDate={Today}
                // calendarContainer={MyContainer}
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
