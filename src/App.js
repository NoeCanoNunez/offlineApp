import React, { useState, useEffect } from "react";
import Header from './components/Header';
import ReportForm from './components/ReportForm';
import ReportTable from './components/ReportTable';
import { getOfflineReports } from "./idb";

function App() {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const storedReports = await getOfflineReports();
    setReports(storedReports);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReportSaved = () => {
    fetchReports();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Crear Reporte Offline</h1>
        <ReportForm onReportSaved={handleReportSaved} />
        <ReportTable reports={reports} />
      </div>
    </div>
  );
}

export default App;