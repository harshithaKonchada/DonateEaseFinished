import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../Common Components/BaseUrl';
import '../Common Components/DonorPage.css';

function DonorPage() {
  const [orph, getOrph] = useState([]);
  const [donor, getDonor] = useState([]);
  const [orphOwner, getOrphOwner] = useState([]);
  const [sortedOrphanages, setSortedOrphanages] = useState([]);

  const navigate = useNavigate()
  var tokenAccess=window.sessionStorage.getItem("token");
  var Role=window.sessionStorage.getItem("role");
  console.log(Role);
    if(tokenAccess==null)
    {
        navigate('/donateeasy/login')
    }
    var Role=window.sessionStorage.getItem("role");

  const ID=window.sessionStorage.getItem("userId");
    console.log(ID+" "+"userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donorResponse = await axios.get(`${baseUrl}/User/id?id=` + ID);
        const donorData = donorResponse.data;
        getDonor(donorData);
        console.log(donorData);

        const orphOwnerResponse = await axios.get(`${baseUrl}/User`);
        const orphOwnerData = orphOwnerResponse.data.filter(user => user.userRole === "Orphanage");
        getOrphOwner(orphOwnerData);
        console.log(orphOwnerData);

        const orphResponse = await axios.get(`${baseUrl}/Orphanage`);
        getOrph(orphResponse.data);
        console.log(orphResponse.data);

        const sortedMatchingOrphanages = orphOwnerData.sort(
          (a, b) => {
            const aZoneMatch = Math.abs(a.userZone.localeCompare(donorData.userZone) );
            const bZoneMatch = Math.abs(b.userZone.localeCompare(donorData.userZone) );
            return aZoneMatch - bZoneMatch;
          }
        );
        setSortedOrphanages(sortedMatchingOrphanages);
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

  const Donate = (id,userName,userEmail) => {
    navigate(`/donateeasy/donate/${id}`, { state: { userName, userEmail } });
}

  return (
    <div>
      <h2 className="d-flex justify-content-center m-3" style={{ color: "green" }}>
        List of Orphanages
      </h2>
      <div className="donation-cards">
        {sortedOrphanages.map((request, index) => (
          <div key={index} className="donation-card">
            <h2>{request.userName}'s Orphanage</h2>
            <p>Name: {request.userName}</p>
            <p>Email: {request.userEmail}</p>
            <p>Mobile: {request.userMobile}</p>
            <p>Zone: {request.userZone}</p>
            <div className="button-container">
              <button className="approve-button" onClick={()=>Donate(request.userId, request.userName, request.userEmail)}>Donate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonorPage;
