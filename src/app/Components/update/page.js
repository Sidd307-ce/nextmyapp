"use client";
import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { app } from "../Firebase";

import Skeleton from "@mui/material/Skeleton";
import { Box, Typography, Button, Rating, Container, LinearProgress, Alert, CircularProgress, circularProgressClasses, Divider } from "@mui/material";
import AddLinkIcon from "@mui/icons-material/AddLink";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import Navbar from "../navbar/page";
import CheckIcon from '@mui/icons-material/Check';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import Plus from "../Plus";
import ImageMagnifier from "../ImageMagnifier";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [alerts, setalert] = useState(false);
  const db = getFirestore(app);
  const storage = getStorage(app);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const docRef = collection(db, "Product_Data");
      const docSnap = await getDocs(docRef);

      const fetchedData = docSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(fetchedData);
      setLoading(false);
    };

    fetchData();
  }, [db]);

  const handleUpdateMainImage = (item) => {
    const fileInput = document.getElementById(`mainImage-${item.id}`);
    fileInput.click();
  };

  const handleMainImageChange = async (item, event) => {
    setUploading(true);
    const file = event.target.files[0];
    if (!file) return;

    try {
      const fileRef = storageRef(
        storage,
        `Images/${item.type.title}/${item.mainImageName}`
      );
      await uploadBytes(fileRef, file);
      const newImageUrl = await getDownloadURL(fileRef);

      // Update Firestore with the new main image URL
      await updateDoc(doc(db, "Product_Data", item.id), {
        ImageUrl: newImageUrl,
      });

      // Update local state to reflect the change
      setData((prevData) =>
        prevData.map((d) =>
          d.id === item.id ? { ...d, ImageUrl: newImageUrl } : d
        )
      );
      setUploading(false);
      setalert(true);
      setTimeout(() => setalert(false), 5000);
      alert("Main image updated successfully!");
    } catch (error) {
      console.error("Error updating main image:", error);
      alert("Failed to update main image.");
    }
  };

  const handleUpdateCarouselImages = (item) => {
    const fileInput = document.getElementById(`carouselImages-${item.id}`);
    fileInput.click();
  };

 const handleCarouselImagesChange = async (item, event) => {
  setUploading(true);
  const files = Array.from(event.target.files);
  if (!files.length) return;

  try {
    const uploadPromises = files.map(async (file, index) => {
      let carouselImgName;

      // If there are existing carousel images and enough space in the array, use the existing names
      if (index < item.carouselImgNames.length) {
        carouselImgName = item.carouselImgNames[index];
      } else {
        // If the current index exceeds the length of existing names, use the file name as new name
        carouselImgName = file.name;
      }

      const fileRef = storageRef(storage, `Images/carousel/${carouselImgName}`);
      await uploadBytes(fileRef, file);
      return getDownloadURL(fileRef);
    });

    const newImageUrls = await Promise.all(uploadPromises);

    // Update Firestore with the new carousel image URLs
    await updateDoc(doc(db, "Product_Data", item.id), {
      CarouselImages: newImageUrls,
    });

    // Update local state to reflect the change
    setData((prevData) =>
      prevData.map((d) =>
        d.id === item.id ? { ...d, CarouselImages: newImageUrls } : d
      )
    );

    setUploading(false);
      setalert(true);
      setTimeout(() => setalert(false), 5000);
    alert("Carousel images updated successfully!");
  } catch (error) {
    console.error("Error updating carousel images:", error);
    alert("Failed to update carousel images.");
    setUploading(false);
  }
};

  const handleTextUpdate = async (field, item) => {
    setUploading(true);
    const newValue = prompt(`Enter new ${field}:`);
    if (newValue) {
      try {
        await updateDoc(doc(db, "Product_Data", item.id), {
          [field]: newValue,
        });
        setData(
          data.map((d) => (d.id === item.id ? { ...d, [field]: newValue } : d))
        );
         setUploading(false);
      setalert(true);
     
      setTimeout(() => setalert(false), 5000);
        alert(`${field} updated successfully!`);
       
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
        alert(`Failed to update ${field}.`);
        setUploading(false);
    
      }
    }
  };
  const handleExpandClick = (id) => {
    setExpandedIds((prevExpandedIds) =>
      prevExpandedIds.includes(id)
        ? prevExpandedIds.filter((expandedId) => expandedId !== id)
        : [...prevExpandedIds, id]
    );
  };


  return (
    <Container maxWidth="lg" sx={{ marginTop: "65px" ,marginLeft:5}}>
      <Navbar />
    
    {uploading && (
        <Box sx={{ width: "100%", position:'sticky',top:'9.2%',zIndex:1000,marginLeft:'10%'}}>
          <LinearProgress />
        </Box>
      )}
      {uploading && (
        <Box sx={{position:'sticky',top:10,zIndex:1000, marginLeft:'45rem', }}>
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

      {alerts && (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" style={{ marginTop: "50px", zIndex: '100' ,marginLeft:'10%'}}>
          Successfully uploaded the data.
        </Alert>
      )}
      <br />
      <Box display="flex" flexDirection="column" gap={4}>
      {loading ? (
          <Box flex={1}>  <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          style={{ marginLeft: "10%" }}
          height="400px"
        /> <Box>
          <Skeleton
            variant="text"
            animation="wave"
            width="70%"
            height={30}
            style={{ marginBottom: "8px", marginLeft: "10%"  }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="90%"
            height={60}
            style={{ marginBottom: "16px" , marginLeft: "10%" }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="50%"
            height={20}
            style={{ marginBottom: "12px" , marginLeft: "10%" }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="80%"
            height={40}
            style={{ marginBottom: "20px" , marginLeft: "10%" }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="60%"
            height={30}
            style={{ marginBottom: "16px" , marginLeft: "10%" }}
          />
            </Box>
          </Box>
        ) : (
          data.map((item, index) => (
            <Box
              key={item.id}
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              gap={4}
              mb={4}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "600px",
                  marginBottom:'60px'
                }}
              >
                {/* Thumbnails on the left */}
                {item.CarouselImages && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "15px",
                      marginRight: "20px",
                      
                  marginTop:"120px"
                    }}
                  >
                    {item.CarouselImages.map((image, i) => (
                      <Box
                        key={`thumb-${i}`}
                        sx={{
                          width: "90px",
                          height: "90px",
                          overflow: "hidden",
                          cursor: "pointer",
                          borderRadius: "10px",
                          border:
                            item.imgg === image
                              ? "3px solid #007BFF"
                              : "1px solid #ccc",
                          transition: "border-color 0.3s ease-in-out",
                        }}
                        onMouseOver={() =>
                          setData((prevData) =>
                            prevData.map((d) =>
                              d.id === item.id ? { ...d, imgg: image } : d
                            )
                          )
                        }
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${i}`}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                            borderRadius: "10px",
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Main Image with Lens Effect on Hover */}
                <ImageMagnifier src={  item.imgg || item.ImageUrl || item.CarouselImages[0]} zoomLevel={2} />
              
              </Box>

              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                
              >
              <Typography variant="h4" component="h2" gutterBottom style={{fontSize:'30px',fontFamily:'emoji',textTransform:'capitalize'}}>
                  {item.title}
                </Typography>
                <Rating name="read-only" value={5} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {item?.description && expandedIds.includes(item.id)
                    ? item.description
                    : `${item?.description?.slice(0, 500)}...`}
                  {item?.description?.length > 50 && (
                    <Button onClick={() => handleExpandClick(item.id)} color="primary">
                      {expandedIds.includes(item.id) ? 'Show Less' : 'Show More'}
                    </Button>
                  )}
                </Typography>
                <Typography variant="h6" component="p" paragraph>
                  Price: ₹ <del>{item.price}</del>{" "}
                  <strong style={{ color: "red" }}>
                    {item.price - (item.price * item.offPercent) / 100}
                  </strong>
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  {" "}
                  <Button
                    variant="contained"
                    startIcon={<UpgradeIcon />}
                    onClick={() => handleUpdateMainImage(item)}
                  >
                    Update Main Image
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddLinkIcon />}
                    onClick={() => handleUpdateCarouselImages(item)}
                  >
                    Update Carousel Images
                  </Button>
                </Box>

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Button
                    variant="contained"
                    onClick={() => handleTextUpdate("title", item)}
                  >
                    Update Title
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleTextUpdate("description", item)}
                  >
                    Update Description
                  </Button>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => handleTextUpdate("price", item)}
                  sx={{marginBottom:'20px'}}
                >
                  Update Price
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleTextUpdate("offPercent", item)}
                >
                  Update Discount
                </Button>

                {/* Hidden inputs to handle file selection */}
                <input
                  id={`mainImage-${item.id}`}
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(event) => handleMainImageChange(item, event)}
                />
                <input
                  id={`carouselImages-${item.id}`}
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*"
                  multiple
                  onChange={(event) => handleCarouselImagesChange(item, event)}
                />
<br /><br /><br />
                  <Divider sx={{ marginY: 2 }} />
                  <br /><br /><br />
                <Plus />
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default Page;
