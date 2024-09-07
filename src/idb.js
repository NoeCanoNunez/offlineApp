import { openDB } from 'idb';

const DB_NAME = 'offline-reports';
const DB_VERSION = 2; // Incrementamos la versión para que se ejecute la actualización
const STORE_NAME = 'reports';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
    }
    
    // Si estamos actualizando desde la versión 1, necesitamos migrar los datos
    if (oldVersion < 2) {
      const store = transaction.objectStore(STORE_NAME);
      store.openCursor().then(function iterateCursor(cursor) {
        if (!cursor) return;
        
        const report = cursor.value;
        if (report.image && !report.images) {
          report.images = [report.image];
          delete report.image;
          store.put(report);
        }
        
        return cursor.continue().then(iterateCursor);
      });
    }
  },
});

export async function saveReportOffline(report) {
  const db = await dbPromise;
  // Aseguramos que el reporte tenga la estructura correcta
  const reportToSave = {
    ...report,
    images: Array.isArray(report.images) ? report.images : [],
    synced: false,
    timestamp: Date.now(),
  };
  await db.put(STORE_NAME, reportToSave);
}

export async function getOfflineReports() {
  const db = await dbPromise;
  return await db.getAll(STORE_NAME);
}

export async function getOfflineReportById(id) {
  const db = await dbPromise;
  return await db.getAll(STORE_NAME, id);
}

export async function updateReportSyncStatus(id, synced) {
  const db = await dbPromise;
  const report = await db.get(STORE_NAME, id);
  if (report) {
    report.synced = synced;
    await db.put(STORE_NAME, report);
  }
}

export async function deleteReport(id) {
  const db = await dbPromise;
  await db.delete(STORE_NAME, id);
}