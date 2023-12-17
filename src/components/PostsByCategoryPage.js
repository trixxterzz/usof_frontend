import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {TextField, Button, Box} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "../css/posts.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { BiLike, BiDislike, BiSolidDislike, BiSolidLike} from "react-icons/bi";
import {FiStar} from "react-icons/fi";
import {GoStarFill} from "react-icons/go";
import Post from "./Post";
import Header from "./Header";

export default function PostByCategoryPage() {
    let {id} = useParams();
    let [posts, setPosts] = useState([]);
    let getAllPosts = async () => {
        let res = await axios.get(`http://localhost:3001/api/categories/${id}/posts`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        setPosts(res.data.posts);
    }
    useEffect(() => {
        getAllPosts();
    }, []);
    return (
        <div className="root">
            <Header/>
            <Grid className="cont" container spacing={3}>
                <Grid item xs={3}>

                </Grid>
                <Grid item xs={6}>
                <div className="posts">
                    {posts.length === 0 ? <div><h2 className="noPostsLab">No posts with such category!</h2></div> : null}
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
                </Grid>
                <Grid item xs={3}>
                    
                </Grid>
            </Grid>
        </div>
    )
}


