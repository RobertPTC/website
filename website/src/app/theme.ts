"use client";
import type {} from "@mui/x-date-pickers/themeAugmentation";

import {
  inputLabelClasses,
  outlinedInputClasses,
  autocompleteClasses,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";

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
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          [`.${autocompleteClasses.endAdornment} svg`]: {
            fill: "rgb(var(--foreground-rgb))",
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
        text: {
          textTransform: "none",
          fontSize: "1rem",
          color: "rgb(var(--foreground-rgb))",
          fontWeight: 300,
          "&:hover": {
            background: "transparent",
          },
        },
        outlined: {
          color: "var(--accent)",
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
  },

  typography: {
    h1: {
      lineHeight: "3rem",
    },
    body1: {
      fontWeight: 300,
      lineHeight: "1.75rem",
    },
    allVariants: {
      fontFamily: "var(--roboto-font)",
      color: "rgb(var(--foreground-rgb))",
    },
  },
});

export default theme;
