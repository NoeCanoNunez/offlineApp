// import { getOfflineReports, saveReportOffline } from './idb'; 

// async function syncReports() {
//   const reports = await getOfflineReports(); // Obtener reportes offline
//   console.log(reports)
  
//   // Procesar cada reporte
//   reports.forEach(async (report) => {
//     try {
//       const formData = new FormData();
//       formData.append('description', report.description);
//       formData.append('image', report.image); // Enviar imagen como archivo

//       // Enviar reporte al servidor
//       const response = await fetch('https://offline.smartaccesorios.shop/.php/upload.php', {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();
//       if (result.status === 'success') {
//         // Si la sincronización es exitosa, marcar como sincronizado
//         report.synced = true;  
//         await saveReportOffline(report);  // Actualizar reporte en IndexedDB con synced: true
//         console.log('Reporte sincronizado correctamente:', report);
//       } else {
//         console.error('Error en la respuesta del servidor:', result.message);
//       }
//     } catch (error) {
//       console.log("c")
//       console.error('Error al sincronizar el reporte:', error);
//     }
//   });
// }

// export default syncReports;


import { getOfflineReports, saveReportOffline } from './idb'; 

async function syncReports() {
  const reports = await getOfflineReports(); // Obtener reportes offline
  console.log(reports);
  
  // Procesar cada reporte
  reports.forEach(async (report) => {
    try {
      const formData = new FormData();
      
      // Añadir todos los campos del reporte
      formData.append('nombreMaquina', report.nombreMaquina);
      formData.append('proyecto', report.proyecto);
      formData.append('fechaIngreso', report.fechaIngreso);
      formData.append('fechaSalida', report.fechaSalida);
      formData.append('observacion', report.observacion || '');

      // Añadir imágenes al FormData
      report.images.forEach((image, index) => {
        formData.append(`images[]`, image); // Añadir cada imagen al FormData
      });

      // Enviar reporte al servidor
      const response = await fetch('https://offline.smartaccesorios.shop/.php/upload.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.status === 'success') {
        // Si la sincronización es exitosa, marcar como sincronizado
        report.synced = true;
        await saveReportOffline(report);  // Actualizar reporte en IndexedDB con synced: true
        console.log('Reporte sincronizado correctamente:', report);
      } else {
        console.error('Error en la respuesta del servidor:', result.message);
      }
    } catch (error) {
      console.error('Error al sincronizar el reporte:', error);
    }
  });
}

export default syncReports;
