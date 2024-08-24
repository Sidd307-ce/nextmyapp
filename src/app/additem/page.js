"use client";
import Navbar from "../Components/navbar/page";
import React, { useState, useContext } from "react";
import { app } from "../Components/Firebase";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinearProgress from "@mui/material/LinearProgress";
import Form from "./Form";
import { MyContext } from "./useContext";
import Alert from "@mui/material/Alert";
import CheckIcon from '@mui/icons-material/Check';
import Plus from "../Components/Plus";

const AddItem = () => {
  const {
    typimg,
    settypimg,
    ctitle,
    setctitle,
    cdec,
    setcdec,
    coff,
    setcoff,
    cprice,
    setcprice,
  } = useContext(MyContext);
  const [file, setFile] = useState(null);
  const [carouselFiles, setCarouselFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [alert, setalert] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mainImageName, setMainImageName] = useState('');
  const [carouselImgNames, setCarouselImgNames] = useState([]);

  // Drag and Drop Handlers
  const handleDragOver = (e) => e.preventDefault();
  const handleMainDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };
  const handleCarouselDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setCarouselFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  // File Input Handlers
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleCarouselFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setCarouselFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleUpload = async () => {
    if (!file && carouselFiles.length === 0) return;

    setUploading(true);
    const storage = getStorage(app);
    const db = getFirestore(app);

    try {
      let mainFileUrl = "";
      let mainImageFileName = ""; // Variable to store the file name

      if (file) {
        mainImageFileName = file.name; // Get the main image name directly
        const mainFileRef = storageRef(storage, `Images/${typimg.title}/${mainImageFileName}`);
        
        const mainUploadTask = uploadBytesResumable(mainFileRef, file);

        mainFileUrl = await new Promise((resolve, reject) => {
          mainUploadTask.on(
            "state_changed",
            (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
            (error) => {
              setUploading(false);
              reject(error);
            },
            async () => resolve(await getDownloadURL(mainUploadTask.snapshot.ref))
          );
        });
      }

      const carouselUrls = [];
      const carouselNames = [];
      for (const carouselFile of carouselFiles) {
        const carouselFileRef = storageRef(storage, `Images/carousel/${carouselFile.name}`);
        const carouselUploadTask = uploadBytesResumable(carouselFileRef, carouselFile);

        const downloadURL = await new Promise((resolve, reject) => {
          carouselUploadTask.on(
            "state_changed",
            (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
            (error) => {
              setUploading(false);
              reject(error);
            },
            async () => resolve(await getDownloadURL(carouselUploadTask.snapshot.ref))
          );
        });

        carouselUrls.push(downloadURL);
        carouselNames.push(carouselFile.name);
      }

      await addDoc(collection(db, "Product_Data"), {
        carouselImgNames: carouselNames,
        CarouselImages: carouselUrls,
        mainImageName: mainImageFileName, // Use the direct file name here
        ImageUrl: mainFileUrl,
        type: typimg,
        title: ctitle,
        description: cdec,
        offPercent: coff,
        price: cprice,
        comments: [],
      });

      setUploading(false);
      setalert(true);
      setTimeout(() => setalert(false), 5000);

      // Reset Form State
      setFile(null);
      setCarouselFiles([]);
      setCarouselImgNames([]);
      setMainImageName("");
      settypimg("");
      setctitle("");
      setcdec("");
      setcoff("");
      setcprice("");
      setUploadProgress(0);

    } catch (error) {
      console.error("Error uploading files:", error);
      setUploading(false);
      setUploadProgress(0);
    }
};


  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: "20px" }}>
      <Navbar />
   
      {uploading && (
        <Box sx={{ width: "100%", position:'sticky',top:'9.2%',zIndex:1000,}}>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}
       {uploading && (
        <Box sx={{position:'sticky',top:10,zIndex:1000, }}>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="10%" y1="10%" x2="10%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)'} }} />
      </Box>
      )}

      {alert && (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" style={{ marginTop: "50px", zIndex: '100' }}>
          Successfully uploaded the data.
        </Alert>
      )}
   <br />
      <Box sx={{ border: `2px dashed ${dragging ? "#ff9800" : "#ccc"}`, padding: "20px", textAlign: "center", margin: "60px 0", maxWidth: "50%", width: "100%", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
        onDragOver={handleDragOver}
        onDrop={(e) => { handleMainDrop(e); handleCarouselDrop(e); }}
      >
        <Typography variant="h5" gutterBottom>Upload Files</Typography>
        <Typography variant="body1" gutterBottom>Drag and drop files here or click to select.</Typography>

        <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: "none" }} />
        <input type="file" id="carouselInput" onChange={handleCarouselFileChange} style={{ display: "none" }} multiple />

        <label htmlFor="fileInput">
          <Button variant="contained" color="primary" component="span" startIcon={<CloudUploadIcon />} sx={{ marginTop: "10px" }}>
            Select Main File
          </Button>
        </label>
        <label htmlFor="carouselInput" style={{ marginLeft: "10px" }}>
          <Button variant="contained" color="primary" component="span" startIcon={<CloudUploadIcon />} sx={{ marginTop: "10px" }}>
            Select Carousel Files
          </Button>
        </label>

        {file && <Typography variant="subtitle1" sx={{ marginTop: "20px" }}>Main file selected: {file.name}</Typography>}
        {carouselFiles.length > 0 && (
          <Box sx={{ marginTop: "20px" }}>
            <Typography variant="subtitle1">Carousel files selected:</Typography>
            <ul>{carouselFiles.map((file, index) => <li key={index}>{file.name}</li>)}</ul>
          </Box>
        )}
      </Box>

      <Form />

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Button variant="contained" color="primary" onClick={handleUpload} startIcon={<CloudUploadIcon />} disabled={!file && carouselFiles.length === 0}>
          Submit
        </Button>
      </Box>
      <Plus/>
    </Box>
  );
};

export default AddItem;
