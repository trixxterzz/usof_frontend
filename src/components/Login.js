import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "../css/login.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:3001/api/auth/login";


export default function Login(){
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const tryLogIn = async () => {
        try {
            let resp = await axios.post(baseUrl, {
                login: login,
                password: password
            });
            Cookies.set("token", resp.data.data.token);
            navigate("/");
        }
        catch(error){
            console.error(error);
            setError(error.response.data.message);
        }
    }
    const handleChange = (event, setState) => {
        setState(event.target.value);
    }
    return(
        <div>
            {error != null ? <div className="error">{error}</div> : null}
            <div className="loginDiv">
            <h2>Log in</h2>
            <form>
                <div className="formRow">
                    <label className="loginLab" id="loginLab" htmlFor="login">Login</label>
                    <input required className="loginField" type="text" id="login" name="login" onChange={(event) => handleChange(event, setLogin)}/>
                </div>
                <div className="formRow">
                    <label className="loginLab" id="passwordLab" htmlFor="password">Password</label>
                    <input required className="loginField" type="password" id="password" name="password" onChange={(event) => handleChange(event, setPassword)}/>
                </div>
                <div>
                    <button type="button" className="loginButt" onClick={tryLogIn}>LOG IN</button>
                </div>
            </form>
            <div className="addDiv">
                <span id="recSpan"><a href="http://localhost:3000/passwordRecovery">Forgot password?</a></span>
                <span id="regSpan">Don't have an account? <a href={"http://localhost:3000/register"}> Register </a></span>
            </div>   
        </div>
        </div>
     )
}