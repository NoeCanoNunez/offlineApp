import React, { useState } from "react";
import { saveReportOffline } from "../idb";

function ReportForm({ onReportSaved }) {
  const [nombreMaquina, setNombreMaquina] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [observacion, setObservacion] = useState("");
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => compressImage(file)))
      .then(compressedImages => {
        setImages(prevImages => [...prevImages, ...compressedImages]);
      });
  };


  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const scaleFactor = 0.7;
  
          // Redimensionar el canvas
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;
  
          // Dibujar la imagen redimensionada en el canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
          // Convertir la imagen a formato webp
          canvas.toBlob((blob) => {
            // Obtener el nombre del archivo original y cambiar la extensión a .webp
            const newFileName = file.name.replace(/\.[^.]+$/, '.webp'); // Cambia la extensión a .webp
  
            // Crear el nuevo archivo con la extensión .webp
            resolve(new File([blob], newFileName, {
              type: 'image/webp',
              lastModified: Date.now()
            }));
          }, 'image/webp', 0.8);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };
  

  // const compressImage = (file) => {
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const img = new Image();
  //       img.onload = () => {
  //         const canvas = document.createElement('canvas');
  //         const ctx = canvas.getContext('2d');
  //         const scaleFactor = 0.7;

  //         canvas.width = img.width * scaleFactor;
  //         canvas.height = img.height * scaleFactor;

  //         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  //         canvas.toBlob((blob) => {
  //           resolve(new File([blob], file.name, {
  //             type: 'image/webp',
  //             lastModified: Date.now()
  //           }));
  //         }, 'image/webp', 0.8);
  //       };
  //       img.src = event.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // };

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();

  //   const report = {
  //     nombreMaquina,
  //     proyecto,
  //     fechaIngreso,
  //     fechaSalida,
  //     observacion,
  //     images,
  //     synced: false,
  //   };

  //   await saveReportOffline(report);
    
  //   // Llamar a la función onReportSaved para actualizar la tabla
  //   onReportSaved();

  //   // Limpiar el formulario
  //   setNombreMaquina("");
  //   setProyecto("");
  //   setFechaIngreso("");
  //   setFechaSalida("");
  //   setObservacion("");
  //   setImages([]);

  //   alert("Reporte guardado offline. Se sincronizará cuando haya internet.");
  // };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombreMaquina", nombreMaquina);
    formData.append("proyecto", proyecto);
    formData.append("fechaIngreso", fechaIngreso);
    formData.append("fechaSalida", fechaSalida);
    formData.append("observacion", observacion);

    images.forEach((image, index) => {
      formData.append(`images[]`, image); // Añadir cada imagen al FormData
    });

    // Aquí es donde debes guardar los datos offline o enviarlos a través de una API
    // Por ejemplo, para guardarlos offline, puedes guardarlos como un objeto pero sin imágenes como archivos binarios
    const report = {
      nombreMaquina,
      proyecto,
      fechaIngreso,
      fechaSalida,
      observacion,
      images, // Puedes guardar solo la referencia a los archivos comprimidos offline si es necesario
      synced: false,
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
    setImages([]);

    alert("Reporte guardado offline. Se sincronizará cuando haya internet.");
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <input
        type="text"
        value={nombreMaquina}
        onChange={(e) => setNombreMaquina(e.target.value)}
        placeholder="Nombre de la máquina"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={proyecto}
        onChange={(e) => setProyecto(e.target.value)}
        placeholder="Proyecto"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        value={fechaIngreso}
        onChange={(e) => setFechaIngreso(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        value={fechaSalida}
        onChange={(e) => setFechaSalida(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
        placeholder="Observación"
        className="w-full p-2 border rounded"
      />
      <input
        type="file"
        onChange={handleImageChange}
        multiple
        accept="image/*"
        className="w-full p-2 border rounded"
      />
      {images.length > 0 && (
        <p>{images.length} imagen(es) seleccionada(s)</p>
      )}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Guardar Reporte
      </button>
    </form>
  );
}

export default ReportForm;