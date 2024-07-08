import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import './App.css'
import LandingPage from './Components/Common Components/LandingPage';
import { Home } from './Components/Common Components/Home';
import Register from './Components/Common Components/Register';
import Login from './Components/Common Components/Login';
import { VerifyEmail } from './Components/Common Components/VerifyEmail';
import MainPage from './Components/Common Components/MainPage';
import SignOut from './Components/Common Components/SignOut';

import Orphanage from './Components/Admin/Orphanage';
import Donor from './Components/Admin/Donor';
import UpdateOrphanage from './Components/Admin/UpdateOrphanage';
import UpdateDonor from './Components/Admin/UpdateDonor';

import Profile from './Components/Common Components/Profile';

import DonorPage from './Components/Donor/DonorPage';
import Donate from './Components/Donor/Donate';
import DonorDonationHistory from './Components/Donor/DonorDonationHistory';

import DonationHistory from './Components/Orphanage/DonationHistory';


const router = createBrowserRouter([
  {path:'/', element:<LandingPage/>},
  {path:'/donateeasy', element:<MainPage/>,
    children:[
      {path:'/donateeasy/', element:<Home/>},
      {path:'/donateeasy/home', element:<Home/>},
      {path:'/donateeasy/login', element:<Login/>},
      {path:'/donateeasy/register', element:<Register/>},
      {path:'/donateeasy/verifyEmail/:forgotPassword', element:<VerifyEmail/>},
      {path:'/donateeasy/userProfile', element:<Profile/>},
      {path:'/donateeasy/signout', element: <SignOut/>},

      {path:'/donateeasy/adminDashboard/orphanage', element:<Orphanage/>},
      {path:'/donateeasy/adminDashboard/donor', element:<Donor/>},
      {path:'/donateeasy/adminDashboard/orphanage/viewOrphanage/:id', element:<UpdateOrphanage/>},
      {path:'/donateeasy/adminDashboard/donor/viewDonor/:id', element:<UpdateDonor/>},

      {path:'/donateeasy/donorPage', element:<DonorPage/>},
      {path:'/donateeasy/donate/:id', element:<Donate/>},
      {path:'/donateeasy/donordonationHistory', element:<DonorDonationHistory/>},

      {path:'/donateeasy/donationhistory', element:<DonationHistory/>},
      // {path:'/donateeasy/', element:},
      // {path:'/donateeasy/', element:},
      // {path:'/donateeasy/', element:},
    ]
  },
]);

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
