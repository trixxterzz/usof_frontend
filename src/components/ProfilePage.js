import React, { useEffect, useState, } from "react";
import ReactDOM from "react-dom/client";
import {TextField, Button, Box} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "../css/profile.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { Grid, Avatar } from "@mui/material";
import { BiLike, BiDislike, BiSolidDislike, BiSolidLike } from "react-icons/bi";

const ProfileData = () => {
    let [self, setSelf] = useState({});
    const [isChanging, setChanging] = useState(false);
    const [login, setLogin] = useState(self.login);
    const [email, setEmail] = useState(self.email);
    const [name, setName] = useState(self.name);
    const [error, setError] = useState(null);
    const [file, setFile] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        getSelf();
    }, []);
    const handleChangeFile = async (event, setState) => {
        const formData = new FormData();
        formData.append('profile_picture', event.target.files[0]);
        try{
            let avatarRes = await axios.patch(`http://localhost:3001/api/users/avatar`, formData, {
                headers:{
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${Cookies.get("token")}`
                }
            });
            if (avatarRes.status == 200){
                setState(event.target.files[0]);
            }
        }
        catch(e){
            console.log(e);
            setError("Could not update your avatar");
        }
    }
    const handleChange = (event, setState) => {
        setState(event.target.value);
    }
    let getSelf = async () => {
        let res = await axios.get(`http://localhost:3001/api/users/self`, {
            headers:{
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        if (res.status === 200){
            setSelf(res.data.user);
            setLogin(res.data.user.login);
            setEmail(res.data.user.email);
            setName(res.data.user.full_name);
        }
    }
    const startChange = () => {
        setChanging(true);
    }
    const endChange = async () => {
        try {
            let res = await axios.patch(`http://localhost:3001/api/users/${self.id}`, {
                login: login,
                email: email,
                name: name
            }, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`
                }
            });
            if (res.status == 200){
                setChanging(false);
            }
        }
        catch(error){
            setError(error.response.data.message);
        }
    }
    return(
        <div>
            {error != null ? <div className="error">{error}</div> : null}
            <div className="profileData">
            <div>
                <div id="picDiv">
                    <Avatar src={`http://localhost:3001/api/users/${self.id}/avatar`} alt={self.login} sx={{width: 150, height: 150}}/>
                </div>
                <div id="buttDiv">
                    <label className="loginLab" id="avatarButt" htmlFor="fileInput">UPLOAD</label>
                    <input hidden className="loginField" type="file" id="fileInput" name="fileInput" onChange={(event) => handleChangeFile(event, setFile)}/> 
                </div>
            </div>
            <div>
                    {!isChanging ? 
                        (<div>
                            <p>Login: {login}</p>
                            <p>Email: {email}</p>
                            <p>Name: {name}</p>
                        </div>) :
                        (<div>
                            <p>Login: <input type="text" className="changeInput" value={login} onChange={(event) => handleChange(event, setLogin)}/></p>
                            <p>Email: <input type="email" className="changeInput" value={email} onChange={(event) => handleChange(event, setEmail)}/></p>
                            <p>Name: <input type="text" className="changeInput" value={name} onChange={(event) => handleChange(event, setName)}/></p>
                        </div>)
                    }
                <div>
                    {!isChanging ? <button id="changeButt" onClick={startChange}>CHANGE DATA</button> : <button id="changeButt" onClick={endChange}>SAVE</button>}
                </div>
            </div>
        </div>
        </div>
    )
}

export default function ProfilePage(){
    return(
        <div className="root">
            <Header/>
            <Grid className="cont" container spacing={3}>
                <Grid item xs={3}>

                </Grid>
                <Grid item xs={6}>
                    <ProfileData/>
                </Grid>
                <Grid item xs={3}>

                </Grid>
            </Grid>
        </div>
    )
}