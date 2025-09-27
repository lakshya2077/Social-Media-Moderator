import { extendTheme, theme as base, withDefaultColorScheme } from "@chakra-ui/react";

const fonts = {
  heading: `'Inter', ${base.fonts.heading}`,
  body: `'Inter', ${base.fonts.body}`,
};

const colors = {
  brand: {
    50: "#eef8ff",
    100: "#d6edff",
    200: "#b0dcff",
    300: "#7fc6ff",
    400: "#4aabff",
    500: "#208fff",
    600: "#0a73e6",
    700: "#0559b4",
    800: "#073f7d",
    900: "#072a52",
  },
  surface: {
    50: "#fbfcff",
    100: "#f5f7fe",
    200: "#e9ecfb",
    300: "#d9def6",
    400: "#c1c9ee",
    500: "#a7b3e3",
    600: "#8d9bd0",
    700: "#7380b3",
    800: "#5c6793",
    900: "#495173",
  },
};

const semanticTokens = {
  colors: {
    "bg.canvas": {
      default: "linear-gradient(135deg, #f6f9ff 0%, #eef2ff 100%)",
      _dark: "linear-gradient(135deg, #0b1220 0%, #0f172a 100%)",
    },
    "bg.card": {
      default: "white",
      _dark: "gray.800",
    },
    "text.primary": {
      default: "gray.800",
      _dark: "gray.100",
    },
    "text.muted": {
      default: "gray.600",
      _dark: "gray.400",
    },
    outline: {
      default: "gray.200",
      _dark: "gray.700",
    },
    "brand.solid": {
      default: "brand.600",
      _dark: "brand.400",
    },
  },
};


const components = {
  Button: {
    baseStyle: {
      borderRadius: "lg",
      fontWeight: 600,
    },
    variants: {
      glass: {
        bg: "rgba(255,255,255,0.6)",
        backdropFilter: "saturate(180%) blur(10px)",
        color: "gray.800",
        _dark: {
          bg: "rgba(30,41,59,0.6)",
          color: "gray.100",
        },
        _hover: {
          transform: "translateY(-1px)",
        },
        _active: {
          transform: "translateY(0)",
        },
      },
      brand: {
        bgGradient: "linear(to-r, brand.500, brand.700)",
        color: "white",
        _hover: {
          bgGradient: "linear(to-r, brand.600, brand.800)",
          boxShadow: "md",
        },
        _active: {
          bgGradient: "linear(to-r, brand.700, brand.900)",
        },
      },
      subtle: {
        bg: "surface.100",
        color: "text.primary",
        _dark: { bg: "gray.800", color: "text.primary" },
        _hover: { bg: "surface.200", _dark: { bg: "gray.700" } },
      },
    },
    defaultProps: {
      colorScheme: "brand",
      variant: "brand",
    },
  },
  Input: {
    variants: {
      filled: {
        field: {
          bg: "surface.100",
          _hover: { bg: "surface.200" },
          _focus: {
            borderColor: "brand.400",
            boxShadow: "0 0 0 3px rgba(32,143,255,0.25)",
          },
          _dark: {
            bg: "gray.800",
            _hover: { bg: "gray.700" },
          },
        },
      },
    },
    defaultProps: {
      variant: "filled",
      size: "md",
    },
  },
  Textarea: {
    variants: {
      filled: {
        bg: "surface.100",
        _hover: { bg: "surface.200" },
        _focus: {
          borderColor: "brand.400",
          boxShadow: "0 0 0 3px rgba(32,143,255,0.25)",
        },
        _dark: {
          bg: "gray.800",
          _hover: { bg: "gray.700" },
        },
      },
    },
    defaultProps: {
      variant: "filled",
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: "xl",
        borderWidth: "1px",
        borderColor: "outline",
        bg: "bg.card",
        boxShadow: "sm",
      },
    },
  },
};

const styles = {
  global: {
    "html, body, #root": {
      height: "100%",
    },
    body: {
      color: "text.primary",
      bg: "transparent",
      backgroundImage: "var(--chakra-colors-bg-canvas)",
      backgroundAttachment: "fixed",
      backgroundSize: "cover",
    },
  },
};

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme(
  {
    config,
    fonts,
    colors,
    semanticTokens,
    components,
    styles,
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);

export default theme;
