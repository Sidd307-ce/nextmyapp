"use client"; // This directive is necessary if you want to use hooks in your component
import React, { Suspense, useContext, useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useSearchParams } from "next/navigation";
import { Skeleton, Typography, Button, Box, Container, IconButton, Avatar, TextField, Divider, Rating, CircularProgress } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Navbar from "../Components/navbar/page";
import Footer from "../Components/footer/page";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../redux/cartSlice";
import { MyContext } from "../additem/useContext";
import SendIcon from '@mui/icons-material/Send';

import { app } from "../Components/Firebase";
import { collection, addDoc, getDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import ImageMagnifier from "../Components/ImageMagnifier";



const Deepdetail = ({ initialRating }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const searchParams = useSearchParams();
  const { user } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const db = getFirestore(app);
  const handleAddToCart = (item) => {
    dispatch(addItemToCart(item));
  };

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(3.5);
  const [expandedIds, setExpandedIds] = useState([]); 
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataString = searchParams.get("data"); // Extracting the query parameter
        if (dataString) {
          const parsedData = JSON.parse(dataString);
          setData(parsedData); // Set data from parsed JSON
          setLoading(false); // Set loading to false after data is loaded
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Ensure loading state is set to false on error
      }
    };

    fetchData();
  }, [searchParams]);

  const handleExpandClick = (id) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter((itemId) => itemId !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };


  useEffect(() => {
    if (data) {
      fetchComments();
    }
  }, [data]);

  const fetchComments = async () => {
    try {
      const productDoc = await getDoc(doc(db, "Product_Data", data.id));
      if (productDoc.exists()) {
        setComments(productDoc.data().comments || []);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;

    const comment = {
      text: newComment,
      userName: user.displayName,
      userPhoto: user.photoURL,
      timestamp: new Date(),
      rating: rating,
    };

    try {
      const productRef = doc(db, "Product_Data", data.id);
      await updateDoc(productRef, {
        comments: arrayUnion(comment),
      });
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: "65px" ,marginLeft:0}}>
      <Navbar />
   
      {loading && (
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
         <br />
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
      
        {loading ? (
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height="400px"
            style={{ marginLeft: "10%" }}
          />
        ) : (
          <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "600px",
            }}
          >
            {data && data.CarouselImages && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "15px",
                  marginRight: "20px",
                  marginTop: "120px",
                }}
              >
                {data.CarouselImages.map((image, index) => (
                  <Box
                    key={`thumb-${index}`}
                    sx={{
                      width: "90px",
                      height: "90px",
                      overflow: "hidden",
                      cursor: "pointer",
                      borderRadius: "10px",
                      border: selectedImage === image ? "3px solid #007BFF" : "1px solid #ccc",
                      transition: "border-color 0.3s ease-in-out",
                    }}
                    onMouseOver={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index}`}
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

            <ImageMagnifier src={selectedImage || data?.ImageUrl} zoomLevel={2} />
          </Box>
        </>
        
        
        
        
        )}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          {data ? (
            <Box>
              <Typography variant="h4" component="h2" gutterBottom style={{fontSize:'30px',fontFamily:'emoji',textTransform:'capitalize'}}>
                {data.title}
              </Typography>
              <Rating name="read-only" value={5} readOnly />
              <Typography variant="body2" color="text.secondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {expandedIds.includes(data.id) ? data?.description : `${data?.description.slice(0, 500)}...`}
                    {data?.description.length > 50 && (
                      <Button onClick={() => handleExpandClick(data.id)} color="primary">
                        {expandedIds.includes(data.id) ? 'Show Less' : 'Show More'}
                      </Button>
                    )}
                  </Typography>
              <Typography variant="h6" component="p" paragraph>
                Price: ₹ <del>{data.price}</del>{" "}
                <strong style={{ color: "red" }}>
                  {data.price - (data.price * data.offPercent) / 100}
                </strong>
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Button
                  variant="outlined"
                  onClick={() => alert("Added to Wishlist")}
                >
                  Add to Wishlist
                </Button>
              </Box>

              <Link href="cart" style={{ textDecoration: "none" }}>
                {" "}
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={() => handleAddToCart(data)}
                >
                  {" "}
                  ADD TO CART{" "}
                </Button>
              </Link>
            </Box>
          ) : (
            <Box>
              <Skeleton
                variant="text"
                animation="wave"
                width="70%"
                height={30}
                style={{ marginBottom: "8px" }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                width="90%"
                height={60}
                style={{ marginBottom: "16px" }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                width="50%"
                height={20}
                style={{ marginBottom: "12px" }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                width="80%"
                height={40}
                style={{ marginBottom: "20px" }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                width="60%"
                height={30}
                style={{ marginBottom: "16px" }}
              />
            </Box>
          )}
          <Box mt={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              GUARANTEED SAFE CHECKOUT
            </Typography>
            <Box display="flex" gap={2}>
              <img
                src="https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/visa-512.png"
                alt="Visa"
                style={{ height: "50px", width: "auto" }}
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT86oOYoFoZbE6YBjHFQqr34-sEUr1NKYFqTg&s"
                alt="MasterCard"
                style={{ height: "50px", width: "auto" }}
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjb_HOA_gk1t33h9w6MSJHPknLdkRKEHrvSg&s"
                alt="American Express"
                style={{ height: "50px", width: "auto" }}
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsMQfyuiUrLNvEAzv3ULjTJRrB3SOQiRKC0g&s"
                alt="Discover"
                style={{ height: "50px", width: "auto" }}
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLWzroaDNPnTa_ZQFhvVT46CUgSzADuu9vCA&s"
                alt="PayPal"
                style={{ height: "50px", width: "auto" }}
              />
            </Box>
       
          </Box>
        
        </Box>
      
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Comments</Typography>
        {user ? (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <IconButton size="large" edge="end" color="black">
                <Avatar alt={user.displayName} src={user.photoURL} />
              </IconButton>
              <TextField
                id="standard-basic"
                label="Add a comment ..."
                variant="standard"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                fullWidth
              />
              <IconButton onClick={handleCommentSubmit} color="primary">
                <SendIcon />
              </IconButton>
            </Box>
            <Rating
              name="user-rating"
              value={rating}
              precision={0.5}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              sx={{ position: "relative", left: "50px", mt: 2 }}
            />
          </Box>
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Please log in to leave a comment.
          </Typography>
        )}
        <Box sx={{ mt: 4 }}>
          {comments.map((comment, index) => (
            <Box key={index}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px", mb: 2 }}>
                <Avatar alt={comment.userName} src={comment.userPhoto} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {comment.userName}
                  </Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                  <Rating
                    name={`comment-rating-${index}`}
                    value={comment.rating}
                    precision={0.5}
                    readOnly
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
            </Box>
          ))}
        </Box>
      </Box>
      <br /> <br /> <br /> <br /> <br /> <br />
      <Footer />
    </Container>
  );
};


export default Deepdetail;