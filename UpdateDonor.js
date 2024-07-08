import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams, useLocation } from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Common Components/Orphanage.css';
import { baseUrl } from "../Common Components/BaseUrl";

function UpdateDonor() {
    const state = {
        button: 1
    };
    const navigate = useNavigate();
    var tokenAccess=window.sessionStorage.getItem("token");
    if(tokenAccess==null)
    {
        navigate('/donateeasy/login')
    }
    const { id } = useParams();

    const location = useLocation();
    const [disable, setDisable] = useState();
    const [values, setValues] = useState({
        userAddress: "",
        userId :0,
        userMobile:"",
        userName:"",
        userPassword:"",
        userZone:"",
        validAccount:""

    })
    useEffect(() => {
        axios.get(`${baseUrl}/User/id?id=` + id)
            .then((response) => {
                setValues({ ...values, userName: response.data.userName, userId: response.data.userId, userMobile:response.data. userMobile, userPassword:response.data.userPassword, userZone:response.data.userZone,validAccount:response.data.validAccount})
                console.log(response.data)
                console.log(id);
            })
            .catch((error) => { console.log(error) });
        if (location.state === "true") {
            setDisable(true);
        }
        else {
            setDisable(false);
        }
        var Role=window.sessionStorage.getItem("role");
        if(Role!="Admin")
        {
          navigate('/donateeasy/home');
        }

    }, [id]);

    const handleInput = (event) => {
        if (event.target.name === "validAccount") {
            if (event.target.value === "true") {
                setValues({ ...values, validAccount: true })
            }
            else if (event.target.value === "false") {
                setValues({ ...values, validAccount: false })
            }
        }
        else {
            setValues({ ...values, [event.target.name]: event.target.value })
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (state.button === 1) {
            axios.put(`${baseUrl}/User?UserId=`+id, JSON.stringify(values),
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then(
                    (response) => {
                        // console.log(formDataWithoutConfirmPassword);
                        console.log(response);
                        if (response.data.isSuccess) {
                            Swal.fire("Error!", "Server Error.", "error");
                        } else {
                            Swal.fire("Heyy!", "Data updated Successfully!", "success");
                            navigate('/donateeasy/adminDashboard/donor')
                        }
                    }
                )
                .catch((error) => { console.log(error) })
        }
        else if (state.button === 2) {
            event.preventDefault();
            setDisable(false);
        }
    }

    return (
        <div className="update-orphanage-container">
            <h3 className="d-flex justify-content-center m-3">Donor Details page</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="userName" className="form-label">
                        Donor Name
                    </label>
                    <input
                        type="text"
                        name="userName"
                        id="userName"
                        className="form-control"
                        onChange={handleInput}
                        value={values.userName}
                        disabled={disable}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="validAccount" className="form-label">
                        Account Status
                    </label>
                    <select
                        className="form-select"
                        id="validAccount"
                        name="validAccount"
                        onChange={handleInput}
                        value={values.validAccount}
                        disabled={disable}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
                {(!disable) ? <button type='submit' className='btn btn-outline-success' onClick={() => (state.button = 1)}>Update</button> : <button onClick={() => (state.button = 2)} className="btn btn-primary">Edit</button>}
                <NavLink className='btn btn-outline-danger' to='/donateeasy/adminDashboard/donor'>Cancel</NavLink>
            </form>
        </div>
    )
}

export default UpdateDonor