import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {TextField, Button, Box} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "../css/index.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Avatar } from "@mui/material";
import { BiLike, BiDislike, BiSolidDislike, BiSolidLike } from "react-icons/bi";

import logo from "../images/testlogo.png";




export default function Header(){
    let [self, setSelf] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        getSelf();
    }, []);
    let getSelf = async () => {
        let res = await axios.get(`http://localhost:3001/api/users/self`, {
            headers:{
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        if (res.status === 200){
            setSelf(res.data.user);
        }
    }
    const handleChange = (event, setState) => {
        setState(event.target.value);
    }
    const logout = () => {
        if (Cookies.get("token")){
            Cookies.remove("token");
        }
        navigate("/login");
    }
    return (
        <div className="header">
            <div id="logo">
                <img id="logo" src={logo}/>
            </div>
            <div className="navDiv" id="main">
                <a className="navLink" href={`http://localhost:3000/`}>MAIN</a>
            </div>
            <div className="navDiv" id="categories">
                <a className="navLink" href={`http://localhost:3000/categories`}>CATEGORIES</a>
            </div>
            <div className="navDiv" id="favourites">
                <a className="navLink" href={`http://localhost:3000/favourites`}>FAVOURITES</a>
            </div>
            <div className="navDiv" id="users">
                <a className="navLink" href={`http://localhost:3000/users`}>USERS</a>
            </div>
            <div className="navDiv" id="profile">
                <a className="navLink" href={`http://localhost:3000/users/self`}><Avatar alt={self.login} src={`http://localhost:3001/api/users/${self.id}/avatar`} /></a>
            </div>
            <div className="navDiv" id="logout">
                <button id="logoutButt" onClick={logout}>LOGOUT</button>
            </div>
        </div>
    )
}