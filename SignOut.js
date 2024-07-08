import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignOut = () =>{
    const navigate = useNavigate();
    sessionStorage.clear();
    useEffect(()=>{
        navigate("/");
    }, [])
    return <>
        Thanks for staying with us. Signed Out
    </>
}
export default SignOut;