import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams , useLocation} from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Common Components/Orphanage.css';
import { baseUrl } from "../Common Components/BaseUrl";

function UpdateOrphanage() {

    const state = {
        button: 1
      };
    const navigate=useNavigate();
    var tokenAccess=window.sessionStorage.getItem("token");
    if(tokenAccess==null)
    {
        navigate('/donateeasy/login')
    }
      const {id}=useParams();

      const location = useLocation();
      const [disable, setDisable] = useState();
      const [values,setValues]=useState({
            orphanageName: "",
      orphanageAccountStatus: "",
      })
      useEffect(()=>{
        axios.get(`${baseUrl}/Orphanage/Orphangeid?Orphanageid=`+id)
        .then((response)=>{
          setValues({...values,orphanageName:response.data.orphanageName,orphanageAccountStatus:response.data.orphanageAccountStatus})
           console.log(response.data)
           console.log(id);
        })
        .catch((error)=>{console.log(error)});
        if(location.state === "true")
        {
          setDisable(true);
        }
        else{
          setDisable(false);
        }
        var Role=window.sessionStorage.getItem("role");
        if(Role!="Admin")
        {
          navigate('/donateeasy/home');
        }
        
      },[id]);

      const handleInput=(event)=>{
        if(event.target.name==="orphanageAccountStatus")
        {
          if(event.target.value==="true")
          {
            setValues({...values,orphanageAccountStatus:true})
          }
          else if(event.target.value==="false")
          {
            setValues({...values,orphanageAccountStatus:false})
          }
        }
        else
        {
          setValues({...values,[event.target.name]:event.target.value})
        }
      }
      const handleSubmit= async (event)=>{
        event.preventDefault();
        if(state.button===1)
        {
          axios.put(`${baseUrl}/Orphanage?Orphanageid=`+id,JSON.stringify(values),
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
                navigate('/donateeasy/adminDashboard/orphanage')
            }
        }
        )
        .catch((error)=>{console.log(error)})
        }
        else if(state.button===2)
        {
          event.preventDefault();
        setDisable(false);
        }
      }

  return (
    <div className="update-orphanage-container">
        <h3 className="d-flex justify-content-center m-3">Orphanage Details page</h3>
        <form onSubmit={handleSubmit}>
                    {/* <label className='form-label'>Orphanage Name</label>
                    <input type="text" name="orphanageName" className='form-control' onChange={handleInput} value={values.orphanageName} disabled={disable}/>
                    <select className='form-control btn btn-light'  name='orphanageAccountStatus' defaultValue="default" onChange={handleInput} value={values.orphanageAccountStatus}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                    </select> */}
                    <div className="mb-3">
          <label htmlFor="orphanageName" className="form-label">
            Orphanage Name
          </label>
          <input
            type="text"
            id="orphanageName"
            name="orphanageName"
            className="form-control"
            onChange={handleInput}
            value={values.orphanageName}
            disabled={disable}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="orphanageAccountStatus" className="form-label">
            Account Status
          </label>
          <select
            className="form-select"
            id="orphanageAccountStatus"
            name="orphanageAccountStatus"
            onChange={handleInput}
            value={values.orphanageAccountStatus}
            disabled={disable}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
                    {(!disable)?<button type='submit' className='btn btn-outline-success' onClick={() => (state.button = 1)}>Update</button>: <button onClick={() => (state.button = 2)} className="btn btn-primary">Edit</button>}
                    <NavLink className='btn btn-outline-danger' to='/donateeasy/adminDashboard/orphanage'>Cancel</NavLink>
            </form>
    </div>
  )
}

export default UpdateOrphanage