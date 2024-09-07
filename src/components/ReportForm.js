import React, { useState } from "react";
import { saveReportOffline } from "../idb";

function ReportForm() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Crear el objeto de reporte
    const report = {
      description,
      image,
      synced: false, // Añadir la propiedad synced como false inicialmente
    };

    // Guardar el reporte offline
    await saveReportOffline(report);
    alert("Reporte guardado offline. Se sincronizará cuando haya internet.");
    
    // Reiniciar el formulario
    setDescription("");
    setImage(null);
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción:
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Imagen:
          </label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Guardar Reporte
        </button>
      </form>
    </div>
  );
}

export default ReportForm;
