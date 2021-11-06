/* eslint-disable react-hooks/exhaustive-deps */
import "tailwindcss/tailwind.css";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import type { ReactElement, ReactNode } from "react";
import { useEffect } from "react";
// import { HomeLayout } from "src/layouts/homeLayout";
// import { LogIn } from "src/components/logIn";
import { client } from "src/libs/supabase";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component: NextPageWithLayout;
};

const MyApp = (props: AppPropsWithLayout) => {
  const user = client.auth.user();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await client.auth.signIn({
      provider: "google",
    });

    if (error) {
      throw new Error("");
    }
  };

  const getLayout =
    props.Component.getLayout ??
    ((page) => {
      return page;
    });

  // console.log(props.Component.getLayout);

  // return getLayout(<props.Component {...props.pageProps} />);

  return user ? (
    getLayout(<props.Component {...props.pageProps} />)
  ) : (
    <>
      <button onClick={signInWithGoogle}>signIn</button>
      {/* <LogIn /> */}
    </>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
