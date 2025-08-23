import { Button } from "@mantine/core";
import style from './Button.module.scss'

type ButtonPropsType = {
  variant: string;
  text: string;
  onClick?: () => void;
  color?: string;
  disabled?: boolean;
};

export const ButtonComponent = ({
  onClick,
  disabled = false,
  color,
  variant,
  text,
}: ButtonPropsType) => {
  return (
    <Button
      className={style.buttonCustomStyle}
      onClick={onClick}
      disabled={disabled}
      color={color}
      variant={variant}
    >
      {text}
    </Button>
  );
};
