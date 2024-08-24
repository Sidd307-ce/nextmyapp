// src/app/additem/useContext.js
"use client"; // Ensure this is a client component

import React, { createContext, useState } from "react";

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [typimg, settypimg] = useState('');
  const [ctitle, setctitle] = useState('');
  const [cdec, setcdec] = useState('');
  const [coff, setcoff] = useState('');
  const [cprice, setcprice] = useState('');
  const [user, setUser] = useState([])

  return (
    <MyContext.Provider value={{ typimg, settypimg, ctitle, setctitle, cdec, setcdec, coff, setcoff, cprice, setcprice , setUser,user}}>
      {children}
    </MyContext.Provider>
  );
};




