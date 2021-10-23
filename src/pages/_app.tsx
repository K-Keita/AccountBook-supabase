import "tailwindcss/tailwind.css";

import { Auth } from "@supabase/ui";
import type { AppProps } from "next/app";
import PropTypes from "prop-types";

const MyApp = (props: AppProps): JSX.Element => {
  // const { user } = Auth.useUser();

  return <props.Component {...props.pageProps} />;
}


MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
