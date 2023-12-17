import React, { useEffect, useState, } from "react";
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

const AddForm = () => {
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState();
    const [found, setFound] = useState(true);
    let getAllCategories = async () => {
        let res = await axios.get(`http://localhost:3001/api/categories/`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        setCategories(res.data.categories);
    }
    const navigate = useNavigate();
    const addPost = async () => {
        let res = await axios.post(`http://localhost:3001/api/posts/`, {
            title: title,
            content: content,
            categories: selectedCategories
        }, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        if (res.status === 200){
            navigate(`/`);
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
    }, []);
    console.log(categories);
    return(
        <div className="editForm">
            <form>
                <div>
                    <label htmlFor="tile">Title</label>
                    <input type="text" id="titleInput" name="title" onChange={(event) => handleChange(event, setTitle)}/>
                </div>
                <div>
                    <label htmlFor="content">Content</label>
                    <textarea id="postBodyArea"rows={20} onChange={(event) => handleChange(event, setContent)} />
                </div>
                <div className="bloc">
                    <label htmlFor="catSelect"></label>
                    <select id="catSelect" className="catSelect" multiple required onChange={(e) => handleSelectChange(e)}>
                        {categories.map((el) => (
                            <option className="catOption">{el.title}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button className="button" type="button" onClick={addPost}>CREATE</button>
                </div>
            </form>
        </div>
    )
}

export default function AddPostPage(){
    const {id} = useParams();
    return (
        <div className="root">
            <Header/>
            <Grid container spacing={3}>
                <Grid item xs={2}>

                </Grid>
                <Grid item xs={7}>
                    <AddForm key={id} id={id} />
                </Grid>
                <Grid item xs={2}>
                    
                </Grid>
            </Grid>
        </div>
    )
}