import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { baseUrl } from './BaseUrl';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { Box, makeStyles } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
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
        justifyContent: 'space-between', // Align items horizontally
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column-reverse', // On smaller screens, stack them vertically with form below image
        },
    },
    form: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '50%',
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
        width: '50%', // Adjust the width
        [theme.breakpoints.down('sm')]: {
            width: '100%', // On smaller screens, take full width
        },

    },
    image: {

        maxWidth: '100%',
        maxHeight: '100%', // Added to maintain aspect ratio
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
    userPasswordInput: {
        display: 'flex',
        alignItems: 'center',
    },
}));

function OrphanageUserProfile() {

    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        userPassword: '',
        userMobile: '',
        userZone: '',
        userAddress: '',
        userRole: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
        username: '',
        userEmail: '',
        userPassword: '',
        confirmPassword: '',
        userMobile: '',

    });

    const ID=window.sessionStorage.getItem("userId");
    console.log(ID+" "+"userId");

    const classes = useStyles();
    const navigate = useNavigate();

    var tokenAccess=window.sessionStorage.getItem("token");
    if(tokenAccess==null)
    {
        navigate('/donateeasy/login')
    }
    const { id } = useParams();
    useEffect(() => {
        axios.get(`${baseUrl}/User/id?id=` + ID)
            .then((response) => {
                setFormData({ ...formData, userName: response.data.userName, userEmail: response.data.userEmail, userPassword: response.data.userPassword, userMobile: response.data.userMobile, userZone: response.data.userZone, userAddress: response.data.userAddress, userRole: response.data.userRole })
                console.log(response.data);
            })
            .catch((error) => { console.log(error) });

    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    }
    const validateField = (name, value) => {
        let errorMessage = '';

        switch (name) {
            case 'userName':
                errorMessage = (!formData.userName || value.length < 3) ? 'Name should have more than 3 characters' : '';
                break;
            case 'userPassword':
                errorMessage = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value)
                    ? ''
                    : 'userPassword should be at least 8 characters with a mixture of characters, numbers, and special characters';
                break;
            case 'userEmail':
                errorMessage = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
                    ? ''
                    : 'Invalid userEmail format';
                break;
            case 'userMobile':
                errorMessage = /^\d{10}$/.test(value) ? '' : 'Mobile should have exactly 10 digits';
                break;
            case 'confirmPassword':
                errorMessage = (formData.userPassword === value) ? '' : "ConfirmPassword must match Password";
                break;
            default:
                break;
        }

        setErrors({ ...errors, [name]: errorMessage });
    };

    const isFormValid = () => {
        return Object.values(errors).every((error) => !error);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isFormValid()) {
            // Submit form if validation passes
            const { confirmPassword,userEmail,userRole, ...formDataWithoutConfirmPassword } = formData;
            console.log(formDataWithoutConfirmPassword)
            axios.put(`${baseUrl}/User?UserId=`+ID, JSON.stringify(formDataWithoutConfirmPassword),
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    // console.log(formDataWithoutConfirmPassword);
                    console.log(response);
                    console.log(formDataWithoutConfirmPassword)
                    if (response.data.isSuccess) {
                        Swal.fire("Error!", "Server Error.", "error");
                    } else {
                        Swal.fire("Heyy!", "Data updated Successfully!", "success");
                        navigate('/')
                    }
                })
                .catch((error) => {
                    console.log(error);
                });

        }
        // console.log(formData);
    };

    return (
        <Container component="main" style={{ marginTop: '70px', marginLeft: '40px', marginRight: '40px' }}>

            <Paper className={classes.paper} elevation={3} style={{ margin: "auto", padding: '20px', borderRadius: "25px" }}>
                <div className={classes.root}>
                    <Box display="flex" justifyContent="space-between">
                        <div className={classes.formContainer}>
                            <div className={classes.imageContainer} style={{ width: "auto" }}>
                                <img src="https://img.freepik.com/free-vector/resume-concept-illustration_114360-255.jpg?w=740&t=st=1702023866~exp=1702024466~hmac=7f74ce3529c59f540f45336822ac92ad87a2b110d27fbec356956807025a18e7"
                                    alt="SignIn" className={classes.image} />
                            </div>
                            <div className={classes.form} style={{ width: 'auto', textAlign: 'center' }}>
                                <Typography variant="h5" component="h1" gutterBottom>
                                    User Profile
                                </Typography>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="UserName"
                                                name="userName"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                value={formData.userName}
                                                onChange={handleChange}
                                                error={!!errors.userName}
                                                helperText={errors.userName}
                                            />

                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Email"
                                                name="userEmail"
                                                type="email"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                value={formData.userEmail}
                                                onChange={handleChange}
                                                error={!!errors.userEmail}
                                                helperText={errors.userEmail}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Password"
                                                name="userPassword"
                                                type="password"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                value={formData.userPassword}
                                                onChange={handleChange}
                                                error={!!errors.userPassword}
                                                helperText={errors.userPassword}
                                            />

                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Confirm Password"
                                                name="confirmPassword"
                                                type="password"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                error={!!errors.confirmPassword}
                                                helperText={errors.confirmPassword}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Mobile"
                                                name="userMobile"
                                                type="tel"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                value={formData.userMobile}
                                                onChange={handleChange}
                                                error={!!errors.userMobile}
                                                helperText={errors.userMobile}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl variant="outlined" fullWidth required>
                                                <InputLabel>Zone</InputLabel>
                                                <Select
                                                    label="Zone"
                                                    name="userZone"
                                                    value={formData.userZone}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value="Kukatpally">Kukatpally</MenuItem>
                                                    <MenuItem value="Uppal">Uppal</MenuItem>
                                                    <MenuItem value="Medchal">Medchal</MenuItem>
                                                    <MenuItem value="Quthbullapur">Quthbullapur</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>


                                        <Grid item xs={6}>
                                            <TextField
                                                label="Address"
                                                name="userAddress"
                                                variant="outlined"
                                                multiline
                                                minRows={2}
                                                maxRows={4}
                                                fullWidth
                                                required
                                                value={formData.userAddress}
                                                onChange={handleChange}
                                                error={!!errors.address}
                                                helperText={errors.address}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl variant="outlined" fullWidth>
                                                <InputLabel>Role</InputLabel>
                                                <Select
                                                    label="Role"
                                                    name="userRole"
                                                    value={formData.userRole}
                                                    onChange={handleChange}
                                                    disabled
                                                >
                                                    <MenuItem value="Donor">Donor</MenuItem>
                                                    <MenuItem value="Orphanage">Orphanage</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                    </Grid>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        style={{ marginTop: '20px' }}
                                        disabled={!isFormValid()}
                                    >
                                        Update
                                    </Button>
                                    <NavLink className='btn btn-outline-danger' to='/donateeasy/home'>Cancel</NavLink>
                                </form>
                            </div>
                        </div>
                    </Box>
                </div>
            </Paper>
        </Container>
    );
}

export default OrphanageUserProfile