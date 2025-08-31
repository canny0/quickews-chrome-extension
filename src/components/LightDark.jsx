import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { FaMoon, FaSun } from "react-icons/fa6";
import classes from "./LightDark.module.css";

export default function LightDark() {
  const { setColorScheme } = useMantineColorScheme();
  const colorSheme = useComputedColorScheme();

  return (
    <ActionIcon
      onClick={() => setColorScheme(colorSheme === "light" ? "dark" : "light")}
      variant="default"
      size="lg"
      radius="md"
      aria-label="Toggle color scheme"
    >
      <FaMoon size={20} className={classes.dark} />
      <FaSun size={20} className={classes.light} />
    </ActionIcon>
  );
}
