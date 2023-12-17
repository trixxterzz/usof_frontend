import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {TextField, Button, Box} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "../css/posts.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import { BiLike, BiDislike, BiSolidDislike, BiSolidLike} from "react-icons/bi";
import {FiStar} from "react-icons/fi";
import {GoStarFill} from "react-icons/go";

import Post from "./Post";

const baseUrl = "http://localhost:3001/api/posts";


export default function Posts({sortBy, sortType}){
    let [posts, setPosts] = useState([]);
    let getAllPosts = async () => {
        let sortParam = (sortBy == "like" || sortBy == "publishDate") ? sortBy : "";
        let sortOrder = (sortType == "asc" || sortType == "desc") ? sortType : "";
        console.log(sortParam);
        console.log(sortOrder);
        let res;
        if (sortParam != "" && sortOrder != ""){
            res = await axios.get(baseUrl + `?sortType=${sortOrder}&sortParam=${sortParam}`);
        }
        else {
            res = await axios.get(baseUrl);
        }
        setPosts(res.data.posts);
    }
    useEffect(() => {
        getAllPosts();
    }, [sortBy, sortType]);
    
    return (
        <div className="posts">
            {posts.map((el) => (
                <Post
                    key={el.id}
                    id={el.id}
                    title={el.title}
                    publishDate={el.publishDate}
                    content={el.content}
                    author={el.authorName}
                    likeCount={el.likeCount}
                    categories={el.categories}
              />
            ))}
        </div>
    )
}