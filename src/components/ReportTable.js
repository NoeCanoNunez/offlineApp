import React, { useState, useEffect } from "react";
import { getOfflineReports, deleteReport } from "../idb";
import syncReports from "../sync";
import { TrashIcon, EyeIcon } from "@heroicons/react/16/solid";
import AlertModal from "./ayuda/Modalreport";
import IMG from "./ayuda/IMG";
function ReportTable({ loader }) {
  const [reports, setReports] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showModal, setShowModal] = useState(false); // Para manejar el modal de confirmación de eliminación
  const [reportToDelete, setReportToDelete] = useState(null); // Reporte que se quiere eliminar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

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
      await syncReports(loader);
    } else {
      alert("No estás online. Conéctate para sincronizar los reportes.");
    }
  };

  const handleDelete = async (id) => {
    await deleteReport(id);
    const updatedReports = await getOfflineReports();
    setReports(updatedReports);
  };

  const confirmDelete = (report) => {
    console.log(reports);
    setReportToDelete(report);
    setShowModal(true); // Mostrar el modal de confirmación
  };

  // Función para limitar el texto a un máximo de caracteres
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0"); // Día con 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Mes con 2 dígitos (los meses en JavaScript comienzan desde 0)
    const year = String(date.getFullYear()).slice(-2); // Últimos dos dígitos del año

    return `${day}/${month}/${year}`;
  }

  const handleViewReport = (report) => {
    setSelectedReport(report); // Selecciona el reporte a mostrar
    setIsModalOpen(true); // Abre el modal
  };

  return (
    <div className="mt-6 space-y-6 p-4 bg-gray-50 rounded-lg shadow-lg max-w-full mx-auto">
      <h2 className="md:text-2xl text-lg text-center font-bold text-gray-600 mb-10">
        Historial de Reportes Añadidos
      </h2>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {reports.length > 0 ? (
          reports
            .slice()
            .reverse()
            .map((report, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-md flex flex-row items-center"
              >
                {/* Sección de Imágenes */}
                <div className="flex-shrink-0">
                  {report.images && report.images.length > 0 ? (
                    <>
                      {/* Mostrar primera imagen grande y circular */}
                      <IMG
                        className="w-16 h-16  rounded-full object-cover"
                        src={URL.createObjectURL(report.images[0])}
                        alt="Imagen principal"
                        keya={index}
                        key={index}
                      />
                      {/* Mostrar hasta tres imágenes más pequeñas */}
                      <div className="flex space-x-1 mt-2">
                        {report.images.slice(1, 4).map((image, imgIndex) => (
                          <IMG
                            key={imgIndex}
                            keya={imgIndex}
                            className="w-5 h-5 rounded object-cover"
                            src={URL.createObjectURL(image)}
                            alt={`Imagen secundaria ${imgIndex + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-[10px] md:text-xs text-center">
                        Sin imágenes
                      </span>
                    </div>
                  )}
                </div>

                {/* Información del reporte */}
                <div className="flex-1 ml-4">
                  <div className="flex flex-row items-center content-between justify-between gap-10">
                    <p className="text-[12px] md:text-sm font-semibold">
                      {truncateText(report.nombreMaquina, 30)}{" "}
                      {/* Limitar el nombre de la máquina */}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400">
                      {formatDate(report.fechaIngreso)} <br />{" "}
                      {formatDate(report.fechaSalida)}
                    </p>
                  </div>
                  <div className="mt-2 flex flex-row items-center content-between justify-between">
                    <p className="text-[10px] md:text-xs text-gray-500">
                      {truncateText(
                        report.observacion || "Sin observaciones",
                        51
                      )}{" "}
                      {/* Limitar la observación */}
                    </p>
                    {/* Estado del reporte */}
                    <div className="flex items-center ml-auto space-x-4">
                      {/* Botón de mostrar */}
                      <button
                        onClick={() => confirmDelete(report)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      {/* Botón mostrar Modal */}
                      <button
                        onClick={() => handleViewReport(report)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      {/* Indicador de estado */}
                      <div
                        className={`w-4 h-4 rounded-full ${
                          report.synced
                            ? report.enBaseDatos
                              ? "bg-green-500"
                              : "bg-orange-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="py-4 text-center">No hay reportes almacenados.</div>
        )}
      </div>

      <button
        onClick={handleSync}
        className={`w-full py-3 text-xs md:text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 px-4  text-white ${
          isOnline
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-600 cursor-not-allowed"
        } rounded-md shadow-lg`}
        disabled={!isOnline}
      >
        {isOnline
          ? "Sincronizar Reportes Manualmente"
          : "Sincronización no disponible"}
      </button>

      {/* Modal de confirmación de eliminación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p>¿Estás seguro de que deseas eliminar este reporte?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  handleDelete(reportToDelete.id);
                  setShowModal(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de confirmación de eliminación */}
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        report={selectedReport} // Pasa el reporte seleccionado al modal
      />
    </div>
  );
}

export default ReportTable;
