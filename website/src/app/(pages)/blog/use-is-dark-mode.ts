import { useEffect, useState } from "react";

export default function useColorMode() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>();
  useEffect(() => {
    function onChange(e: MediaQueryListEvent) {
      setIsDarkMode(e.matches);
    }
    if (typeof window !== "undefined") {
      if (!window.matchMedia) {
        return;
      }
      const query = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDarkMode(query.matches);
      query.addEventListener("change", onChange);
      return () => {
        query.removeEventListener("change", onChange);
      };
    }
  }, []);
  return isDarkMode;
}
