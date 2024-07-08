import React, { useEffect, useState } from 'react';
import '../Common Components/Orphanage.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { baseUrl } from "../Common Components/BaseUrl";
import axios from 'axios';

function DonorDonationHistory() {
    const [donation, getDonation] = useState([])
    const [orphOwner, getOrphOwner] = useState([])
    const [combined, setCombined] = useState([]);
    
    const ID=window.sessionStorage.getItem("userId");
    console.log(ID+" "+"userId");
    const navigate = useNavigate();

    var tokenAccess=window.sessionStorage.getItem("token");
    if(tokenAccess==null)
    {
        navigate('/donateeasy/login')
    }
    var Role=window.sessionStorage.getItem("role");
    
    useEffect(() => {
        const fetchData = async () => {
            try {

                const orphOwnerResponse = await axios.get(`${baseUrl}/Orphanage`);
                getOrphOwner(orphOwnerResponse.data)
                // console.log(orphOwnerResponse.data)

                const donationResponse=await axios.get(`${baseUrl}/Donor/DonorId?DonorId=` + ID);
                getDonation(donationResponse.data);
                console.log(donationResponse.data);

                const combinedData = donationResponse.data.map(donationItem => {
                    const matchingOrphanage = orphOwnerResponse.data.find(orphItem => orphItem.orphanageID === donationItem.orphanageID);


                    return {
                        ...donationItem,
                        orphanageName: matchingOrphanage ? matchingOrphanage.orphanageName : 'N/A',
                        validAccount: matchingOrphanage ? matchingOrphanage.orphanageAccountStatus : false,
                    };
                });


                setCombined(combinedData);

            } catch (error) {
                console.error("Error fetching data:", error);
            }


        };

        if(Role!="Donor")
    {
      navigate('/donateeasy/home');
    }

        fetchData();
    }, []);

    return (
        
        <div className="table-container">
            <h3 className="d-flex justify-content-center m-3">Donation History</h3>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>DonationId</th>
                        <th>Donation Type</th>
                        <th>Donotion Date</th>
                        <th>Orphanage Id</th>
                        <th>Orphanage Name</th>
                        <th>Donation Status</th>
                    </tr>
                </thead>
                <tbody>
                    {combined.map((donation, index) => {
                        const donationStatusClass = donation.donationStatus === 'Accepted' ? 'accepted' : 'not-accepted';
                        const formattedDate = new Date(donation.donationDate).toLocaleDateString();

                        //console.log(employee);
                        return (<tr key={index}>
                            <td>{donation.donationId}</td>
                            <td>{donation.donationType}</td>
                            <td>{formattedDate}</td>
                            <td>{donation.orphanageID}</td>
                            <td>{donation.orphanageName}</td>
                            <td className={`status ${donationStatusClass}`}>
                    {donation.donationStatus}
                </td>
                        </tr>)
                    })}
                </tbody>
            </table>
            <br/>
            {/* <div style={{alignContent:'center' , display:'flex'}}>
            <NavLink className="btn btn-primary" type="button" to='/donorPage'>Orphanage List</NavLink>
            </div> */}
        </div>
    )
}

export default DonorDonationHistory