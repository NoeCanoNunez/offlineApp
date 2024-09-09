import React, { useEffect, useState } from "react";
import IMG from "./IMG";

const AlertModal = ({ isOpen, onClose, report }) => {
  const [isFullScreenImage, setIsFullScreenImage] = useState(false);
  // Función que cierra el modal
  const handleConfirm = () => {
    onClose();
  };

  // Cierra el modal con la tecla Escape y deshabilita el scroll en el body
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    const handleKeyPress = (e) => {
      if (e.key === "Escape" && !isFullScreenImage) {
        handleConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      document.body.classList.remove("overflow-hidden"); // Limpiar al desmontar
    };
  }, [isOpen, isFullScreenImage]);

  if (!isOpen || !report) return null;

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0"); // Día con 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Mes con 2 dígitos (los meses en JavaScript comienzan desde 0)
    const year = String(date.getFullYear()).slice(-2); // Últimos dos dígitos del año

    return `${day}/${month}/${year}`;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto m-4">
        <h2 className="text-xl font-semibold mb-4">Detalles del Reporte</h2>
        <div className="p-4 bg-white shadow rounded-lg space-y-6">
          {/* Información del reporte */}
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-800">
              Información del Reporte
            </p>
            <p className="text-sm">
              <strong className="text-gray-600">Nro de Registro:</strong>{" "}
              {report.id}
            </p>
            <p className="text-sm">
              <strong className="text-gray-600">Nombre de la Máquina:</strong>{" "}
              {report.nombreMaquina}
            </p>
            <p className="text-sm">
              <strong className="text-gray-600">Fecha de Ingreso:</strong>{" "}
              {formatDate(report.fechaIngreso)}
            </p>
            <p className="text-sm">
              <strong className="text-gray-600">Fecha de Salida:</strong>{" "}
              {formatDate(report.fechaSalida)}
            </p>
            <p className="text-sm">
              <strong className="text-gray-600">Proyecto:</strong>{" "}
              {report.proyecto || "No asignado"}
            </p>
            <p className="text-sm">
              <strong className="text-gray-600">Observación:</strong>{" "}
              {report.observacion || "Sin observaciones"}
            </p>
            <p className="text-sm">
              <strong className="text-gray-600">
                Estado de Sincronización:
              </strong>{" "}
              <span
                className={`font-semibold ${
                  report.synced ? "text-green-600" : "text-red-600"
                }`}
              >
                {report.synced ? "Sincronizado" : "No sincronizado"}
              </span>
            </p>
          </div>

          {/* Imágenes del reporte */}
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-800">
              Imágenes del Reporte
            </p>
            <div className="flex space-x-2 overflow-x-auto">
              {report.images && report.images.length > 0 ? (
                report.images.map((image, imgIndex) => (
                  <>
                    <IMG
                      keya={imgIndex}
                      className="w-16 h-16 rounded object-cover"
                      src={URL.createObjectURL(image)}
                      alt={`Imagen ${imgIndex + 1}`}
                      onFullScreenChange={setIsFullScreenImage}
                    />
                  </>
                ))
              ) : (
                <p className="text-gray-500">No hay imágenes disponibles.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
