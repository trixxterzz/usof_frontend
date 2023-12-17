import React, { useEffect, useState, } from "react";
import ReactDOM from "react-dom/client";
import {TextField, Button, Box} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "../css/index.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { Grid } from "@mui/material";
import { BiLike, BiDislike, BiSolidDislike, BiSolidLike } from "react-icons/bi";

export default function PasswordRecoveryPage(){
    const [email, setEmail] = useState();
    const [error, setError] = useState();
    const [sent, setSent] = useState(false);
    const handleChange = (event, setState) => {
        setState(event.target.value);
    }
    const tryToSend = async () => {
        try {
            let res = await axios.post(`http://localhost:3001/api/auth/password-reset`, {
                email: email
            });
            if (res.status === 200){
                setSent(true);
            }
        }
        catch(e){
            setError(e.response.data.message);
        }
    }
    return(
        <div>
            {error != null ? <div className="error">{error}</div> : null}
            <div id="recoveryDiv">
                {!sent ? 
                    <div>
                        <h2 id="recoveryHeader">Password recovery</h2>
                        <div>
                            <input type="email" id="emailInput" onChange={(event) => handleChange(event, setEmail)}/>
                        </div>
                        <div>
                            <button onClick={tryToSend} className="recoveryButt">SEND</button>
                        </div>
                    </div> :
                    <div>
                        <h2 id="recoveryHeaderSent">Email has been sent to your adress!</h2>
                    </div>
                }
            </div>
        </div>
    )
}