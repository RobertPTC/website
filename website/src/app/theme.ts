"use client";
import type {} from "@mui/x-date-pickers/themeAugmentation";

import { inputLabelClasses, outlinedInputClasses } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const theme = createTheme({
  components: {
    MuiDatePicker: {
      defaultProps: {
        slotProps: {
          openPickerIcon: {
            sx: {
              path: {
                stroke: "var(--foreground-rgb)",
              },
            },
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "var(--foreground-rgb)",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "var(--foreground-rgb)",
          [`&.Mui-focused.${inputLabelClasses.root}`]: {
            color: "var(--foreground-rgb)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "var(--foreground-rgb)",
        },
        root: {
          color: "var(--foreground-rgb)",
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "var(--foreground-rgb)",
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "var(--foreground-rgb)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          shrink: true,
        },
      },
    },
  },

  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
