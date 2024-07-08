import { useEffect, useState } from "react"
import { baseUrl } from "../Common Components/BaseUrl";
import axios from "axios";

import { Table, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import emailjs from '@emailjs/browser';
import { useNavigate } from "react-router-dom";


export default function DonationHistory() {
  const [donations, setDonations] = useState([]);

  const navigate=useNavigate();
  var tokenAccess=window.sessionStorage.getItem("token");
    if(tokenAccess==null)
    {
        navigate('/donateeasy/login')
    }
    var Role=window.sessionStorage.getItem("role");
    
  useEffect(()=>{
    if(Role!="Orphanage")
    {
      navigate('/donateeasy/home');
    }
        loadDonations();
    }, []);

    const loadDonations = async ()=>{
      try {
        const result = await axios.get(`${baseUrl}/Donor/OrphanageId?OrphanageId=${sessionStorage.getItem("orphanageId")}`);
    
        const requests = result.data.map(async (d) => {
          try {
            const response = await axios.get(`${baseUrl}/User/id?id=${d.userId}`);
            return { ...d, donorNamed: response.data.userName, donorContact: response.data.userMobile };
          } catch (error) {
            console.log("User retrieval error ", error);
            return { ...d, donorNamed: "error"+d.userId, donorContact: "error"+d.userId };
          }
        });
    
        const combinedData = await Promise.all(requests);
        const sortedDonations = combinedData.sort((a, b) => {
          // Sort by donationStatus (put "Not Accepted" at the top)
          if (a.donationStatus === "Not Accepted" && b.donationStatus !== "Not Accepted") {
            return -1; // a comes first
          } else if (a.donationStatus !== "Not Accepted" && b.donationStatus === "Not Accepted") {
            return 1; // b comes first
          } else {
            // If both have the same donationStatus or both are "Not Accepted",
            // then sort by DonationDate in descending order
            return new Date(b.donationDate) - new Date(a.donationDate);
          }
        });
        setDonations(sortedDonations);
      } catch (error) {
        console.error("Data retrieval error ", error);
      }

    }
    const donationStatusColors = {
        'Not Accepted': 'info',
        'Accepted': 'success',
        'Rejected': 'danger',
      };
    
      const sendEmail = (userName, userEmail) => {
        var templateParams={
           UserName:userName,
           UserEmail:userEmail
        }
        console.log(templateParams);
           emailjs.send('service_pzreakp', 'template_s1ngv6q',templateParams, 'Vqyu_ErD-2Jo8M7B-')
             .then((result) => {
                 console.log(result.text);
             }, (error) => {
                 console.log(error.text);
             });
         };
      const changeStatus = (donation, newStatus) => {
        const updatedDonation = {
          "orphanageId": donation.orphanageID,
          "donationStatus": newStatus,
          "donationType": donation.donationType,
          "donationDate": donation.donationDate,
          "userId": donation.userId
        }
        console.log(updatedDonation,"  ", donation.userId);
        axios.put(`${baseUrl}/donor?donationId=${donation.donationId}`,JSON.stringify(updatedDonation),{
          "headers":{
              "content-type":"application/json"
          },
        })
        .then((response) => {
          console.log("Donation successful");
          axios.get(`${baseUrl}/User/id?id=` + donation.userId)
          .then((result) => {
            const donorData = result.data;
            sendEmail(donorData.userName,donorData.userEmail);
            loadDonations();
          })
          .catch((error) => {
            console.log("User retrieval error ", error);
          })
        })
        .catch((error) => {
          console.log("Donation status update failed", error.text);
        })
      };
    
      return (
        <div className="container mt-5">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Donation Id</th>
                {/* <th>Donor Id</th> */}
                <th>Donation Expected Date</th>
                <th>Donor Name</th>
                <th>Donor Mobile</th>
                <th>Donation Type</th>
                <th>Donation Status</th>
              </tr>
            </thead>
            <tbody>
            
              {donations.map((donation) => (
                <tr key={donation.donationId}>
                  <td>{donation.donationId}</td>
                  {/* <td>{donation.userId}</td> */}
                  <td>{donation.donationDate}</td>
                  <td>{donation.donorNamed}</td>
                  <td>{donation.donorContact}</td>
                  <td>{donation.donationType}</td>
                  <td>
                    {/* Dropdown to change donation status */}
                    <Form.Control
                      as="select"
                      className={`form-select bg-${donationStatusColors[donation.donationStatus]} text-white rounded-lg`}
                      defaultValue=""
                      disabled={donation.donationStatus !== 'Not Accepted'}
                      onChange={(e) => changeStatus(donation, e.target.value)}
                      style={{ width: 'auto' , marginLeft: 'auto', marginRight:'auto', option:{height:'50px'}}}
                    >
                      <option value="" disabled hidden>
                        {donation.donationStatus} {/* Display current status */}
                      </option>
                      {donation.donationStatus === 'Not Accepted' && (
                        <>
                          <option value="Accepted">Accept</option>
                          <option value="Rejected">Reject</option>
                        </>
                      )}
                      {donation.donationStatus === 'Accepted' && (
                        <option value="Accepted">Accepted</option>
                      )}
                      {donation.donationStatus === 'Rejected' && (
                        <option value="Rejected">Rejected</option>
                      )}
                    </Form.Control>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );

}