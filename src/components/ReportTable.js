import React, { useState, useEffect } from "react";
import { getOfflineReports } from "../idb"; // Asegúrate de que esta función esté disponible
import syncReports from "../sync"; // Asegúrate de importar la función de sincronización

function ReportTable() {
  const [reports, setReports] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Estado para ver si está online
  const [loading, setLoading] = useState(false); // Estado para mostrar el loader

  // Obtener reportes de IndexedDB cuando el componente se monta
  useEffect(() => {
    async function fetchReports() {
      const storedReports = await getOfflineReports();
      setReports(storedReports);
    }
    fetchReports();
  }, []);

  // Escuchar cambios en la conexión online/offline
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  // Función para sincronizar manualmente
  const handleSync = async () => {
    console.log(reports);
    if (isOnline) {
      setLoading(true); // Mostrar el loader
      await syncReports(); // Sincroniza los reportes
      const updatedReports = await getOfflineReports(); // Vuelve a obtener los reportes actualizados
      setReports(updatedReports); // Actualiza el estado de los reportes para que se refleje en la tabla
      setLoading(false); // Ocultar el loader
    } else {
      alert("No estás online. Conéctate para sincronizar los reportes.");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Historial de Reportes Añadidos</h2>
      {loading ? (
        <div className="flex justify-center my-4">
          <div className="ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
          <div class="w-16 h-16 border-4 border-solid border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Descripción</th>
              <th className="py-2 px-4 text-left">Imagen</th>
              <th className="py-2 px-4 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4">{report.description}</td>
                  <td className="py-2 px-4">{report.image.name}</td>
                  <td className="py-2 px-4">
                    {report.synced ? "Sincronizado" : "Pendiente"}
                  </td>{" "}
                  {/* Mostrar el estado correcto */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center">
                  No hay reportes almacenados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Botón para sincronizar manualmente */}
      <button
        onClick={handleSync}
        className={`mt-4 py-2 px-4 font-bold text-white ${
          isOnline ? "bg-blue-500" : "bg-gray-500 cursor-not-allowed"
        } rounded-md shadow-lg`}
        disabled={!isOnline} // Deshabilitar el botón si está offline
      >
        {isOnline
          ? "Sincronizar Reportes Manualmente"
          : "Sincronización no disponible"}
      </button>
    </div>
  );
}

export default ReportTable;
