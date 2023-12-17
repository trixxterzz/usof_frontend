import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {TextField, Button, Box} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "../css/posts.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Paper } from "@mui/material";
import { BiLike, BiDislike, BiSolidDislike, BiSolidLike} from "react-icons/bi";
import {FiStar} from "react-icons/fi";
import {GoStarFill} from "react-icons/go";
import Post from "./Post";
import Header from "./Header";

const Category = ({cat}) => {
    return (
        <a href={`http://localhost:3000/posts/byCategory/${cat.id}`}>
            <div className="catDiv">
                <h3 className="catH">{cat.title}</h3>
                <div>
                    {cat.description && cat.description.length <= 100 ? cat.description : "No description"}
                    {cat.description && cat.description.length > 100 ? cat.description.slice(0, -(cat.description.length - 100)).concat("...") : "No description"}
                </div>
            </div>
        </a>
        
    )
}

export default function CategoriesPage() {
    let [categories, setCategories] = useState([]);
    let getAllCategories = async () => {
        let res = await axios.get(`http://localhost:3001/api/categories/`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        setCategories(res.data.categories);
    }
    useEffect(() => {
        getAllCategories();
    }, []);
    console.log(categories);
    return (
        <div className="root">
            <Header/>
            <Grid className="cont" container spacing={3}>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={8}>
                    <div className="categoriesList">
                        {categories.map((el) => (
                            <Category
                                key={el.id}
                                cat={el}
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
