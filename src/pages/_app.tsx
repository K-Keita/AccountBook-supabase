/* eslint-disable react-hooks/exhaustive-deps */
import "tailwindcss/tailwind.css";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { LayoutWrapper } from "src/layouts/layoutWrapper";
// import { LogIn } from "src/components/logIn";
import { client } from "src/libs/supabase";

const MyApp = (props: AppProps): JSX.Element => {
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

  return (
    <LayoutWrapper>
      {user ? (
        <props.Component {...props.pageProps} />
      ) : (
        <>
          <button onClick={signInWithGoogle}>signIn</button>
          {/* <LogIn /> */}
        </>
      )}
    </LayoutWrapper>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
