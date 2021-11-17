type Props = {
  prevMonth: () => void;
  nextMonth: () => void;
  month: number;
};

export const ChangeMonthButton = (props: Props) => {
  return (
    <section className="flex">
      <button onClick={props.prevMonth}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 hover:text-flower"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
      </button>
      <h2 className="p-2 w-16 text-2xl text-center">{props.month}月</h2>
      <button onClick={props.nextMonth}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 hover:text-flower"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
      </button>
    </section>
  );
};
