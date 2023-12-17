import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Grid } from "@mui/material";
import Posts from "./Posts";
import Header from "./Header";
import axios from "axios";
import "../css/index.css";

export default function Main (){
    const [sortBy, setSortBy] = useState("None");
    const [sortType, setSortType] = useState("None");
    const handleChange = (event, setState) => {
        setState(event.target.value);
    }
    return(
        <div className="root">
            <Header/>
            <Grid className="cont" container spacing={3}>
                <Grid item xs={3}>
                    <div id="sortFilterDiv">
                        <div id="sortDiv">
                            <h3>Sort:</h3>
                            <form>
                                <select className="sortSelect" onChange={(event) => handleChange(event, setSortBy)}>
                                    <option selected disabled>Sort by...</option>
                                    <option className="sortOption" value={"like"}>Popularity</option>
                                    <option className="sortOption" value={"publishDate"}>Publish date</option>
                                </select>
                                <select className="sortSelect" onChange={(event) => handleChange(event, setSortType)}>
                                    <option selected disabled>Sort order...</option>
                                    <option className="sortOption" value={"asc"}>Ascending</option>
                                    <option className="sortOption" value={"desc"}>Descending</option>
                                </select>
                            </form>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Posts sortBy={sortBy} sortType={sortType} />
                </Grid>
                <Grid item xs={3}>
                    <div>
                        <a href="http://localhost:3000/posts/add"><button id="addPostButt">ADD NEW POST</button></a>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}
