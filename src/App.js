import React from 'react';
import Header from './components/Header';
import ReportTable from './components/ReportTable'; // Componente de tabla
import ReportForm from './components/ReportForm.js'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Crear Reporte Offline</h1>
        <ReportForm />
        <ReportTable />
      </div>
    </div>
  );
}

export default App;
