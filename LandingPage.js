import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  setTimeout(() => {
    navigate("/donateeasy");
  }, 2000);
  return <>Welcome to DonateEase</>;
};
export default LandingPage;
