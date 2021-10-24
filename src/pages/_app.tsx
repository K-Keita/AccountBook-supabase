import "tailwindcss/tailwind.css";

import { Auth } from "@supabase/ui";
import type { AppProps } from "next/app";
import PropTypes from "prop-types";
import { LayoutWrapper } from "src/layouts/layoutWrapper";
import { client } from "src/libs/supabase";

const MyApp = (props: AppProps): JSX.Element => {
  // const { user } = Auth.useUser();

  return (
    <LayoutWrapper>
      <Auth.UserContextProvider supabaseClient={client}>
        <props.Component {...props.pageProps} />
      </Auth.UserContextProvider>
    </LayoutWrapper>
  );
}


MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
