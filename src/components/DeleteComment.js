import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {TextField, Button, Box} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "../css/posts.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { Grid } from "@mui/material";
import { BiLike, BiDislike, BiSolidDislike, BiSolidLike } from "react-icons/bi";

export default function DeleteComment(){
    const {id} = useParams();
    const navigate = useNavigate();
    const deleteComment = async () => {
        let resComm = await axios.get(`http://localhost:3001/api/comments/${id}`, {
            headers:{
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        await axios.delete(`http://localhost:3001/api/comments/${id}`, {
            headers:{
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        navigate(`/posts/${resComm.data.comment.postId}`);
    }
    useEffect(() => {
        deleteComment();
    });
    return (
        <div>Deleting...</div>
    )
}