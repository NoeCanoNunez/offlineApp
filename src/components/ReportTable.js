import React, { useState, useEffect } from "react";
import { getOfflineReports, deleteReport, getOfflineReportById } from "../idb";
import syncReports from "../sync";

function ReportTable() {
  const [reports, setReports] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchReports() {
      const storedReports = await getOfflineReports();
      setReports(storedReports);
    }
    fetchReports();
  }, []);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  const handleSync = async () => {
    if (isOnline) {
      setLoading(true);
      await syncReports();
      const updatedReports = await getOfflineReports();
      setReports(updatedReports);
      setLoading(false);
    } else {
      alert("No estás online. Conéctate para sincronizar los reportes.");
    }
  };

  const handleDelete = async (id) => {
    await deleteReport(id);
    const updatedReports = await getOfflineReports();
    setReports(updatedReports);
  };

  const checkInDatabase = async (id) => {
    // Aquí podrías implementar la lógica para verificar si el reporte está en la base de datos.
    // Por ejemplo, podrías llamar a una API o usar alguna lógica existente.
    const report = await getOfflineReportById(id); // Simulación de verificación
    return report ? "En base de datos" : "No encontrado";
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Historial de Reportes Añadidos</h2>
      {loading ? (
        <div className="flex justify-center my-4">
          <div className="w-16 h-16 border-4 border-solid border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Nombre de la Máquina</th>
              <th className="py-2 px-4 text-left">Proyecto</th>
              <th className="py-2 px-4 text-left">Fecha de Ingreso</th>
              <th className="py-2 px-4 text-left">Fecha de Salida</th>
              <th className="py-2 px-4 text-left">Observación</th>
              <th className="py-2 px-4 text-left">Imágenes</th>
              <th className="py-2 px-4 text-left">Estado</th>
              <th className="py-2 px-4 text-left">Enviado</th>
              <th className="py-2 px-4 text-left">Acciones</th>
              <th className="py-2 px-4 text-left">Verificación</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4">{report.nombreMaquina}</td>
                  <td className="py-2 px-4">{report.proyecto}</td>
                  <td className="py-2 px-4">{report.fechaIngreso}</td>
                  <td className="py-2 px-4">{report.fechaSalida}</td>
                  <td className="py-2 px-4">{report.observacion || "Sin observaciones"}</td>
                  <td className="py-2 px-4">
                    {report.images && report.images.length > 0 ? (
                      <ul>
                        {report.images.map((image, imgIndex) => (
                          <li key={imgIndex}>{image.name || "Imagen sin nombre"}</li>
                        ))}
                      </ul>
                    ) : (
                      "Sin imágenes"
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {report.synced ? "Sincronizado" : "Pendiente"}
                  </td>
                  <td className="py-2 px-4">
                    {report.synced ? (
                      <span className="text-green-500">Enviado</span>
                    ) : (
                      <span className="text-red-500">No enviado</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-500 hover:underline mr-2"
                      onClick={() => console.log("Edit", report.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDelete(report.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    {report.synced ? (
                      <span>Verificado</span>
                    ) : (
                      <button
                        onClick={() => checkInDatabase(report.id)}
                        className="text-blue-500 hover:underline"
                      >
                        Verificar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-4 text-center">
                  No hay reportes almacenados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <button
        onClick={handleSync}
        className={`mt-4 py-2 px-4 font-bold text-white ${
          isOnline
            ? "bg-blue-500 hover:bg-blue-700"
            : "bg-gray-500 cursor-not-allowed"
        } rounded-md shadow-lg`}
        disabled={!isOnline}
      >
        {isOnline
          ? "Sincronizar Reportes Manualmente"
          : "Sincronización no disponible"}
      </button>
    </div>
  );
}

export default ReportTable;
