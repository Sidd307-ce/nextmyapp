"use client";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Grid, Box, Button, Paper, Divider, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeItemFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import Navbar from '../Components/navbar/page';
import Link from 'next/link';

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [items, setItems] = useState([]);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setItems(storedItems);

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 8);
    setEstimatedDeliveryDate(currentDate.toLocaleDateString());
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      setItems(cartItems);
    }
  }, [cartItems]);

  const handleRemoveItem = (id) => {
    dispatch(removeItemFromCart(id));
    const updatedItems = items.filter(item => item.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    setItems(updatedItems);
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity: parseInt(quantity) }));
      const updatedItems = items.map(item => item.id === id ? { ...item, quantity: parseInt(quantity) } : item);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      setItems(updatedItems);
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    localStorage.removeItem('cartItems');
    setItems([]);
  };

  const calculateDiscountedPrice = (price, offPercent) => {
    return price - (price * offPercent) / 100;
  };

  const getTotalPrice = () => {
    return items.reduce((acc, item) => acc + calculateDiscountedPrice(item.price, item.offPercent) * item.quantity, 0).toFixed(2);
  };

  return (
    <div>
      <Container maxWidth="100%" sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Shopping Cart
        </Typography>
        {items.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center' }}>Your cart is empty.</Typography>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 4, maxHeight: '70vh', overflowY: 'auto' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Items in Cart</Typography>
                <Divider sx={{ mb: 2 }} />
                {items.map((item) => (
                  <Paper key={item.id} elevation={3} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={3}>
                        <img
                          src={item.ImageUrl}
                          alt={item.title}
                          style={{ width: '100%', height: 'auto', borderRadius: 5 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Quantity
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Button
                            variant="outlined"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            sx={{ minWidth: '30px', padding: '5px 10px', mr: 1 }}
                          >
                            -
                          </Button>
                          <Typography variant="body2" sx={{ mx: 2 }}>
                            {item.quantity}
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            sx={{ minWidth: '30px', padding: '5px 10px', mr: 1 }}
                          >
                            +
                          </Button>
                          <IconButton
                            onClick={() => handleRemoveItem(item.id)}
                            sx={{ ml: 'auto', color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Discount: {item.offPercent}% off
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                          ₹{calculateDiscountedPrice(item.price, item.offPercent).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={handleClearCart}
                  sx={{ mt: 2 }}
                >
                  Delete All
                </Button>
              </Box>
              <Link href='Orderform'>
              <Button
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#f0c14b', color: '#111', ':hover': { backgroundColor: '#e5b33d' } }}
              >
                Proceed to Pay
              </Button></Link>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Merchandise Subtotal: ₹{getTotalPrice()}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Shipping and Handling: ₹50
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: 'green', fontWeight: 'bold' }}>
                  Discount: - ₹50
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, color: 'red', fontWeight: 'bold' }}>
                  <span style={{ color: 'black', fontWeight: '500' }}> Pre-Tax Total :</span> ₹{getTotalPrice()}
                </Typography>
                <Button variant="contained" color="primary" fullWidth sx={{ mb: 2, ':hover': { backgroundColor: '#1976d2' } }}>
                  Checkout
                </Button>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Estimated Delivery by {estimatedDeliveryDate}
                </Typography>
               <Link href='Orderform'>
               <Button variant="outlined" color="secondary" fullWidth >
                  Pay
                </Button></Link>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default ShoppingCart;
