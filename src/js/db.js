export default function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("quickews", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("searches")) {
        db.createObjectStore("searches", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
