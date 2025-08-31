import openDB from "./db";

export default async function favouriteLastSearch() {
  try {
    /** @type {IDBDatabase} */
    const db = await openDB();
    const tx = db.transaction(["searches"], "readwrite");
    const store = tx.objectStore("searches");

    const cursorRequest = store.openCursor(null, "prev");

    cursorRequest.onsuccess = function (event) {
      /** @type {IDBCursorWithValue} */
      const cursor = event.target.result;

      if (cursor) {
        const value = cursor.value;
        value.favourite = true;

        const requestLastSearchUpdate = cursor.update(value);

        requestLastSearchUpdate.onsuccess = function () {
          console.log("Values:", value);
        };

        requestLastSearchUpdate.onerror = function (event) {
          console.log("Cursor update error:", event.target.error);
        };
      }
    };

    cursorRequest.onerror = function (event) {
      console.log("Cursor error:", event.target.error);
    };
  } catch (error) {
    console.log("DB Error:", error);
  }
}
