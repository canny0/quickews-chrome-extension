export default async function monthlyActiveUser() {
  const url = new URL(__API_URL__);
  url.pathname = "/v1/mau";

  const response = await fetch(url, {
    method: "POST",
  });
  console.log("status code: " + response.status);
}
