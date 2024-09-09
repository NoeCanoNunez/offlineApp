import React from "react";
import Fondo from "../../assets/fondo.webp";

const Loader = ({ text }) => {
  return (
    <div
      className="fixed inset-0 z-50"
      style={{ backgroundImage: `url(${Fondo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Capa de fondo negro con opacidad */}
      <div className="absolute inset-0 bg-black opacity-70 z-40"></div>

      {/* Contenido del loader encima del fondo */}
      <div className="relative z-50 flex flex-col items-center justify-center min-h-screen">
        <p className="text-white text-lg font-semibold mb-5 animate-pulse">
          {text}
        </p>
        <div className="loader border-t-transparent border-solid animate-spin rounded-full border-gray-300 border-8 h-20 w-20"></div>
      </div>
    </div>
  );
};

export default Loader;
