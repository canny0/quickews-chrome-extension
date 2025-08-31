import { useState } from "react";
import {
  Stepper,
  Button,
  Group,
  Container,
  Box,
  Text,
  Code,
  Stack,
  Image,
} from "@mantine/core";
import classes from "./GuideSteps.module.css";
import Demo from "../../public/quickews-demo-compressed.mp4";
import Dashboard from "../../public/dashboard.png";
import Error from "../../public/error.png";
import Settings from "../../public/settings.png";

export default function GuideSteps() {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Container h="100vh">
      <Stepper
        classNames={{ content: classes["stepper-content"] }}
        mt="4rem"
        active={active}
        onStepClick={setActive}
      >
        <Stepper.Step label="Activate Extension">
          <Stack align="center">
            <Text mt="md" ta="center" size="2.4rem">
              Activate Extension by clicking the extension logo or using the
              <Code fz="2.4rem">Alt+Q</Code> shortcut
            </Text>
            <Box
              w={600}
              bdrs="md"
              style={{ overflow: "hidden", border: "1px solid black" }}
            >
              <video width="100%" style={{ display: "block" }} autoPlay loop>
                <source src={Demo} type="video/mp4" />
              </video>
            </Box>
          </Stack>
        </Stepper.Step>
        <Stepper.Step label="History">
          <Stack align="center">
            <Text mt="md" ta="center" size="2.4rem">
              View, filter, sort, and edit your search history in the options
              page
            </Text>
            <Text ta="center" size="lg">
              Favourite your latest search at anytime and anywhere in your
              browser window using the <Code fz="lg">Alt+S</Code> shortcut
            </Text>
            <Image w={600} radius="md" bd="1px solid" src={Dashboard} />
          </Stack>
        </Stepper.Step>
        <Stepper.Step label="Error Page">
          Error Page
          <Stack align="center">
            <Text mt="md" ta="center" size="2.4rem">
              Error Page
            </Text>
            <Text ta="center" size="lg">
              This page indicates that a website is not supported by the
              extension
            </Text>
            <Image w={600} radius="md" bd="1px solid" src={Error} />
          </Stack>
        </Stepper.Step>
        <Stepper.Step label="Settings">
          <Stack align="center">
            <Text mt="md" ta="center" size="2.4rem">
              Set your preferences the way you like in the extension options
            </Text>
            <Image w={600} radius="md" bd="1px solid" src={Settings} />
          </Stack>
        </Stepper.Step>
      </Stepper>

      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        {active !== 3 && <Button onClick={nextStep}>Next step</Button>}
        {active === 3 && (
          <>
            <Button onClick={() => window.close()}>Close</Button>
            <Button
              onClick={() =>
                window.location.replace(
                  chrome.runtime.getURL("settings/index.html")
                )
              }
            >
              Go To Settings
            </Button>
          </>
        )}
      </Group>
    </Container>
  );
}
