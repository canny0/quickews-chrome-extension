import openDB from "./db";

export default async function saveHistory(
  { code, session, year, version, url },
  envokationMethod
) {
  try {
    /** @type {IDBDatabase} */
    const db = await openDB();
    const tx = db.transaction(["searches"], "readwrite");
    const store = tx.objectStore("searches");

    store.add({
      code,
      session,
      year,
      version,
      url,
      favourite: false,
      date: Date.now(),
    });

    const apiUrl = new URL(__API_URL__);
    apiUrl.pathname = "/v1/searches";

    let plevel;

    if (Number(code) < 1000 && Number(code) >= 400) {
      plevel = "IGCSE";
    } else if (Number(code) >= 9000) {
      plevel = "A-Level";
    } else if (Number(code) < 4000 && Number(code) >= 1000) {
      plevel = "Pre-U";
    } else {
      plevel = "Other";
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify({
        exam_board: "CIE",
        level: plevel,
        feature: envokationMethod,
        website: url,
      }),
      headers: { "Content-Type": "application/json" },
    });
    console.log(response.status);
  } catch (error) {
    console.log("Search object store error:", error);
  }
}
