import { openDB } from "idb";

const DB_NAME = "offline-reports";
const DB_VERSION = 2; // Incrementamos la versión para que se ejecute la actualización
const REPORT_STORE_NAME = "reports";
const USER_STORE_NAME = "users";

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    // Crear el object store para reportes si no existe
    if (!db.objectStoreNames.contains(REPORT_STORE_NAME)) {
      db.createObjectStore(REPORT_STORE_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });
    }

    // Crear el object store para usuarios si no existe
    if (!db.objectStoreNames.contains(USER_STORE_NAME)) {
      db.createObjectStore(USER_STORE_NAME, {
        keyPath: "dni", // Usaremos el 'dni' como clave principal
      });
    }
  },
});

// Función para registrar un nuevo usuario
export async function registerUser(userData) {
  const db = await dbPromise;
  await db.put(USER_STORE_NAME, userData); // IndexedDB tomará automáticamente 'dni' como clave
}

// Función para obtener el usuario registrado
export async function getUser() {
  const db = await dbPromise;
  return await db.getAll('users'); // Devuelve el usuario si está registrado
}

// Función para guardar un reporte offline
export async function saveReportOffline(report) {
  const db = await dbPromise;
  // Aseguramos que el reporte tenga la estructura correcta
  const reportToSave = {
    ...report,
    images: Array.isArray(report.images) ? report.images : [],
    synced: false,
    timestamp: Date.now(),
  };
  await db.put(REPORT_STORE_NAME, reportToSave);
}

// Función para obtener todos los reportes offline
export async function getOfflineReports() {
  const db = await dbPromise;
  return await db.getAll(REPORT_STORE_NAME);
}

// Función para obtener con ID uno de los reportes offline
export async function getOfflineReportById(id) {
  const db = await dbPromise;

  return await db.getAll(REPORT_STORE_NAME, id);
}

//Función para actualizar con ID uno de los reportes offline
export async function updateReportSyncStatus(id, synced) {
  const db = await dbPromise;
  const report = await db.get(REPORT_STORE_NAME, id);
  if (report) {
    report.synced = synced;
    await db.put(REPORT_STORE_NAME, report);
  }
}

//Función para Borrar con ID uno de los reportes offline
export async function deleteReport(id) {
  const db = await dbPromise;
  await db.delete(REPORT_STORE_NAME, id);
}
