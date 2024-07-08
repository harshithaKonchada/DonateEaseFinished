import { useEffect, useState} from "react";
import axios from "axios";
import { baseUrl } from "./BaseUrl";
import "./VerifyEmail.css";
import { useNavigate, useParams } from "react-router-dom";
import { tokenGenerator } from "./TokenGenerator";
import emailjs from '@emailjs/browser';

export const VerifyEmail=()=>{

    const navigate = useNavigate();
    const { forgotPassword } = useParams();
    const [clicks, setClicks] = useState(1);

    useEffect(()=>{
        if(forgotPassword !== 'true' && forgotPassword !== 'false'){
            alert("You are not authorised to view this page");
            navigate("/donateeasy/login");
        }
    },[]);
    
    const [verificationData, setVerificationData] = useState({
        emailId: '',
        secretCode: '',
        newPassword: '',
        userName: ''
    });
    const [changePassword] = useState(forgotPassword === 'true');
    const [allowToGenerateToken, setAllowToGenerateToken] = useState(true);

    const sendEmail = () => {
        var templateParams={
            UserName:verificationData.userName,
            UserEmail:verificationData.emailId,
            ConfirmationToken: verificationData.secretCode
        }
        console.log(templateParams);
            emailjs.send('service_5pv1i1o', 'template_ojadr5s',templateParams, '112afEYMmcYJHEIap')
                .then((result) => {
                    console.log(result.text);
                }, (error) => {
                    console.log(error.text);
                });
    };
    const changeHandler = (event) =>{
        setVerificationData({...verificationData, [event.target.name]:[event.target.value]});
    }
    useEffect(()=>{
        console.log("uGenToken", verificationData.secretCode);
    }, [verificationData.secretCode]);
    const generateToken =()=>{
        axios.get(`${baseUrl}/User/EmailId?EmailId=${verificationData.emailId}`)
            .then((result)=>{
                if(result.status !== 200){
                    alert("EmailId doesn't exists");
                    return;
                }
                console.log("result = ", result.data)
                const res = result.data;
                const token = tokenGenerator();
                
                setVerificationData({...verificationData, ["secretCode"]:token, ["userName"]:res.userName});
                console.log("token, conToken", token, "---",verificationData.secretCode);
                var c = clicks;
                c++;
                setClicks(c);
                if(clicks <= 1){
                    return;
                }
                setAllowToGenerateToken(false);
                setTimeout(() => {
                    setAllowToGenerateToken(true);
                }, 10000);
                var user = {
                    "EmailId": verificationData.emailId.length === 0 ? res.userEmail.toString() : verificationData.emailId.toString(),
                    "Password": verificationData.newPassword.length === 0 ? res.userPassword : verificationData.newPassword,
                    "ValidAccount": res.validAccount,
                    "ConfirmationToken": verificationData.secretCode,
                };
                console.log("User == "+JSON.stringify(user));
                axios.put(`${baseUrl}/User/EmailId`,JSON.stringify(user),{
                    "headers":{
                        "content-type":"application/json"
                    },
                })
                .then((response)=>{
                    console.log("Token status successfully updated = "+response.data);
                    sendEmail();
                }).catch((error)=>{
                    console.log("Token update error = "+error);
                })
            })
            .catch((error)=>{
                console.log("Token generation error!!", error);
            });
    }
    const formHandler=async (event)=>{
        event.preventDefault();
        await axios.get(`${baseUrl}/User/EmailId?EmailId=${verificationData.emailId}`)
            .then((result)=>{
                if(result.status !== 200){
                    alert("EmailId doesn't exists");
                    return;
                }
                const res = result.data;
                if(changePassword){
                    if(!res.validAccount){
                        console.log("Admin has blocked your account. Write a mail to Admin requesting to unblock");
                        return;
                    }
                }
                console.log("res.ctoken, versToken", res.confirmationToken, verificationData.secretCode);
                if(res.confirmationToken.toString() !== verificationData.secretCode.toString()){
                    return;
                }
                console.log("userData == "+result.data);
                var user = {
                    "EmailId": verificationData.emailId.length === 0 ? res.userEmail.toString() : verificationData.emailId.toString(),
                    "Password": verificationData.newPassword.length === 0 ? res.userPassword.toString() : verificationData.newPassword.toString(),
                    "ValidAccount": true,
                    "ConfirmationToken": null
                };
                console.log("User == "+JSON.stringify(user));
                axios.put(`${baseUrl}/User/EmailId`,JSON.stringify(user),{
                    "headers":{
                        "content-type":"application/json"
                    },
                })
                .then((response)=>{
                    console.log("User status successfully updated = "+response.data);
                    navigate("/donateeasy/login");
                }).catch((error)=>{
                    console.log("Account status update error = "+error);
                    alert("Wrong code/Account already exists with given mail id");
                })
            })
            .catch((error)=>{
                console.log(error);
            })

    }
    return(<>
            <div className="container">
            <br/>
            <h2>Verify Your Account</h2>
            <p>We have sent you the secret code to your mail id.
                <br/> Enter the code below to confirm your email address.
            </p>
                <form onSubmit={formHandler}>
                    <input type="email" name="emailId" placeholder="Enter your account EmailId" required onChange={changeHandler}></input>
                    <br/><br/>
                    <button type="button" className="btn btn-primary" disabled = {!allowToGenerateToken} onClick={generateToken}>Generate Token</button>
                    <br/><br/>
                    {changePassword && <>
                    <input type="password" name="newPassword" placeholder="Enter your new password" required onChange={changeHandler}></input>
                    <br/><br/>
                    </>}
                    <input type="text" name="secretCode" placeholder="Enter the code" required minLength={4} onChange={changeHandler}></input>
                    
                    <button type="submit" className="btn btn-success">Submit</button>
                </form>
            </div>
    </>);
}