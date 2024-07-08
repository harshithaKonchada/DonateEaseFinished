import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../Common Components/Modal.module.css';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import { baseUrl } from "../Common Components/BaseUrl";
function Donate() {

    const [orph, getOrph] = useState();

    const navigate = useNavigate();

    var tokenAccess=window.sessionStorage.getItem("token");
    if(tokenAccess==null)
    {
        navigate('/donateeasy/login')
    }
    var Role=window.sessionStorage.getItem("role");
    

    const { state: { userName, userEmail } } = useLocation();
const form=useRef();

const ID=window.sessionStorage.getItem("userId");
    console.log(ID+" "+"userId");

    const [dateError, setDateError] = useState();
    const { id } = useParams();
    const [donation, setDonation] = useState({
        orphanageId:'',
        donationStatus:'',
        donationType: '',
        donationDate: '',
        userId: ID,
    })

    useEffect(() => {
        const fetchData = async () => {
            try {

                const orphResponse = await axios.get(`${baseUrl}/Orphanage/UserId?userId=` + id)
                const orphanageIdFromAPI = orphResponse.data.orphanageID;
                console.log(orphanageIdFromAPI)
                getOrph(orphanageIdFromAPI);
                setDonation(prevDonation => ({ ...prevDonation, orphanageId: orphanageIdFromAPI }));

                    
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post(`${baseUrl}/Donor?Userid=`+ID, JSON.stringify(donation),
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
                            sendEmail()
                            Swal.fire("Heyy!", "Donation Successfull!", "success");
                            navigate('/donateeasy/donorPage')
                        }
                    }
                )
                .catch((error) => { console.log(error) })

        console.log("Submit clicked");
    }

    const sendEmail = () => {
     var templateParams={
        UserName:userName,
        UserEmail:userEmail
     }
     console.log(templateParams);
        emailjs.send('service_pzreakp', 'template_s5x9gka',templateParams, 'Vqyu_ErD-2Jo8M7B-')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
      };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setDonation((prevDonation) => ({ ...prevDonation, [name]: value }));
    }

    return (
        <>

            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h2>Make a Donation</h2>

                    {/* <button onClick={sendEmail}>Send Email</button> */}
                
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="donationType" className="form-label">
                                Account Status
                            </label>
                            <select
                                className="form-select"
                                id="donationType"
                                name="donationType"
                                onChange={handleChange}
                                value={donation.donationType}
                            >
                                <option value="" disabled>Select Donation Type</option>
                                <option value="Money">Money</option>
                                <option value="Food">Food</option>
                                <option value="Books">Books</option>
                                <option value="Clothes">Clothes</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="donationDate">Donation Date:</label>
                            <input
                                className="form-control"
                                type="date"
                                id="donationDate"
                                value={donation.donationDate}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={handleChange}
                                name="donationDate"
                                required
                            />
                            {dateError && (
                                <p className={styles.error}>Invalid date! Please select a date from today onwards.</p>
                            )}
                        </div>

                        <div className={styles.buttons}>
                            <button type="submit" className="btn btn-success">Donate</button>
                            <NavLink className="btn btn-danger" type="button" to='/donateeasy/donorPage'>Cancel</NavLink>
                        </div>
                    </form>
                </div>
            </div>


        </>
    )
}

export default Donate