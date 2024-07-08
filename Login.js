import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from './BaseUrl';
import Swal from 'sweetalert2';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    makeStyles,
    Box,
    CircularProgress,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paper: {
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
    },
    formContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column-reverse',
        },
    },
    form: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
        textAlign: 'center',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    imageContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '45%', 
        [theme.breakpoints.down('sm')]: {
            width: '100%', 
        },


    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%', 
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100px',
    },
    errorText: {
        color: 'red',
        marginTop: theme.spacing(1),
    },
    passwordInput: {
        display: 'flex',
        alignItems: 'center',
    },
}));


const Login = () => {
    const [formData, setFormData] = useState({
        userEmail: '',
        userPassword: '',
    });
    const navigate = useNavigate();
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (userEmail) => {
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return regex.test(userEmail);
    };

    const validatePassword = (userPassword) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(userPassword);
    };

    const handleInput = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const handleLogin = async (event) => {
        if (!formData.userEmail || !formData.userPassword) {
            setError('Email and password are required');
            return;
        } else if (!validateEmail(formData.userEmail)) {
            setError('Invalid email format');
            return;
        } else if (!validatePassword(formData.userPassword)) {
            setError('Password should be at least 8 characters with a mixture of characters, numbers, and special characters');
            return;
        }

        setError('');
        setLoading(true);
        // Add your login logic here
         await axios.post(`${baseUrl}/User/Login`, JSON.stringify(formData),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                console.log("response = "+JSON.stringify(response.data));
                const userData = response.data;
                if (response.status === 200) {
                    const token=Math.random();
                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem("role", userData.userRole);
                    sessionStorage.setItem("userId", userData.userID);
                    sessionStorage.setItem("signInStatus", true);
                    switch (userData.userRole) {
                        case "Donor":
                            Swal.fire("Good job!", "Login Successfully!", "success");
                            navigate("/donateeasy/donorPage");
                            break;
                        case "Orphanage":
                            axios.get(`${baseUrl}/Orphanage/UserId?userId=${JSON.stringify(userData.userID)}`)
                            .then((response)=>{
                                if(response.status === 200 && response.data.orphanageAccountStatus){
                                    sessionStorage.setItem("orphanageId", response.data.orphanageID);
                                    Swal.fire("Good job!", "Login Successfully!", "success");
                                    navigate("/donateeasy/donationhistory");
                                }
                                else{
                                    Swal.fire("Oops!","Your orphanage still not yet verified", "error");
                                    navigate("/donateeasy/login");
                                }
                            })
                            .catch((error)=>{
                                console.log("Orphanage status retrieval error", error);
                                alert("Technical error from our end");
                            });
                            break;
                        case "Admin":
                            Swal.fire("Good job!", "Login Successfully!", "success");
                            navigate("/donateeasy/");
                            break;
                        default:
                            Swal.fire("Invalid Credentials","Register First", "error");
                    }
                }
                else
                {
                    // toast.error("Please Enter Va7lid Credentials");
                    Swal.fire("Invalid Credentials",response.data.message, "error");
                    console.log("Response message = "+response.data);
                    // event.target.reset()
                }
            })
            .catch((error) => {
                console.log("Error = "+error);
                console.log("msg = "+error.response.data.message)
                Swal.fire("Oops!",error.response.data.message, "error");
            });
        console.log('Login clicked');
        // console.log(formData);
    };

    const forgotPassword = true;
    // const togglePasswordVisibility = () => {
    //     setShowPassword(!showPassword);
    // };

    return (

        <div className={classes.root}>
            <Container component="main" style={{ marginTop: '70px', marginLeft: '40px', marginRight: '40px'}}>
                <Paper className={classes.paper} elevation={3} style={{ borderRadius: '30px', margin:"auto"}}>
                    <div className={classes.root}>
                        <Box display="flex" justifyContent="space-between" >
                            <div className={classes.formContainer}>
                                <div className={classes.imageContainer} style={{ width: "auto" }}>
                                    <img src="https://media.istockphoto.com/id/1219250752/vector/online-registration-and-sign-up-concept-young-man-signing-up-or-login-to-online-account-on.jpg?b=1&s=612x612&w=0&k=20&c=9VeK3mjAMqacrsUaIB_Paqv7EkbU3cqmDkDERpix28M="
                                        alt="SignIn" className={classes.image} />
                                </div>
                                <div className={classes.form} style={{ width: 'auto', textAlign: 'center' }}>
                                    <Typography variant="h5">User Login</Typography>
                                    <form className={classes.form} noValidate>
                                        {/* Error message for invalid email format */}
                                        {error && (
                                            <Typography variant="body2" color="error">
                                                {error}
                                            </Typography>
                                        )}
                                        <br/>
                                        <TextField
                                            variant="outlined"
                                            // margin="normal"
                                            required
                                            fullWidth
                                            id="userEmail"
                                            label="Email Address"
                                            name="userEmail"
                                            // autoComplete="useremail"
                                            // autoFocus
                                            value={formData.userEmail}
                                            onChange={handleInput}
                                            error={Boolean(error) && !validateEmail(formData.userEmail)}
                                            helperText={Boolean(error) && !validateEmail(formData.userEmail) && 'Invalid email format'}
                                        />
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="userPassword"
                                            label="Password"
                                            type="password"
                                            // type={showPassword ? 'text' : 'password'}
                                            id="userPassword"
                                            autoComplete="current-password"
                                            value={formData.userPassword}
                                            onChange={handleInput}
                                            error={Boolean(error) && !validatePassword(formData.userPassword)}
                                        />
                                        <Button
                                            type="button"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                            onClick={handleLogin}
                                            // disabled={loading}
                                        >
                                       Login
                                             {/* {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}  */}
                                        </Button>
                                    </form>
                                    <div className={classes.registerLink}>
                                        <NavLink className='btn btn-outline-primary' to='/donateeasy/register' style={{ width: "100%" }}>Register Here</NavLink>
                                        <br/><br/>
                                        <NavLink className='btn btn-outline-primary' to={`/donateeasy/verifyEmail/${forgotPassword}`} style={{ width: "100%" }}>Forgot Password?</NavLink>
                                        <p style={{ marginLeft: "5%" }}>Create a new account?</p>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </div>
                </Paper>
            </Container>
        </div>

    );
};

export default Login;
