import React, { useEffect, useState, } from "react";
import ReactDOM from "react-dom/client";
import {TextField, Button, Box} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "../css/register.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { Grid } from "@mui/material";
import { BiLike, BiDislike, BiSolidDislike, BiSolidLike } from "react-icons/bi";

export default function RegisterPage(){
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [passwordCon, setPasswordCon] = useState("");
    const [password, setPassword] = useState("");
    const [file, setFile] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleChange = (event, setState) => {
        setState(event.target.value);
    }
    const handleChangeFile = (event, setState) => {
        setState(event.target.files[0]);
    }
    useEffect(() => {
        console.log(file);
    }, [file]);
    const tryToReg = async () => {
        if (password != passwordCon){
            setError("Passwords doesn't match");
            return;
        }
        try {
            let res = await axios.post(`http://localhost:3001/api/auth/register`, {
                login: login,
                email: email,
                name: name,
                password: password,
                passwordConfirm: passwordCon
            });
            if (res.status === 200){
                Cookies.set("token", res.data.token);
                if (file){
                    const formData = new FormData();
                    formData.append('profile_picture', file);
                    let avatarRes = await axios.patch(`http://localhost:3001/api/users/avatar`, formData, {
                        headers:{
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${Cookies.get("token")}`
                        }
                    });
                    if (avatarRes.status == 200){
                        navigate("/");
                    }
                }
                else {
                    navigate("/");
                }
            }
        }
        catch(error){
            console.log(error);
            setError(error.response.data.message);
        }
    }
    return(
        <div>
            {error != null ? <div className="error">{error}</div> : null}
            <div className="regDiv">
                <h2>Register</h2>
                <form>
                    <div className="formRow">
                        <label className="loginLab" id="loginLab" htmlFor="login">Login</label>
                        <input required className="loginField" type="text" id="login" name="login" onChange={(event) => handleChange(event, setLogin)}/>
                    </div>
                    <div className="formRow">
                        <label className="loginLab" id="emailLab" htmlFor="email">Email</label>
                        <input required className="loginField" type="email" id="email" name="email" onChange={(event) => handleChange(event, setEmail)}/>
                    </div>
                    <div className="formRow">
                        <label className="loginLab" id="nameLab" htmlFor="name">Name</label>
                        <input required className="loginField" type="text" id="name" name="name" onChange={(event) => handleChange(event, setName)}/>
                    </div>
                    <div className="formRow">
                        <label className="loginLab" id="passwordLab" htmlFor="password">Password</label>
                        <input required className="loginField" type="password" id="password" name="password" onChange={(event) => handleChange(event, setPassword)}/>
                    </div>
                    <div className="formRow">
                        <label className="loginLab" id="passwordConLab" htmlFor="passwordCon">Password confirmation</label>
                        <input required className="loginField" type="password" id="passwordCon" name="passwordCon" onChange={(event) => handleChange(event, setPasswordCon)}/>
                    </div>
                    <div className="formRow">
                        <label className="loginLab" id="avatarLab" htmlFor="fileInput">Choose avatar file</label>
                        <span id="fileSpan">{file == "" ? "No file chosen" : file.name}</span>
                        <input hidden className="loginField" type="file" id="fileInput" name="fileInput" onChange={(event) => handleChangeFile(event, setFile)}/> 
                    </div>
                    <div>
                        <button type="button" className="loginButt" onClick={tryToReg}>REGISTER</button>
                    </div>
                </form>
                <div className="addDiv">
                    <span id="logSpan">Have an account? <a href={"http://localhost:3000/login"}> Log in </a></span>
                </div>   
            </div>
        </div>
    )
}