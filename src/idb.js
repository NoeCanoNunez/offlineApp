import { openDB } from 'idb';

const dbPromise = openDB('offline-reports', 1, {
  upgrade(db) {
    db.createObjectStore('reports', {
      keyPath: 'id',
      autoIncrement: true,
    });
  },
});

export async function saveReportOffline(report) {
  const db = await dbPromise;
  await db.put('reports', report);
}

export async function getOfflineReports() {
  const db = await dbPromise;
  return await db.getAll('reports');
}
