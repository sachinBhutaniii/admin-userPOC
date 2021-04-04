import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ForgotPasswordPage = () => {

    const [email , setEmail] = useState();

    useEffect(()=>{
        console.log("value of email is", email);
    },[email])

   
    const mailAPIcall = () => {

        if(!email || email.length < 5)
        {
        alert("Enter correct email address");
            return;
        }

        email &&
        axios
        .post('http://localhost:8080/api/user/forgetpassword', {email:email})
        .then(res => {
            //console.log(res)
            if(res.status == 200)
            alert("Mail Sent");
        })
        .catch(err =>{ console.log(err)
            alert(err)
        })
    }


    return (<div>
        <input type="email"  onChange={e=>setEmail(e.target.value)} placeholder="Enter Your email here" />
        <button onClick={mailAPIcall} >Send Mail</button>
    </div>)
}


export default ForgotPasswordPage;