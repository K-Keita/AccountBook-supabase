/* eslint-disable react-hooks/exhaustive-deps */
import "tailwindcss/tailwind.css";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import type { ReactElement, ReactNode } from "react";
import { useEffect } from "react";
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

  const getLayout =
    props.Component.getLayout ??
    ((page) => {
      return page;
    });

  useEffect(() => {
    if (!user) {
      router.push("/logIn");
    }
  }, [user]);

  return getLayout(<props.Component user={user} {...props.pageProps} />);
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
