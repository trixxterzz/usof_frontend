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


export default function PasswordRecoveryForm(){
    const [password, setPassword] = useState();
    const [passwordCon, setPasswordCon] = useState();
    const [error, setError] = useState();
    const [sent, setSent] = useState(false);
    const {token} = useParams();
    const navigate = useNavigate();
    const handleChange = (event, setState) => {
        setState(event.target.value);
    }
    const tryToSend = async () => {
        if (password != passwordCon){
            setError("Passwords does not match");
            return;
        }
        try {
            let res = await axios.post(`http://localhost:3001/api/auth/password-reset/${token}`, {
                new_password: password
            });
            if (res.status === 200){
                navigate("/login");
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
                    <div>
                        <h2 id="recoveryHeader">Password recovery</h2>
                        <div>
                            <label className="loginLab" id="passwordLab" htmlFor="password">Password</label>
                            <input type="password" id="emailInput" onChange={(event) => handleChange(event, setPassword)}/>
                        </div>
                        <div>
                            <label className="loginLab" id="passwordConLab" htmlFor="password">Password confirmation</label>
                            <input type="password" id="emailInput" onChange={(event) => handleChange(event, setPasswordCon)}/>
                        </div>
                        <div>
                            <button onClick={tryToSend} className="recoveryButt">SEND</button>
                        </div>
                    </div>
            </div>
        </div>
    )
}