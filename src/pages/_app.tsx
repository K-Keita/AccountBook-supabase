import "tailwindcss/tailwind.css";

// import { useState, useEffect } from "react";
// import { Auth } from "@supabase/ui";
import type { AppProps } from "next/app";
import PropTypes from "prop-types";
import { LayoutWrapper } from "src/layouts/layoutWrapper";
import { client } from "src/libs/supabase";

const MyApp = (props: AppProps): JSX.Element => {
  const user = client.auth.user();
  // const [session, setSession] = useState<any>();
  // useEffect(() => {
  //   client.auth.onAuthStateChange(
  //     (event, session) => {
  //       setSession(session);
  //     }
  //   );

  //   return () => {
  //     authListener.unsubscribe();
  //   };
  // }, []);
  const signInWithGoogle = async () => {
    const { error } = await client.auth.signIn({
      provider: "google",
    });

    // console.log(user, session);
    if (error) {
      throw new Error("");
    }
  };

  // console.log(session);
  if (user) {
    return (
      <LayoutWrapper>
        <props.Component {...props.pageProps} />
      </LayoutWrapper>
    );
  }

  return (
    <div className="w-full sm:w-96">
      {/* <Auth
            supabaseClient={client}
            providers={["google"]}
            // socialColors={true}
          /> */}
      <button onClick={signInWithGoogle}>signIn</button>
    </div>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
