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
                stroke: "rgb(var(--foreground-rgb))",
              },
            },
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "rgb(var(--foreground-rgb))",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgb(var(--foreground-rgb))",
          [`&.Mui-focused.${inputLabelClasses.root}`]: {
            color: "rgb(var(--foreground-rgb))",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "rgb(var(--foreground-rgb))",
        },
        root: {
          color: "rgb(var(--foreground-rgb))",
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "rgb(var(--foreground-rgb))",
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "rgb(var(--foreground-rgb))",
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
    MuiButton: {
      styleOverrides: {
        outlined: {
          color: "var(--accent)",
        },
      },
    },
  },

  typography: {
    body1: {
      fontWeight: 300,
    },
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
