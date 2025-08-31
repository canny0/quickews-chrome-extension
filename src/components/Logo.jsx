import {
  Group,
  Image,
  Text,
  ThemeIcon,
  useComputedColorScheme,
} from "@mantine/core";
import LogoSrc from "/logo.svg";

export default function Logo() {
  const colorScheme = useComputedColorScheme(undefined, {
    getInitialValueInEffect: true,
  });
  return (
    <Group
      component="a"
      td={"none"}
      align="center"
      gap={8}
      href="https://quickews.pages.dev/"
    >
      <ThemeIcon size="2rem" variant="transparent">
        <Image src={LogoSrc} />
      </ThemeIcon>
      <Text c={colorScheme === "light" ? "dark.7" : "gray.1"} size="1.8rem">
        QuickEWS
      </Text>
    </Group>
  );
}
