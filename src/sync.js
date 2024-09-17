import { getOfflineReports, updateReportSyncStatus, getUser } from './idb';

async function syncReports(loader) {
  if (loader) loader(true);
  
  // Obtener el usuario y su dni
  const user = await getUser();
  const userDni = user[0].dni;

  // Obtener reportes offline
  const reports = await getOfflineReports();

  // Filtrar reportes que no estén sincronizados
  const unsyncedReports = reports.filter(report => report.synced === false);

  // Si no hay reportes por sincronizar, mostramos un alert
  if (unsyncedReports.length === 0) {
    alert('Todos los reportes ya fueron sincronizados.');
    if (loader) loader(false);
    return;
  }

  // Procesar cada reporte
  for (const report of unsyncedReports) {
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
        formData.append(`images[]`, image);
      });

      // Crear el ID basado en dni y timestamp
      const userReportId = `${userDni}_${report.creacion}`;
      formData.append('code', userReportId);
      console.log(userReportId);

      // Enviar reporte al servidor
      const response = await fetch('https://offline.smartaccesorios.shop/.php/upload.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.status === 'success') {
        // Si la sincronización es exitosa, marcar como sincronizado
        await updateReportSyncStatus(report.id, true);
        console.log('Reporte', report.id, 'sincronizado correctamente:', report);
      } else {
        console.error('Error en la respuesta del servidor:', result.message);
      }
    } catch (error) {
      console.error('Error al sincronizar el reporte:', error);
    }
  }

  if (loader) loader(false);
  window.location.reload();
}

export default syncReports;