import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {TextField, Button, Box} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "../css/posts.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Paper, Avatar } from "@mui/material";
import { BiLike, BiDislike, BiSolidDislike, BiSolidLike} from "react-icons/bi";
import {FiStar} from "react-icons/fi";
import {GoStarFill} from "react-icons/go";
import Post from "./Post";
import Header from "./Header";

const User = ({user}) => {
    return (
        <div className="catDivUser">
            <h3 className="catH">{user.login}</h3>
            <div>
                <Avatar src={`http://localhost:3001/api/users/${user.id}/avatar`} alt={`${user.login}`} />
            </div>
            <div>
                Rating: {user.likeCount}
            </div>
        </div>
    )
}

export default function Users() {
    let [users, setUsers] = useState([]);
    let getAllUsers = async () => {
        let res = await axios.get(`http://localhost:3001/api/users/`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        setUsers(res.data.users);
    }
    useEffect(() => {
        getAllUsers();
    }, []);
    return (
        <div className="root">
            <Header/>
            <Grid className="cont" container spacing={3}>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={8}>
                    <div className="categoriesList">
                        {users.map((el) => (
                            <User
                                key={el.id}
                                user={el}
                            />
                        ))}
                    </div>
                </Grid>
                <Grid item xs={2}>
                </Grid>
            </Grid>
        </div>
    )
}
