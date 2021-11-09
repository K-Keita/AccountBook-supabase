import {useCallback,useState} from 'react';

const d = new Date();
const y = d.getFullYear();
const m = d.getMonth() + 1;

export const useChangeMonth = () => {
  const [year, setYear] = useState<number>(y);
  const [month, setMonth] = useState<number>(m);

  //前の月へ
  const prevMonth = useCallback(() => {
    if (month === 1) {
      setYear((year) => {
        return year - 1;
      });
      setMonth(12);
      return;
    }
    setMonth((month) => {
      return month - 1;
    });
  }, [month]);

  //次の月へ
  const nextMonth = useCallback(() => {
    if (month === m && year === y) {
      return false;
    } else if (month === 12) {
      setYear((year) => {
        return year - 1;
      });
      setMonth(1);
      return;
    }

    setMonth((month) => {
      return month + 1;
    });
  }, [month, year]);

  return {year, month, prevMonth, nextMonth}
}
