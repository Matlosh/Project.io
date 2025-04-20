import { useEffect, useState } from "react";
import { useColorScheme } from "./useColorScheme";
import { NAV_THEME, Theme_Color_Options } from "~/lib/constants";

export function useThemeColor() {
  const { colorScheme } = useColorScheme();
  const [colorOptions, setColorOptions] = useState<Theme_Color_Options>(NAV_THEME[colorScheme]);

  useEffect(() => {
    setColorOptions(NAV_THEME[colorScheme]);
  }, [colorScheme]);

  return {
    colorOptions
  };
}