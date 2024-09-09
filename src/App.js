// import React, { useState, useEffect } from "react";
// import Header from './components/Header';
// import ReportForm from './components/ReportForm';
// import ReportTable from './components/ReportTable';
// import { getOfflineReports } from "./idb";

// function App() {
//   const [reports, setReports] = useState([]);

//   const fetchReports = async () => {
//     const storedReports = await getOfflineReports();
//     setReports(storedReports);
//   };

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const handleReportSaved = () => {
//     fetchReports();
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//   <Header />
//   <div className="container mx-auto p-4">
//    <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 text-center drop-shadow-lg">
//       Crear Reporte Offline
//     </h1>
//     <div className="flex flex-col lg:flex-row gap-6">
//       <div className="flex-1">
//         <ReportForm onReportSaved={handleReportSaved} />
//       </div>
//       <div className="flex-1">
//         <ReportTable reports={reports} />
//       </div>
//     </div>
//   </div>
// </div>

//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ReportForm from "./components/ReportForm";
import ReportTable from "./components/ReportTable";
import Register from "./components/Register";
import Loader from "./components/ayuda/Loader";
import { getOfflineReports, getUser } from "./idb";

function App() {
  const [reports, setReports] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para controlar el loader

  // Verificar si el usuario ya está registrado
  const checkRegistration = async () => {
    const user = await getUser(); // Usamos la función getUser
    if (user.length === 0) {
      setIsRegistered(false);
    } else {
      setIsRegistered(true);
    }
  };

  const fetchReports = async () => {
    const storedReports = await getOfflineReports();
    setReports(storedReports);
  };

  useEffect(() => {
    checkRegistration(); // Revisar si ya está registrado
    fetchReports(); // Cargar los reportes offline
  }, []);

  const handleReportSaved = () => {
    fetchReports();
  };

  return (
    <>
      {" "}
      {loading ? (
        // Muestra el Loader mientras loading es true
        <Loader text="Cargando..." />
      ) : !isRegistered ? (
        <Register />
      ) : (
        <div className="min-h-screen bg-gray-100">
          <Header />
          <div className="container mx-auto p-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 text-center drop-shadow-lg">
              Crear Reporte Offline
            </h1>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <ReportForm onReportSaved={handleReportSaved} />
              </div>
              <div className="flex-1">
                <ReportTable reports={reports} loader={setLoading} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
