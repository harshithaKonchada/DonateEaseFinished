import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "./BaseUrl";
import { tokenGenerator } from "./TokenGenerator";
import { VerifyEmail } from "./VerifyEmail";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
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
} from "@mui/material";
import { Box, makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
  },
  formContainer: {
    display: "flex",
    justifyContent: "space-between", // Align items horizontally
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse", // On smaller screens, stack them vertically with form below image
    },
  },
  form: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    width: "50%",
    textAlign: "center",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  imageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "50%", // Adjust the width
    [theme.breakpoints.down("sm")]: {
      width: "100%", // On smaller screens, take full width
    },
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%", // Added to maintain aspect ratio
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100px",
  },
  errorText: {
    color: "red",
    marginTop: theme.spacing(1),
  },
  userPasswordInput: {
    display: "flex",
    alignItems: "center",
  },
}));
const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    userMobile: "",
    userZone: "",
    userRole: "",
    confirmationToken: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    userEmail: "",
    userPassword: "",
    confirmPassword: "",
    userMobile: "",
  });

  const [generatedToken, setGeneratedToken] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [clicks, setClicks] = useState(1);
  useEffect(() => {
    console.log("ugenToken", generatedToken);
    console.log("uformToken", formData.confirmationToken);
  }, [generatedToken, formData.confirmationToken]);

  const classes = useStyles();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setUserInteracted(true);
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);

    // var tokenValue = tokenGenerator();
    // //console.log(tokenValue);
    // setFormData({ ...formData, [name]: value, ["confirmationToken"]: tokenValue});
  };
  const validateField = (name, value) => {
    let errorMessage = "";
    switch (name) {
      case "userName":
        errorMessage =
          !formData.userName || value.length < 3
            ? "Name should have more than 3 characters"
            : "";
        break;
      case "userPassword":
        errorMessage =
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
            value
          )
            ? ""
            : "userPassword should be at least 8 characters with a mixture of characters, numbers, and special characters";
        break;
      case "userEmail":
        errorMessage = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          value
        )
          ? ""
          : "Invalid userEmail format";
        break;
      case "userMobile":
        errorMessage = /^\d{10}$/.test(value)
          ? ""
          : "Mobile should have exactly 10 digits";
        break;
      case "confirmPassword":
        errorMessage =
          formData.userPassword === value
            ? ""
            : "ConfirmPassword must match Password";
        break;
      default:
        break;
    }

    setErrors({ ...errors, [name]: errorMessage });
  };

  const isFormValid = () => {
    return Object.values(errors).every((error) => !error);
  };

  const config = {
    // Host : "smtp.elasticemail.com",
    // Username : "homedecor@yopmail.com",
    // Password : "A77FBB4AE611247F63EBBCF9D3E1A63C7B55",
    // Port:2525,
    //SecureToken:"0ad3f935-2a12-4b33-852a-e380c725c811",
    SecureToken: "d318e93a-15d1-47c0-84b1-60368269bd34",
    To: `${formData.userEmail}`,
    From: "18r21a0487@mlrinstitutions.ac.in",
    Subject: "Verify your email Id",
    Body: `Hi ${formData.userName}. Verify your email with the link given below. Your verification code is ${formData.confirmationToken} <br/><br/><center>
        <b><a href='http://localhost:3000/homedecor/verifyemail' style="color:blue">Verify your Email ID. Click Here</a></b></center>.`,
  };
  const sendEmail = () => {
    var templateParams = {
      UserName: formData.userName,
      UserEmail: formData.userEmail,
      ConfirmationToken: formData.confirmationToken,
    };
    console.log(templateParams);
    emailjs
      .send(
        "service_5pv1i1o",
        "template_ojadr5s",
        templateParams,
        "112afEYMmcYJHEIap"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGeneratedToken(tokenGenerator());
    setFormData({ ...formData, ["confirmationToken"]: tokenGenerator() });
    var c = clicks;
    c++;
    setClicks(c);
    if (clicks <= 1) {
      return;
    }

    if (isFormValid() && userInteracted) {
      // Submit form if validation passes
      const { confirmPassword, ...formDataWithoutConfirmPassword } = formData;
      console.log(formDataWithoutConfirmPassword);
      axios
        .post(
          `${baseUrl}/User/`,
          JSON.stringify(formDataWithoutConfirmPassword),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.issuccesscode) {
            Swal.fire("Error!", "User already exists.", "error");
          } else {
            Swal.fire("Good job!", "Registered Successfully!", "success");
            if (!navigator.onLine) {
              alert("Please check your internet connection");
            }
            sendEmail();
            const forgotPassword = false;
            navigate(`/donateeasy/verifyEmail/${forgotPassword}`);
          }
        })
        .catch((error) => {
          Swal.fire("Error!", "User already exists.", "error");
          console.log(error);
        });
    }
  };
  return (
    <Container
      component="main"
      style={{ marginTop: "70px", marginLeft: "40px", marginRight: "40px" }}
    >
      <Paper
        className={classes.paper}
        elevation={3}
        style={{ margin: "auto", padding: "20px", borderRadius: "25px" }}
      >
        <div className={classes.root}>
          <Box display="flex" justifyContent="space-between">
            <div className={classes.formContainer}>
              <div className={classes.imageContainer} style={{ width: "auto" }}>
                <img
                  src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7965.jpg"
                  alt="SignIn"
                  className={classes.image}
                />
              </div>
              <div
                className={classes.form}
                style={{ width: "auto", textAlign: "center" }}
              >
                <Typography variant="h5" component="h1" gutterBottom>
                  User Registration
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
                      <FormControl variant="outlined" fullWidth required>
                        <InputLabel>Role</InputLabel>
                        <Select
                          label="Role"
                          name="userRole"
                          value={formData.userRole}
                          onChange={handleChange}
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
                    style={{ marginTop: "20px" }}
                    disabled={!isFormValid()}
                    onClick={handleSubmit}
                  >
                    Register
                  </Button>
                </form>
                <br />
                <div className={classes.registerLink}>
                  <NavLink
                    className="btn btn-outline-primary"
                    to="/donateeasy/login"
                    style={{ width: "100%" }}
                  >
                    Login Here
                  </NavLink>
                  <p style={{ marginLeft: "2%" }}>Already have an account?</p>
                </div>
              </div>
            </div>
          </Box>
        </div>
      </Paper>
    </Container>
  );
};

export default Register;
