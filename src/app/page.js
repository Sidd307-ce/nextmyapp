
import React from "react";
import Cards from "./Components/Card";
import Crousel from "./Components/Crousel";
import Footer from "./Components/footer/page";
import Navbar from "./Components/navbar/page";
import Plus from "./Components/Plus";
import "./style.css";
import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <>
      <Navbar />
      <Box className="carousel-container">
        <Crousel />
      </Box>
      <Box className="section">
        <h3
          style={{ marginLeft: "30px", fontSize: "24px", fontFamily: "auto" }}
        >
          Trending Deals
        </h3>
        <Cards value={"Trending Deals"} />
      </Box>
      <Box className="section">
        <h3
          style={{ marginLeft: "30px", fontSize: "24px", fontFamily: "auto" }}
        >
          Weekly Deals
        </h3>
        <Cards value={"Weekly Deals"} />
      </Box>
      <Box className="section">
        <h3
          style={{ marginLeft: "30px", fontSize: "24px", fontFamily: "auto" }}
        >
          Festival Special
        </h3>
        <Cards value={"Festival Special"} />
      </Box>
      <Box className="section">
        <h3
          style={{ marginLeft: "30px", fontSize: "24px", fontFamily: "auto" }}
        >
          Deal for Today
        </h3>
        <Cards value={"Deal for Today"} />
      </Box>
      <Box className="section">
        <Plus />
      </Box>
      <Footer />
    </>
  );
}
