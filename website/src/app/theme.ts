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
                stroke: "white",
              },
            },
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "white",
          [`&.Mui-focused.${inputLabelClasses.root}`]: {
            color: "white",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "white",
        },
        root: {
          color: "white",
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "white",
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: "white",
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
