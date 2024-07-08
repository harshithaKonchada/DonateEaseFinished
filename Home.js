import styles from './Home.css';
import axios from 'axios';
import { IoMdContact } from "react-icons/io";
import { FaAddressBook,FaPhoneAlt } from "react-icons/fa";
import { useNavigate} from 'react-router-dom';

export const Home = ()=>{
    const navigate=useNavigate();
    return(
        <>
            <div className='picture_box'>
        <img className='picture' src="https://static.vecteezy.com/system/resources/previews/000/411/617/original/people-volunteering-and-donating-money-and-items-to-a-charitable-cause-vector.jpg" alt="picture" />
      </div>
      <div>
        <div className='box'>
          <div className='box1'>
            <h4> <u>  About us </u></h4>
            <p> One Platform for all your donations need</p>
          </div>
          <div className='box2'>
            <h4><u>Contact Details</u></h4>
            <h5><i>  Email : <IoMdContact/> orphange@gmail.com </i></h5>
            <h5><i> Phone : <FaPhoneAlt/> +91 9078654321  </i></h5>
            <h5><i> Address : <FaAddressBook/> Hyderabad </i></h5>  
          </div>
        </div>
      </div>
        </>
    )
}

