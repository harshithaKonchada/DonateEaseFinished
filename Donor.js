import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import "../Common Components/Orphanage.css";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../Common Components/BaseUrl";

function Donor() {
  const [donor, getDonor] = useState([]);
  const [search, setSearch] = useState([]);
  const [donation, setDonation] = useState([]);

  const navigate = useNavigate();

  var tokenAccess = window.sessionStorage.getItem("token");
  if (tokenAccess == null) {
    navigate("/donateeasy/login");
  }

  useEffect(() => {
    axios.get(`${baseUrl}/User`).then((response) => {
      const donorData = response.data.filter(
        (user) => user.userRole === "Donor"
      );
      getDonor(donorData);
      setSearch(donorData);
      console.log(donorData);
    });
    axios.get(`${baseUrl}/Donor`).then((response) => {
      setDonation(response.data);
    });
    var Role = window.sessionStorage.getItem("role");
    if (Role != "Admin") {
      navigate("/donateeasy/home");
    }
    //setSearch(h);
  }, []);

  const Display = () => {
    axios.get(`${baseUrl}/User`).then((response) => {
      const donorData = response.data.filter(
        (user) => user.userRole === "Donor"
      );
      setSearch(donorData);
    });
  };

  //deleteEmployee details

  const handleDelete = (id) => {
    axios
      .delete(`${baseUrl}/User/id?id=` + id, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("Confirm Delete Donor");
        Display();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleView = (id) => {
    var k = true;
    navigate(`/donateeasy/adminDashboard/donor/viewDonor/${id}`, {
      state: JSON.stringify(k),
    });
  };

  const handleEdit = (id) => {
    var k = false;
    navigate(`/donateeasy/adminDashboard/donor/viewDonor/${id}`, {
      state: JSON.stringify(k),
    });
  };

  //search employee
  const Filter = (event) => {
    setSearch(
      donor.filter((f) => f.userName.toLowerCase().includes(event.target.value))
    );
  };

  return (
    <div className="table-container">
      <h3 className="d-flex justify-content-center m-3">Donor page</h3>
      {/* <button onClick={getDepartment}>Click</button> */}
      <input
        style={{ textAlign: "center" }}
        placeholder="search here"
        onChange={Filter}
        className="form-control"
      />
      <br />
      <table className="custom-table">
        <thead>
          <tr>
            <th>DonorId</th>
            <th>Donor Name</th>
            <th>Donor Email</th>
            <th>Donor Zone</th>
            <th>Account Status</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {search.map((donor, index) => {
            const statusClassName = donor.validAccount ? "active" : "inactive";
            //console.log(employee);
            return (
              <tr key={index}>
                <td>{donor.userId}</td>
                <td>{donor.userName}</td>
                <td>{donor.userEmail}</td>
                <td>{donor.userZone}</td>
                <td className={`status ${statusClassName}`}>
                  {donor.validAccount ? "Active" : "Inactive"}
                </td>
                <td>
                  <button
                    className="btn btn-light mr-1"
                    onClick={() => handleView(donor.userId)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-eye-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                    </svg>
                  </button>
                  <button
                    className="btn btn-light mr-1"
                    onClick={() => handleEdit(donor.userId)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fillRule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      />
                    </svg>
                  </button>
                  <button
                    type="submit"
                    className="btn btn-light mr-1"
                    onClick={() => handleDelete(donor.userId)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Donor;
