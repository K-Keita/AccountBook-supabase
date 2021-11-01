import "tailwindcss/tailwind.css";

import { useState, useEffect } from "react";
import { Auth } from "@supabase/ui";
import type { AppProps } from "next/app";
import PropTypes from "prop-types";
import { LayoutWrapper } from "src/layouts/layoutWrapper";
import { client } from "src/libs/supabase";

const MyApp = (props: AppProps): JSX.Element => {
  // const { user } = Auth.useUser();
  const [session, setSession] = useState<any>();
  useEffect(() => {
    client.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    // return () => {
    //   authListener.unsubscribe();
    // };
  }, []);

  console.log(session);

  return (
    <LayoutWrapper>
      {/* <Auth.UserContextProvider supabaseClient={client}> */}
      <props.Component {...props.pageProps} />
      {/* </Auth.UserContextProvider> */}
    </LayoutWrapper>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
