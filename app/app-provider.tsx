"use client";

import type { ReactNode } from "react";
import { Provider } from "jotai";

type ClientWrapperProps = {
  children: ReactNode;
};

export const ClientWrapper = ({ children }: ClientWrapperProps) => {
  return (
    <Provider>
      {children}
    </Provider>
  );
};
