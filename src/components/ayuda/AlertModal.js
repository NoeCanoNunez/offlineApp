import React, { useEffect } from "react";

const AlertModal = ({ isOpen, onClose }) => {
  // Función que cierra el modal y recarga la página si es necesario
  const handleConfirm = () => {
    onClose();
    // Aquí puedes decidir si realmente necesitas recargar la página
    window.location.reload(); // Recargar si es necesario
  };

  // Cierra el modal con la tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        handleConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isOpen]);

  // No renderizar el modal si no está abierto
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p>
          Reporte guardado. Recuerda enviarlo desde Historial de Reportes
          Añadidos
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
