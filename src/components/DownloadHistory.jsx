import { Button, Text } from "@mantine/core";

export default function History() {
  async function handleClick() {
    const data = {msg: "hello world"}//await fetch("");
    const jsonObject = { version: 1, data: data };
    const jsonString = JSON.stringify(jsonObject, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const jsonUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = jsonUrl;
    link.download = "history.json";
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.removeChild(link);

    URL.revokeObjectURL(jsonUrl);
  }

  return (
    <>
      <Button onClick={handleClick}>Download History</Button>
      <Text component="p">you can import it in later incase you uninstall or update</Text>
    </>
  );
}
