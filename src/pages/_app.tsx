import "tailwindcss/tailwind.css";

import { Auth, Button, IconLogOut } from "@supabase/ui";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const { user } = Auth.useUser();

  return <Component {...pageProps} />;
}
export default MyApp;
