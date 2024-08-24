"use client";

import React, { useState, useEffect, useRef } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './Firebase';
import Skeleton from '@mui/lab/Skeleton';
import { Box, CircularProgress } from '@mui/material';

const CarouselSkeleton = () => (
    [...Array(3)].map((_, index) => (
        <Skeleton key={index} variant="rectangular" animation="wave" width="100%" height="400px" />
    ))
);

const Crousel = () => {
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchedOnceRef = useRef(false);  // Ref to track if data has been fetched once

    useEffect(() => {
        // Fetch data only if it hasn't been fetched already
        if (!fetchedOnceRef.current) {
            const fetchData = async () => {
                setLoading(true); // Start loading
                try {
                    const db = getFirestore(app);
                    const querySnapshot = await getDocs(collection(db, "Product_Data"));
                    let fetchedData = [];
                    querySnapshot.forEach((doc) => {
                        fetchedData.push({ id: doc.id, ...doc.data() });
                    });
                    setDatas(fetchedData);
                    fetchedOnceRef.current = true;  // Mark as fetched
                } catch (error) {
                    console.error("Error fetching documents:", error);
                } finally {
                    setLoading(false);  // End loading
                }
            };

            fetchData();
        }
    }, []);  // Empty dependency array ensures this effect runs once

    return (
        <div style={{ height: '400px', marginTop: '65px', position: 'relative' }}>
            <Carousel
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                showArrows={true}
                infiniteLoop={true}
                useKeyboardArrows={true}
                autoPlay={true}
                stopOnHover={true}
                swipeable={true}
                dynamicHeight={false}  // Disable dynamic height to maintain consistency
                emulateTouch={true}
                autoFocus={true}
                className="carousel-container"  // Added class for additional styling
            >
                {loading ? (
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <svg width={0} height={0}>
                            <defs>
                                <linearGradient id="my_gradient" x1="10%" y1="10%" x2="10%" y2="100%">
                                    <stop offset="0%" stopColor="#e01cd5" />
                                    <stop offset="100%" stopColor="#1CB5E0" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
                    </Box>
                ) : datas.length === 0 ? (
                    <CarouselSkeleton />
                ) : (
                    datas
                        .filter((data) => data.type && data.type.title === "Carousel Images")
                        .flatMap((data) => data.CarouselImages.map((image, index) => (
                            <div key={`${data.id}-${index}`} style={{ height: '400px', width: '100%' }}>
                                <img 
                                    src={image} 
                                    alt={`Slide ${data.id}-${index}`} 
                                    style={{ objectFit: 'cover', height: '100%', width: '100%' }} 
                                    loading="lazy"  // Lazy load images
                                />
                            </div>
                        )))
                )}
            </Carousel>
        </div>
    );
};

export default Crousel;
