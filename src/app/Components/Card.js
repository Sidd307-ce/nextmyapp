"use client";

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './Firebase';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Button, Rating, Skeleton, styled } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../redux/cartSlice';

const ExpandMore = styled((props) => <IconButton {...props} />)(
  ({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
  })
);

const DiscountBadge = styled('div')({
  position: 'absolute',
  top: '8px',
  right: '8px',
  background: 'red',
  color: 'white',
  borderRadius: '50%',
  width: '18px',
  height: '26px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '14px',
  visibility: 'hidden',
});

const PriceWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  textDecoration: 'line-through',
  marginRight: theme.spacing(1),
}));

const Cards = ({ value }) => {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, 'Product_Data'));
      let fetchedData = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() });
      });
     // console.log('Fetched documents:', fetchedData);
      setDatas(fetchedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  };

 

  const handleAddToCart = (item) => {
    dispatch(addItemToCart(item));
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.querySelector('.discount-badge').style.visibility = 'visible';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.querySelector('.discount-badge').style.visibility = 'hidden';
  };
  const filteredData = datas.filter((data) => data.type && data.type.title === value);

  return (
    <React.Fragment>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'start',
          marginLeft:'20px',
          alignItems: 'center',
        }}
      >
        {loading ||  filteredData.length === 0 ? (
          <CarouselSkeleton />
        ) : (
          datas
            .filter((data) => data.type.title === value)
            .map((data) => (
              <Card
                key={data?.id}
                sx={{
                  width: '345px',
                  maxWidth: '100%',
                  marginBottom: '20px',
                  position: 'relative',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    zIndex: 1,
                  },
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={{
                    pathname: '/deepdetail',
                    query: { data: JSON.stringify(data) },
                  }}
                  passHref
                  style={{textDecoration:'none'}}
                >
                  <CardMedia
                    component="img"
                    height="194"
                    image={data?.ImageUrl}
                    alt={data?.title}
                  />
                
                {data.offPercent && (
                  <DiscountBadge className="discount-badge">
                    {data.offPercent}%
                  </DiscountBadge>
                )}
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    style={{
                      textTransform: 'capitalize',
                      fontWeight: '600',
                      fontSize: '18px',
                    fontFamily:'emoji',
                    color:'black'
                    }}
                  >
                    {data?.title.slice(0, 100)}
                  </Typography>
                  <Rating name="read-only" value={5} readOnly />
                  <Typography variant="body2" color="text.secondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis' ,position:'relative',top:'5px'}}>
                   {data?.description.slice(0, 50)}...
                   
                  </Typography>
                </CardContent>
                </Link>
              
                <CardActions style={{position:'relative',top:'-10px'}}>
                <br /><br />
                  <PriceWrapper>
                    <OriginalPrice variant="body2" color="text.secondary" style={{fontSize:'14px'}}>
                      ₹{data?.price}
                    </OriginalPrice>
                    <Typography variant="body2" color="red" style={{fontSize:'17px'}}>
                      ₹{calculateDiscountedPrice(data?.price, data?.offPercent)}
                    </Typography>
                  </PriceWrapper>
               
                  <Link href="/cart" passHref>
                    <Button
                      variant="contained"
                      aria-label="add to cart"
                      endIcon={<AddShoppingCartIcon />}
                      onClick={() => handleAddToCart(data)}
                    >
                      Add to Cart
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            ))
        )}
      </div>
    </React.Fragment>
  );
};

const calculateDiscountedPrice = (price, discountPercent) => {
  const discountedPrice = price * (1 - discountPercent / 100);
  return discountedPrice.toFixed(2);
};

const CarouselSkeleton = () =>
  [...Array(4)].map((_, index) => (
    <Card
      key={index}
      sx={{
        width: '345px',
        maxWidth: '100%',
        marginBottom: '20px',
        position: 'relative',
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        height={194}
        sx={{ width: '100%' }}
      />
      <CardContent sx={{ width: '100%' }}>
        <Skeleton variant="text" animation="wave" />
        <Skeleton variant="text" animation="wave" />
      </CardContent>
    </Card>
  ));

export default Cards;
