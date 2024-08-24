"use client"; // Necessary for using hooks in Next.js pages
import React, { useState } from "react";
import { Box } from "@mui/material";

const ImageMagnifier = ({ src, zoomLevel = 3 }) => {
  const [zoomed, setZoomed] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => setZoomed(true);
  const handleMouseLeave = () => setZoomed(false);
  
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setCursorPos({ x, y });
  };
  

  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: "100%", md: "900px" },
        height: { xs: "400px", md: "600px" },
        overflow: "hidden",
        borderRadius: "12px",
        border: "1px solid #ddd",
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        cursor: "none",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt="Magnified"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.4s ease-in-out",
          transform: zoomed ? `scale(${zoomLevel})` : "none",
          transformOrigin: `${cursorPos.x}% ${cursorPos.y}%`,
        }}
      />
      {zoomed && (
       <Box
       sx={{
         position: "absolute",
         width: "100px",
         height: "100px",
         background: `url('data:image/gif;base64,R0lGODlhZABkAPABAHOf4fj48yH5BAEAAAEALAAAAABkAGQAAAL+jI+py+0PowOB2oqvznz7Dn5iSI7SiabqWrbj68bwTLL2jUv0Lvf8X8sJhzmg0Yc8mojM5kmZjEKPzqp1MZVqs7Cr98rdisOXr7lJHquz57YwDV8j3XRb/C7v1vcovD8PwicY8VcISDGY2GDIKKf4mNAoKQZZeXg5aQk5yRml+dgZ2vOpKGraQpp4uhqYKsgKi+H6iln7N8sXG4u7p2s7ykvnyxos/DuMWtyGfKq8fAwd5nzGHN067VUtiv2lbV3GDfY9DhQu7p1pXoU+rr5ODk/j7sSePk9Ub33PlN+4jx8v4JJ/RQQa3EDwzcGFiBLi6AfN4UOGCyXegGjIoh0fisQ0rsD4y+NHjgZFqgB5y2Qfks1UPmEZ0OVLlIcKAAA7') no-repeat`,
         backgroundSize: `${zoomLevel * 100}% ${zoomLevel * 100}%`,
         backgroundPosition: `${Math.max(0, Math.min(100 - zoomLevel * 100, cursorPos.x * zoomLevel))}px ${Math.max(0, Math.min(100 - zoomLevel * 100, cursorPos.y * zoomLevel))}px`,
         top: `${Math.max(0, Math.min(100, cursorPos.y))}%`,
         left: `${Math.max(0, Math.min(100, cursorPos.x))}%`,
         transform: "translate(-50%, -50%)",
         pointerEvents: "none",
         boxShadow: "0 0 8px rgba(0, 0, 0, 0.4)",
         cursor: "none",
       }}
     />
      )}
    </Box>
  );
};

export default ImageMagnifier;