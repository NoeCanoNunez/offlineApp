import React, { useState, useEffect } from "react";
import {
  IdentificationIcon as DocNI,
  UserIcon as User,
  UsersIcon as Lock,
  CalendarIcon as Calendar,
} from "@heroicons/react/16/solid";
import Button from "./ayuda/Button";
import Input from "./ayuda/Input";
import Fondo from "../assets/fondo.webp"
import Logo from "../assets/logoVelimaq.webp"

import { registerUser } from "../idb"; // Importa las funciones necesarias


const Register = () => {
  const [userData, setFormData] = useState({
    dni: "",
    firstName: "",
    lastName: "",
    birthDate: "",
  });

  // Función para manejar el cambio en los inputs
  const handleChange = (e) => {
    console.log(userData)
    const { name, value } = e.target;
    setFormData({ ...userData, [name]: value });
  };

  
  // Manejar el envío del formulario  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(userData); // Llamada a la nueva función registerUser
    window.location.reload()
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-5" style={{backgroundImage: `url(${Fondo})`}}>
    <div className="max-w-md w-full p-8 rounded-lg backdrop-blur-md bg-white/30 shadow-xl">
    <img src={Logo} alt="fondo" className="filter drop-shadow-lg"/>

      <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-lg">Registros</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <DocNI className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
          <Input
            type="text"
            name="dni"
            placeholder="Ingrese su numero de DNI"
            value={userData.dni}
            onChange={handleChange}
            className="pl-10 bg-white/50 border-white/50 text-gray-800 placeholder-gray-500"
            required
          />
        </div>
        <div className="relative">
          <User className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
          <Input
            type="text"
            name="firstName"
            placeholder="Ingrese sus nombres"
            value={userData.firstName}
            onChange={handleChange}
            className="pl-10 bg-white/50 border-white/50 text-gray-800 placeholder-gray-500"
            required
          />
        </div>
        <div className="relative">
          <Lock className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
          <Input
            type="text"
            name="lastName"
            placeholder="Ingrese sus apellidos"
            value={userData.lastName}
            onChange={handleChange}
            className="pl-10 bg-white/50 border-white/50 text-gray-800 placeholder-gray-500"
            required
          />
        </div>
        <div className="relative">
        <label className="pl-0 text-xs text-gray-800 placeholder-gray-500">Fecha de Nacimiento:</label>
          <Calendar className="h-5 w-5 absolute left-3 top-11 transform -translate-y-1/2 text-gray-600" />
          
          <Input
            type="date"
            name="birthDate"
            value={userData.birthDate}
            onChange={handleChange}
            className="pl-10 bg-white/50 border-white/50 text-gray-800"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-amber-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
          Registrarse
        </Button>
      </form>
    </div>
  </div>
  );
};

export default Register;
