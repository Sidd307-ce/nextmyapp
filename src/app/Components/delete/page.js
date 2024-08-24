"use client";
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { app } from '../Firebase';

import Skeleton from '@mui/material/Skeleton'; // Make sure this is imported
import { Box, Typography, Button, Rating, Container, Alert, CircularProgress, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import Navbar from '../navbar/page';
import { getStorage,deleteObject, ref as storageRef } from "firebase/storage"; // Import deleteObject
import Plus from '../Plus';
import ImageMagnifier from '../ImageMagnifier';

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState([]);
  const db = getFirestore(app);
  const storage = getStorage(app);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const docRef = collection(db, "Product_Data");
      const docSnap = await getDocs(docRef);
      
      const fetchedData = docSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setData(fetchedData); // Set all data to state
      setLoading(false);
    };

    fetchData();
  }, [db]);

  const handleExpandClick = (id) => {
    setExpandedIds((prevExpandedIds) =>
      prevExpandedIds.includes(id)
        ? prevExpandedIds.filter((expandedId) => expandedId !== id)
        : [...prevExpandedIds, id]
    );
  };

 
  const handleDelete = async (id) => {
    try {
      console.log("Starting deletion process for item with id:", id);
  
      // Find the item by id
      const item = data.find(item => item.id === id);
      console.log("Found item:", item);
  
      if (!item) {
        alert("Item not found.");
        return;
      }
  
      // Construct the references to the main image and carousel images in Firebase Storage
      const mainFileRef = storageRef(storage, `Images/${item.type.title}/${item.mainImageName}`);
      console.log("Main image ref:", mainFileRef);
  
      const carouselDeletePromises = item.carouselImgNames?.map(carouselImgName => {
        const carouselFileRef = storageRef(storage, `Images/carousel/${carouselImgName}`);
        console.log("Deleting carousel image ref:", carouselFileRef);
        return deleteObject(carouselFileRef).catch((error) => {
          console.warn(`Failed to delete carousel image: ${carouselImgName}`, error);
          return null;
        });
      }) || [];
  
      await Promise.all(carouselDeletePromises);
  
      await deleteObject(mainFileRef).catch((error) => {
        console.warn("Failed to delete the main image", error);
      });
  
      await deleteDoc(doc(db, "Product_Data", id));
  
      setData(data.filter(item => item.id !== id));
  
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item: ", error);
      alert("Failed to delete the item.");
    }
  };
  const handleButtonClick = () => {
    const isConfirmed = window.confirm("Are you sure you want to delete all items?");
    if (isConfirmed) {
      handleDeleteAll();
    }
  };
  
  const handleDeleteAll = async () => {
    try {
      // Step 1: Fetch all items
      const querySnapshot = await getDocs(collection(db, "Product_Data"));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      // Step 2: Delete images from Firebase Storage
      const deletePromises = items.map(async (item) => {
        // Construct the references to the main image and carousel images
        const mainFileRef = storageRef(storage, `Images/${item.type.title}/${item.mainImageName}`);
        
        const carouselDeletePromises = item.carouselImgNames?.map(carouselImgName => {
          const carouselFileRef = storageRef(storage, `Images/carousel/${carouselImgName}`);
          return deleteObject(carouselFileRef).catch((error) => {
            console.warn(`Failed to delete carousel image: ${carouselImgName}`, error);
          });
        }) || [];
  
        await Promise.all(carouselDeletePromises);
  
        await deleteObject(mainFileRef).catch((error) => {
          console.warn("Failed to delete the main image", error);
        });
  
        // Step 3: Delete document from Firestore
        await deleteDoc(doc(db, "Product_Data", item.id));
      });
  
      // Wait for all delete operations to complete
      await Promise.all(deletePromises);
  
      // Step 4: Update UI
      setData([]); // Assuming `setData` is used to update the state and clear the UI
  
      alert("All items deleted successfully!");
    } catch (error) {
      console.error("Error deleting all items: ", error);
      alert("Failed to delete all items.");
    }
  };

 

  return (
    <Container maxWidth="lg" sx={{ marginTop: "65px" ,marginLeft:5}}>
    <Navbar />

      {loading && (
        <Box style={{position:'sticky',top:10,zIndex:1000,marginLeft:'45rem', }}>
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
        </Box></Box>
        
        ) : (
          data.map((item, index) => (
            <Box key={item.id} display="flex"  flexDirection={{ xs: "column", md: "row" }} gap={4} mb={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '600px',
                }}
              >
                {/* Thumbnails on the left */}
                {item.CarouselImages && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '15px',
                      marginRight: '20px',
                      
                  marginTop:"120px"
                    }}
                  >
                    {item.CarouselImages.map((image, i) => (
                      <Box
                        key={`thumb-${i}`}
                        sx={{
                          width: '90px',
                          height: '90px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          borderRadius: '10px',
                          border: item.imgg === image ? '3px solid #007BFF' : '1px solid #ccc',
                          transition: 'border-color 0.3s ease-in-out',
                        }}
                        onMouseOver={() => setData(prevData => prevData.map(d => d.id === item.id ? {...d, imgg: image} : d))}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${i}`}
                          style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                            borderRadius: '10px',
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Main Image with Lens Effect on Hover */}
                <ImageMagnifier src={ item.imgg ||item.ImageUrl|| item.CarouselImages[0]} zoomLevel={2} />
               
              </Box>

              <Box flex={1} display="flex" flexDirection="column" >
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
                  <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                  <Button variant="outlined" color="error" sx={{width:'150px'}} startIcon={<DeleteIcon />}  onClick={handleButtonClick}>
                    Delete All
                  </Button>
                  <br /><br /><br />
                  <Divider sx={{ marginY: 2 }} />
                  <br /><br /><br /><br /><br />
                </Box>
              </Box>
            </Box>
          ))
        )}
        <Plus/>
    
      </Box>
 </Container>
  );
};

export default Page;
