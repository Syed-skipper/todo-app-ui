"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { system } from "../theme/chakra-system";
import { ThemeModeProvider } from "../context/ThemeModeContext";

export default function AppChakraProvider({ children }) {
  return (
    <ChakraProvider value={system}>
      <ThemeModeProvider>{children}</ThemeModeProvider>
    </ChakraProvider>
  );
}
