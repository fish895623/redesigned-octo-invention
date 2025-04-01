declare module "@material-tailwind/react" {
  import { ComponentProps, ReactNode, ElementType } from "react";

  // Common base props that TypeScript complains about
  interface BaseProps {
    placeholder?: string;
    onPointerEnterCapture?: React.PointerEventHandler<any>;
    onPointerLeaveCapture?: React.PointerEventHandler<any>;
    crossOrigin?: string;
    // Add any other commonly missing props here
  }

  // Button component
  export interface ButtonProps extends BaseProps {
    children?: ReactNode;
    variant?: "filled" | "outlined" | "gradient" | "text";
    size?: "sm" | "md" | "lg";
    color?: string;
    fullWidth?: boolean;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit" | "reset";
    title?: string;
  }
  export const Button: React.FC<ButtonProps>;

  // Card components
  export interface CardProps extends BaseProps {
    children?: ReactNode;
    className?: string;
    shadow?: boolean;
  }
  export const Card: React.FC<CardProps>;

  export interface CardHeaderProps extends BaseProps {
    children?: ReactNode;
    className?: string;
    variant?: string;
    color?: string;
    floated?: boolean;
  }
  export const CardHeader: React.FC<CardHeaderProps>;

  export interface CardBodyProps extends BaseProps {
    children?: ReactNode;
    className?: string;
  }
  export const CardBody: React.FC<CardBodyProps>;

  export interface CardFooterProps extends BaseProps {
    children?: ReactNode;
    className?: string;
    divider?: boolean;
  }
  export const CardFooter: React.FC<CardFooterProps>;

  // Typography component
  export interface TypographyProps extends BaseProps {
    children?: ReactNode;
    variant?: string;
    color?: string;
    as?: ElementType;
    className?: string;
    textGradient?: boolean;
    href?: string;
  }
  export const Typography: React.FC<TypographyProps>;

  // Input component
  export interface InputProps extends BaseProps {
    label?: string;
    size?: "md" | "lg";
    value?: string;
    name?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    error?: boolean;
    success?: boolean;
    type?: string;
    className?: string;
    shrink?: boolean;
  }
  export const Input: React.FC<InputProps>;

  // Checkbox component
  export interface CheckboxProps extends BaseProps {
    checked?: boolean;
    disabled?: boolean;
    color?: string;
    label?: ReactNode;
    name?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    className?: string;
    containerProps?: React.HTMLAttributes<HTMLDivElement>;
    labelProps?: React.HTMLAttributes<HTMLLabelElement>;
    iconProps?: React.HTMLAttributes<HTMLElement>;
  }
  export const Checkbox: React.FC<CheckboxProps>;

  // ThemeProvider
  export interface ThemeProviderProps {
    children: ReactNode;
    value?: Record<string, any>;
  }
  export const ThemeProvider: React.FC<ThemeProviderProps>;
}
