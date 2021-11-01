import { useEffect, useState } from "react";
import { client } from "src/libs/supabase";

export const useUser = () => {
  const [session, setSession] = useState();

  useEffect(() => {
    const { data: authListener } = client.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  // function signInWithGithub() {
  //   supabase.auth.signIn({ provider: "github" });
  // }

  // function signOut() {
  //   supabase.auth.signOut();
  // }


  return {
    session,
    // signInWithGithub,
    // signOut,
  };
}
