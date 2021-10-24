export type Data = {
  id: number;
  userID: string;
  category: string;
  title: string;
  userName: string;
  categoryList: string[];
  targetAmount: number;
};

export type UserData = {
  id: number;
  userID: string;
  createdAt: string;
  volume: number;
  isbn: number;
  buyDate: string[];
  possession: boolean;
};
