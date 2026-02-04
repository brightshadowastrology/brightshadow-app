"use client";

import { I18nProvider } from "@react-aria/i18n";
import { type PropsWithChildren } from "react";
import { RouterProvider } from "react-aria-components";
import { useRouter } from "next/navigation";

// Adds all necessary providers from external libraries to the app
const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  return (
    <RouterProvider navigate={router.push}>
      <I18nProvider locale="en">{children}</I18nProvider>
    </RouterProvider>
  );
};

export default AppProvider;
