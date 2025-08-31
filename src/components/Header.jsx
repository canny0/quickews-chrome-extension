import { Anchor, Box, Container, Group } from "@mantine/core";
import Logo from "./Logo";
import LightDark from "./LightDark";
import classes from "./Header.module.css";

const routes = [
  { href: "/dashboard/index.html", label: "Dashboard" },
  { href: "/settings/index.html", label: "Settings" },
];

export default function Header() {
  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Logo />
        <Group h="100%">
          <Group gap={0} h="100%">
            {routes.map(({ label, href }) => (
              <Box
                className={classes.linkBox}
                data-active={window.location.pathname === href || undefined}
              >
                <Anchor key={label} href={href} className={classes.link}>
                  {label}
                </Anchor>
              </Box>
            ))}
          </Group>
          <LightDark />
        </Group>
      </Container>
    </header>
  );
}
