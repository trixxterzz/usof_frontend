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

const Category = ({ categoryName, categoryId }) => (
    <a href={`http://localhost:3000/posts/byCategory/${categoryId}`}>
        <div className="postCategory">
            {categoryName}
        </div>
    </a>
    
);


export default function Post ({ id, title, publishDate, content, author, likeCount, categories }){
    let [liked, setLiked] = useState(false);
    let [type, setType] = useState("Like");
    let [rating, setRating] = useState(likeCount);
    let [favourite, setFavourite] = useState(false);
    let isLiked = async () => {
        if (!Cookies.get("token")) return false;
        let res = await axios.get(`http://localhost:3001/api/posts/${id}/likes`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        let userRes = await axios.get(`http://localhost:3001/api/users/self`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        if (res.status === 200){
            for (let i of res.data.likes){
                if (i.authorId === userRes.data.user.id){
                    setLiked(true);
                    setType(i.type);
                }
            }
        }
        else return false;
    }
    let isFavourite = async () => {
        if (!Cookies.get("token")) return false;
        let res = await axios.get(`http://localhost:3001/api/favourites`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        if (res.status === 200){
            for (let i of res.data.favourites){
                if (id === i.id){
                    setFavourite(true);
                }
            }
        }
        else return false;
    }
    useEffect(() => {
        isLiked();
        isFavourite();
    }, []);
    let updateLike = async (likeType) => {
        if (liked === true){
            if (likeType === type){
                let res = await axios.delete(`http://localhost:3001/api/posts/${id}/likes`,{
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`
                    }
                });
                if (res.status == 200){
                    setLiked(false);
                    setType("Like");
                    if (likeType == "Like") setRating(rating - 1)
                    if (likeType == "Dislike") setRating(rating + 1);
                }
            }
            else {
                let res = await axios.delete(`http://localhost:3001/api/posts/${id}/likes`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`
                    }
                });
                if (res.status == 200){
                    let res2 = await axios.post(`http://localhost:3001/api/posts/${id}/likes`, {
                        type: likeType
                    }, {
                        headers: {
                            Authorization: `Bearer ${Cookies.get("token")}`
                        }
                    });
                    if (res2.status === 200){
                        setLiked(true);
                        setType(likeType);
                        if (likeType == "Like") setRating(rating + 2)
                        if (likeType == "Dislike") setRating(rating - 2);
                    }
                }
            }
        }
        else {
            let res = await axios.post(`http://localhost:3001/api/posts/${id}/likes`, {
                type: likeType
            }, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`
                }
            });
            if (res.status === 200){
                setLiked(true);
                setType(likeType);
                if (likeType == "Like") setRating(rating + 1)
                if (likeType == "Dislike") setRating(rating - 1);
            }
        }
    }
    let updateFavourite = async () => {
        if (favourite){
            let res = await axios.delete(`http://localhost:3001/api/favourites/${id}`,{
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`
                }
            });
            if (res.status === 200){
                setFavourite(false);
            }
        }
        else {
            let res = await axios.post(`http://localhost:3001/api/favourites/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`
                }
            });
            if (res.status === 200){
                setFavourite(true);
            }
        }
    }
    return(
        <div key={id} className="post">
            <h3><a href={`http://localhost:3000/posts/${id}`}>{title}</a></h3>
            <Grid container spacing={0}>
                <Grid item xs={6}>
                    <div className="content">{content.length > 100 ? content.slice(0, -(content.length - 100)).concat("...") : content}</div>
                    <div className="categories">
                        {categories.map((cat) => (
                            <Category key={cat.id} categoryName={cat.title} categoryId={cat.id}/>
                        ))}
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="like-container">
                        {favourite === true ? <GoStarFill size={35} onClick={updateFavourite} /> : <FiStar size={35} onClick={updateFavourite} />}
                    </div>
                    <div className="like-container">
                        {liked === true && type === "Like" ? <BiSolidLike size={35} onClick={(event) => updateLike("Like")}/> : <BiLike size={35}  onClick={(event) => updateLike("Like")}/>}
                    </div>
                    <div className="like-container">
                        {liked === true && type === "Dislike" ? <BiSolidDislike size={35}  onClick={(event) => updateLike("Dislike")}/> : <BiDislike size={35}  onClick={(event) => updateLike("Dislike")}/>}
                    </div>
                </Grid>
                <Grid className="postAdditional" item xs={3}>
                    <p className="publish-date">{new Date(publishDate).toLocaleDateString()}</p>
                    <p className="rating">{rating}</p>
                    <p className="author">{author}</p>
                </Grid>
            </Grid>
        </div>
    )
};
