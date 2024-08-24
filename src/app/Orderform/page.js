"use client"

import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { app } from "../Components/Firebase";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import useRazorpay from "react-razorpay";
import { useRouter } from 'next/navigation'; // Using next/navigation instead of next/router
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { MyContext } from '../additem/useContext';

const steps = ['Enter Your Location', 'Order Details', 'Payment'];
const db = getFirestore(app);

const CheckoutForm = ({ totalPay, onPaymentSuccess }) => {
  const [errorMessage, setErrorMessage] = React.useState('');
  const [Razorpay] = useRazorpay();
  const router = useRouter();

  const pay = async (event) => {
    event.preventDefault();

    try {
      const options = {
        description: "Adding To Wallet",
        currency: "INR",
        name: "New Sagar Computer",
        key: "rzp_test_6YWTwaNc8vSDC7", // Replace with your actual key_id
        amount: totalPay * 100, // Amount is in currency subunits. Default currency is INR.
        prefill: {
          email: "void@razorpay.com",
          contact: "9191919191",
          name: "RazorPay Software",
        },
        theme: { color: "#F37254" },
        handler: function (response) {
          onPaymentSuccess(response.razorpay_payment_id);
        },
      };

      const rzp1 = new Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        setErrorMessage(response.error.description);
      });

      rzp1.open();
    } catch (error) {
      console.log("Error in doing order!!", error);
      alert("Error in doing Payment", error);
    }
  };

  return (
    <form onSubmit={pay}>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Pay Now
      </Button>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </form>
  );
}

export default function page() {
  const { setUser, user } = React.useContext(MyContext);
  const [activeStep, setActiveStep] = React.useState(0);
  const [locationData, setLocationData] = React.useState({});
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const router = useRouter();
  const dispatch = useDispatch(); // Get dispatch function from Redux

  React.useEffect(() => {
    if (!user || user.length === 0) {
      // If user is not logged in or user is an empty array, show toast and navigate to home
      alert('Please login to continue.');
      router.push('/');
    }
  }, [user, router]);

  const handleNext = () => {
    if (activeStep === 0 && !validateLocationData()) {
      // Validate location data before allowing to proceed
      setSnackbarMessage('Please fill in all the details.');
      setOpenSnackbar(true);
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleLocationChange = (e) => {
    setLocationData({
      ...locationData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentChange = (event, newValue) => {
    setPaymentMethod(newValue);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };



    // Check if window is available for client-side operations
    const cartItems = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cartItems')) || [] : [];

    // Other code..
  const handlePaymentSuccess = async (paymentId) => {
    try {
    
      await addDoc(collection(db, 'orders'), {
        locationData,
        paymentMethod,
        cartItems,
        totalPay,
        paymentId,
        createdAt: new Date(),
      });
      console.log('Order data saved successfully');
      setSnackbarMessage('Order data saved successfully');
      setOpenSnackbar(true);
      dispatch(clearCart());
      localStorage.removeItem('cartItems');
      setTimeout(() => {
        router.push('/'); // Navigate to home page after successful order save
      }, 1000); // Delay navigation by 1 second
    } catch (e) {
      console.error('Error adding document: ', e);
      setSnackbarMessage('Error saving order data');
      setOpenSnackbar(true);
    }
  };

  const validateLocationData = () => {
    // Perform validation for location data fields
    // Return true if all fields are filled, false otherwise
    return Object.values(locationData).every((value) => value.trim() !== '');
  };

  
  const totalPay = cartItems.reduce((total, item) => total + parseFloat(item.price), 0);

  return (
    <Box sx={{ maxWidth: '100%', mt: 2, p: 2, bgcolor: '#fff' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > :not(style)': { m: 1, width: '90%' },
            '@media (min-width:600px)': {
              '& > :not(style)': { width: '60%' },
            },
            '@media (min-width:960px)': {
              '& > :not(style)': { width: '35ch' },
            },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField label="Name" variant="standard" name="name" value={user?.displayName || 'John Doe'} disabled />
          <TextField label="Email" variant="standard" name="email" value={user?.email || 'john.doe@example.com'} disabled />
          <TextField label="Address" variant="standard" name="address" onChange={handleLocationChange} />
          <TextField label="Phone No" variant="standard" name="phone" onChange={handleLocationChange} />
          <TextField label="Alternative Phone No" variant="standard" name="altPhone" onChange={handleLocationChange} />
          <TextField label="House No" variant="standard" name="houseNo" onChange={handleLocationChange} />
          <TextField label="Landmark" variant="standard" name="landmark" onChange={handleLocationChange} />
          <TextField label="City" variant="standard" name="city" onChange={handleLocationChange} />
        </Box>
      )}

      {activeStep === 1 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 2,
            '& > :not(style)': { m: 1, width: '90%' },
            '@media (min-width:600px)': {
              '& > :not(style)': { width: '60%' },
            },
            '@media (min-width:960px)': {
              '& > :not(style)': { width: '35ch' },
            },
          }}
        >
          <div style={{ width: '100%', maxHeight: '400px', overflow: 'auto' }}>
            {cartItems.map((item) => (
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
                      <Button variant="outlined" sx={{ minWidth: '30px', padding: '5px 10px', mr: 1 }}>
                        -
                      </Button>
                      <Typography variant="body2" sx={{ mx: 2 }}>
                        {item.quantity}
                      </Typography>
                      <Button variant="outlined" sx={{ minWidth: '30px', padding: '5px 10px', mr: 1 }}>
                        +
                      </Button>
                    </Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold', color: '#d32f2f' ,mt:3,fontSize:'22px'}}>
                      ₹{item.price}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </div>

          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={['Cash on Delivery', 'Pay Online']}
            renderInput={(params) => <TextField {...params} label="Payment" />}
            onChange={handlePaymentChange}
          />
          <Button variant="outlined" color="secondary" fullWidth onClick={handleNext}>
            Total Pay: ₹{totalPay}
          </Button>
        </Box>
      )}

      {activeStep === 2 && paymentMethod === 'Pay Online' && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Payment Step
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <CheckoutForm totalPay={totalPay} onPaymentSuccess={handlePaymentSuccess} />
          </Box>
        </Box>
      )}

{activeStep === 2 && paymentMethod === 'Cash on Delivery' && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Order Placed Successfully!
          </Typography>
          <Typography variant="h6" gutterBottom>
          <img src="https://i.pinimg.com/originals/32/b6/f2/32b6f2aeeb2d21c5a29382721cdc67f7.gif" alt="" height={420}/>
          </Typography>
             <Button
            variant="contained"
            color="primary"
            onClick={() => {  dispatch(clearCart());
              localStorage.clear('cartItems')
              setSnackbarMessage('Order placed successfully!');
              setOpenSnackbar(true);
              setTimeout(() => {
                router.push('/');
              }, 1000);
            }}
          >
            Continue
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep === steps.length - 1 ? (
          <Button onClick={handleReset}>Reset</Button>
        ) : (
          <Button onClick={handleNext}>
            {activeStep === steps.length - 2 ? 'Finish' : 'Next'}
          </Button>
        )}
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose} message={snackbarMessage} />
    </Box>
  );
}