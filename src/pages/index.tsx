import { Auth, Button, IconLogOut } from "@supabase/ui";
import type { ReactNode} from "react";
import { useCallback, useEffect, useState } from "react";
import { LayoutWrapper } from "src/components/layoutWrapper";
import type { Data } from "src/components/titleList";
import { TitleList } from "src/components/titleList";
import { client } from "src/libs/supabase";

type Props = {
  children: ReactNode;
};

const getMainData = async () => {
  const { data, error } = await client.from("users").select("*");
  if (!error && data) {
    return data;
  }
  return [];
};

const Container = (props: Props) => {
  const { user } = Auth.useUser();

  const [text, setText] = useState<string>("");
  const [userData, setUserData] = useState<Data[]>([]);

  const getTitleList = useCallback(async () => {
    const data = await getMainData();
    setUserData(data);
  }, []);

  useEffect(() => {
    getTitleList();
  }, [user, getTitleList]);

  if (user) {
    return (
      <div>
        <div className="flex gap-2 justify-center p-4">
          <input
            className="px-4 w-full h-12 bg-white rounded border border-gray-300 hover:border-gray-700 shadow appearance-none"
            placeholder="Filtering text"
            value={text}
            onChange={(e) => {return setText(e.target.value)}}
          />
        </div>
        <TitleList
          userData={userData}
          uuid={user.id}
          getTitleList={getTitleList}
          filterText={text}
        />
        {userData[0]?.categories_list.length > 0 ? (
          userData[0].categories_list.map(value => {
            return (
              <div key={value} >{value}</div>
            )
          })
        ) : null}
        <div className="flex justify-end my-4 mx-2">
          <Button
            size="medium"
            icon={<IconLogOut />}
            onClick={() => {return client.auth.signOut()}}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }
  return <>{props.children}</>;
};

const Home = () => {
  return (
    <LayoutWrapper>
      <Auth.UserContextProvider supabaseClient={client}>
        <Container>
          <div className="flex justify-center pt-8">
            <div className="w-full sm:w-96">
              <Auth
                supabaseClient={client}
                providers={["google"]}
                socialColors={true}
              />
            </div>
          </div>
        </Container>
      </Auth.UserContextProvider>
    </LayoutWrapper>
  );
};

export default Home;
