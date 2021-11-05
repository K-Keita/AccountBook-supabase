export type UserData = {
  id: number;
  userID: string;
  category: string;
  title: string;
  userName: string;
  categoryList: string[];
  targetAmount: number;
};

export type ItemData = {
  id: number;
  userID: string;
  createdAt: string;
  volume: number;
  isbn: number;
  categoryID: string;
  buyDate: string[];
  price: number;
  description: string;
};
