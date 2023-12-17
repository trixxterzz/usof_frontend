import React, { useEffect, useState, } from "react";
import ReactDOM from "react-dom/client";
import {TextField, Button, Box} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "../css/editform.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { Grid } from "@mui/material";
import { BiLike, BiDislike, BiSolidDislike, BiSolidLike } from "react-icons/bi";

const EditForm = ({ id }) => {
    const [post, setPost] = useState({});
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [found, setFound] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();
    let getPost = async () => {
        try {
            let res = await axios.get(`http://localhost:3001/api/posts/${id}`);
            if (res.status == 200){
                setPost(res.data.post);
                setTitle(res.data.post.title);
                setContent(res.data.post.content);
                let buff = [];
                res.data.post.categories.map((el) => {
                    buff.push(el.title);
                });
                setSelectedCategories(buff);
            }
            console.log(res.data.post);
        }
        catch (error){
            if (error.response.status === 404){
                setFound(false);
            }
        }
    }
    let getAllCategories = async () => {
        let res = await axios.get(`http://localhost:3001/api/categories/`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        setCategories(res.data.categories);
    }
    const editPost = async () => {
        let res = await axios.patch(`http://localhost:3001/api/posts/${id}`, {
            title: title,
            content: content,
            categories: selectedCategories
        }, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        if (res.status === 200){
            navigate(`/posts/${id}`);
        }
    }
    const handleChange = (event, setState) => {
        setState(event.target.value);
    }
    const handleSelectChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedCategories(selectedOptions);
    };
    useEffect(() => {
        getAllCategories();
        getPost();
    }, []);
    return(
        <div className="editForm">
            <form>
                <div>
                    <label htmlFor="tile">Title</label>
                    <input type="text" id="titleInput" name="title" value={title} onChange={(event) => handleChange(event, setTitle)}/>
                </div>
                <div>
                    <label htmlFor="content">Content</label>
                    <textarea id="postBodyArea"rows={20} value={content} onChange={(event) => handleChange(event, setContent)} />
                </div>
                <div className="bloc">
                    <label htmlFor="catSelect"></label>
                    <select id="catSelect" className="catSelect" value={selectedCategories} multiple required onChange={(e) => handleSelectChange(e)}>
                        {categories.map((el) => (
                            <option className="catOption" key={el.title} value={el.title}>{el.title}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button className="button" type="button" onClick={editPost}>SAVE</button>
                </div>
            </form>
        </div>
    )
}

export default function EditPostPage(){
    const {id} = useParams();
    return (
        <div className="root">
            <Header/>
            <Grid container spacing={3}>
                <Grid item xs={2}>

                </Grid>
                <Grid item xs={7}>
                    <EditForm key={id} id={id} />
                </Grid>
                <Grid item xs={2}>
                    
                </Grid>
            </Grid>
        </div>
    )
}