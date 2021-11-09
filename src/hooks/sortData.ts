import type { ItemData } from "src/interface/type";

//アイテムの並び変え
export const sortData = (data: ItemData[]) => {
  const arr = data.sort(
    (a: { buyDate: string[] }, b: { buyDate: string[] }) => {
      if (Number(a.buyDate[2]) === Number(b.buyDate[2])) {
        if (Number(a.buyDate[3]) < Number(b.buyDate[3])) {
          return 1;
        } else {
          return -1;
        }
      }
      if (Number(a.buyDate[2]) < Number(b.buyDate[2])) {
        return 1;
      } else {
        return -1;
      }
    }
  );
  return arr;
};
