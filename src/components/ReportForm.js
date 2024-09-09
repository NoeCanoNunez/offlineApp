import React, { useState, useEffect } from "react";
import { saveReportOffline } from "../idb";
import AlertModal from "./ayuda/AlertModal";
import { TrashIcon } from "@heroicons/react/16/solid";
import Loader from "./ayuda/Loader";

function ReportForm({ onReportSaved }) {
  const [nombreMaquina, setNombreMaquina] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [observacion, setObservacion] = useState("");
  const [creacion, setCreacion] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setIsLoading(true);
    Promise.all(files.map((file) => compressImage(file)))
      .then((compressedImages) => {
        setImages((prevImages) => [...prevImages, ...compressedImages]);
        setImagePreviews((prevPreviews) => [
          ...prevPreviews,
          ...compressedImages.map((image) => URL.createObjectURL(image)),
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const scaleFactor = 0.7;

          // Redimensionar el canvas
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;

          // Dibujar la imagen redimensionada en el canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convertir la imagen a formato webp
          canvas.toBlob(
            (blob) => {
              // Obtener el nombre del archivo original y cambiar la extensión a .webp
              const newFileName = file.name.replace(/\.[^.]+$/, ".webp"); // Cambia la extensión a .webp

              // Crear el nuevo archivo con la extensión .webp
              resolve(
                new File([blob], newFileName, {
                  type: "image/webp",
                  lastModified: Date.now(),
                })
              );
            },
            "image/webp",
            0.8
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => {
      const newPreviews = prevPreviews.filter((_, i) => i !== index);
      prevPreviews[index] && URL.revokeObjectURL(prevPreviews[index]);
      return newPreviews;
    });
  };

  useEffect(() => {
    setCreacion(Date.now())
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombreMaquina", nombreMaquina);
    formData.append("proyecto", proyecto);
    formData.append("fechaIngreso", fechaIngreso);
    formData.append("fechaSalida", fechaSalida);
    formData.append("observacion", observacion);

    // Añadir el timestamp actual al campo "creacion"
    formData.append("creacion", creacion);

    images.forEach((image, index) => {
      formData.append(`images[]`, image); // Añadir cada imagen al FormData
    });

    const report = {
      nombreMaquina,
      proyecto,
      fechaIngreso,
      fechaSalida,
      observacion,
      creacion,
      images, // Puedes guardar solo la referencia a los archivos comprimidos offline si es necesario
    };

    await saveReportOffline(report);

    // Llamar a la función onReportSaved para actualizar la tabla
    onReportSaved();

    // Limpiar el formulario
    setNombreMaquina("");
    setProyecto("");
    setFechaIngreso("");
    setFechaSalida("");
    setObservacion("");
    setCreacion("")
    setImages([]);

    setIsModalOpen(true);
  };

  return (
    <>
      {isLoading && <Loader text="Comprimiendo Imagenes, espere por favor" />}
      <div className="bg-teal-50/80 flex flex-col items-center mt-6 space-y-6 pt-4 bg-gray-50 rounded-lg shadow-lg max-w-full mx-auto ">
        <h2 className="md:text-2xl text-lg  font-bold text-gray-600">
          Formulario Reporte
        </h2>
        <form
          onSubmit={handleFormSubmit}
          className="bg-white/0 md:space-y-6 space-y-4 p-4 bg-gray-50 rounded-lg shadow-lg max-w-md mx-auto"
        >
          <input
            type="text"
            value={nombreMaquina}
            onChange={(e) => setNombreMaquina(e.target.value)}
            placeholder="Nombre de la máquina"
            required
            className="text-xs/3 w-full p-1 md:p-4 md:text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            value={proyecto}
            onChange={(e) => setProyecto(e.target.value)}
            placeholder="Proyecto"
            required
            className="text-xs/3 w-full p-1 md:p-4 md:text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div>
            <label>Fecha de Ingreso</label>
            <input
              type="date"
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e.target.value)}
              required
              className="text-xs/3 w-full p-1 md:p-4 md:text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label>Fecha de Salida</label>
            <input
              type="date"
              value={fechaSalida}
              onChange={(e) => setFechaSalida(e.target.value)}
              required
              className="text-xs/3 w-full p-1 md:p-4 md:text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            placeholder="Observación"
            className="text-xs/3 w-full p-1 md:p-4 md:text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="file"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="w-full p-4 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="flex flex-wrap gap-2 mt-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-1"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          {images.length > 0 && (
            <p className="text-sm text-gray-500">
              {images.length} imagen(es) seleccionada(s)
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 text-xs md:text-lg font-semibold bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Guardar Reporte
          </button>
        </form>
        {/* Modal de alerta */}
        <AlertModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </>
  );
}

export default ReportForm;
