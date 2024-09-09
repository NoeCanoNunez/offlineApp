import React, { useState, useEffect } from "react";

const IMG = ({ src, alt, onFullScreenChange, keya, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    if (onFullScreenChange) {
      onFullScreenChange(true); // Notificar solo si onFullScreenChange está definido
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onFullScreenChange) {
      onFullScreenChange(false); // Notificar solo si onFullScreenChange está definido
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation(); // Detener propagación
        handleClose();
      }
    };

    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      window.addEventListener("keydown", handleKeyPress);
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <>
      {/* Imagen normal, que al hacer clic se expande */}
      <img
        key={keya}
        src={src}
        alt={alt}
        className={`cursor-pointer ${className}`}
        onClick={handleOpen}
      />

      {/* Modal para mostrar la imagen en pantalla completa */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          {/* Botón "X" para cerrar */}
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold"
            onClick={handleClose}
          >
            &times;
          </button>

          {/* Imagen ajustada al tamaño máximo dependiendo de las dimensiones */}
          <img
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </>
  );
};

export default IMG;
