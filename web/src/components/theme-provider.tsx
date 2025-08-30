"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { RecoilRoot } from "recoil";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <RecoilRoot>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </RecoilRoot>
  );
}
