import { ActionIcon, Anchor, Container, Group } from "@mantine/core";
import classes from "./Footer.module.css";
import Logo from "./Logo";
import { FaGithub, FaReddit } from "react-icons/fa6";

const links = [
  { href: "/guide/index.html", label: "Startup Guide" },
  { href: "https://quickews.pages.dev/rate-us/", label: "Rate Us" },
  { href: "https://quickews.pages.dev/feedback/", label: "Feedback" },
  { href: "https://quickews.pages.dev/", label: "Our Website" },
];

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <Container size="md" className={classes.inner}>
        <Group justify="space-between" pt="xl" pb="xl">
          <Logo />
          <Group gap="lg">
            {links.map(({ href, label }) => (
              <Anchor key={label} href={href} className={classes.link}>
                {label}
              </Anchor>
            ))}
          </Group>
          <Group>
            <ActionIcon
              component="a"
              href="https://github.com/canny0/quickews"
              variant="default"
              size="lg"
              radius="md"
            >
              <FaGithub size={20} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href=""
              variant="default"
              size="lg"
              radius="md"
            >
              <FaReddit size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}
