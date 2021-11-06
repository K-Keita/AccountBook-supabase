import {client} from 'src/libs/supabase';

// 全てのアイテムの取得
export const getItems = async (userID: string, y: number, m: number) => {
  let { data, error } = await client
    .from("users")
    .select("*")
    .eq("userID", userID);

  if (!error && data) {
    const userData = data[0];
    ({ data, error } = await client
      .from("purchasedItem")
      .select("*")
      .contains("date", [`year:${y}`, `month:${m}`])
      .eq("userID", userID));

    const totalPrice = data?.reduce((sum, element) => {
      return sum + element.price;
    }, 0);

    if (!error && data) {
      return { userData: userData, items: data, totalPrice: totalPrice };
    } else {
      return { userData: userData, items: null, totalPrice: null };
    }
  }

  return { userData: null, items: null, totalPrice: null };
};

export const getUserData = async (userID: string) => {
  const { data, error } = await client
    .from("users")
    .select("*")
    .eq("userID", userID);

  if (!error && data) {
    return { userData: data[0] };
  } else {
    return { userData: null };
  }
};
