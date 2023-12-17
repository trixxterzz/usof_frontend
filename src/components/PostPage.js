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

const Comment = ({comment, self}) => {
    const [author, setAuthor] = useState();
    const [liked, setLiked] = useState(false);
    const [type, setType] = useState("Like");
    const [rating, setRating] = useState(comment.likeCount);
    const [isEditing, setEditing] = useState(false);
    const [content, setContent] = useState(comment.content);
    const navigate = useNavigate();
    useEffect(() => {
        getAuthor();
        isLiked();
    }, []);
    const getAuthor = async () => {
        let res = await axios.get(`http://localhost:3001/api/users/${comment.authorId}`, {
            headers:{
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        if (res.status === 200){
            setAuthor(res.data.user.login);
        }
    }
    let isLiked = async () => {
        if (!Cookies.get("token")) return false;
        let res = await axios.get(`http://localhost:3001/api/comments/${comment.id}/likes`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        if (res.status === 200){
            for (let i of res.data.likes){
                if (i.authorId === self.id){
                    setLiked(true);
                    setType(i.type);
                }
            }
        }
        else return false;
    }
    let updateLike = async (likeType) => {
        if (liked === true){
            if (likeType === type){
                let res = await axios.delete(`http://localhost:3001/api/comments/${comment.id}/likes`,{
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
                let res = await axios.delete(`http://localhost:3001/api/comments/${comment.id}/likes`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`
                    }
                });
                if (res.status == 200){
                    let res2 = await axios.post(`http://localhost:3001/api/comments/${comment.id}/likes`, {
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
            let res = await axios.post(`http://localhost:3001/api/comments/${comment.id}/likes`, {
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
    const deleteComment = async () => {
        await axios.delete(`http://localhost:3001/api/comments/${comment.id}`, {
            headers:{
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        window.location.reload(false);
    }
    const startEdit = async () => {
        setEditing(true);
    }
    const handleChange = (event, setState) => {
        setState(event.target.value);
    }
    const updateComment = async () => {
        let res = await axios.patch(`http://localhost:3001/api/comments/${comment.id}`, {
            content: content
        },{
            headers:{
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        if (res.status === 200){
            setEditing(false);
        }
    }
    return (
        <div className="comment">
            <div className="commentBody commentPart">
                <div>
                    {author}
                </div>
                <div>
                    {new Date(comment.publishDate).toLocaleDateString() + " " + new Date(comment.publishDate).toLocaleTimeString().slice(0, -3)}
                </div>
                {isEditing 
                ? <form id="commentFormForm">
                    <div className="commentForm" id="commentAreaDiv">
                        <textarea value={content} rows={4} id="commentArea" onChange={(event) => handleChange(event, setContent)}></textarea>
                    </div>
                    <div id="addCommentButtDiv" className="commentForm">
                        <button onClick={updateComment} id="addCommentButt" type="button">SAVE</button>
                    </div>
                </form> 
                : <div className="commentContent">
                    {content}
                </div>}
            </div>
            <div className="additionalCommentFeatures commentPart">
                <div className="commentLike-container">
                    {liked === true && type === "Like" ? <BiSolidLike size={35} onClick={(event) => updateLike("Like")}/> : <BiLike size={35}  onClick={(event) => updateLike("Like")}/>}
                </div>
                <div className="commentLike-container" id="ratingContainer">
                    {rating}
                </div>
                <div className="commentLike-container">
                    {liked === true && type === "Dislike" ? <BiSolidDislike size={35}  onClick={(event) => updateLike("Dislike")}/> : <BiDislike size={35}  onClick={(event) => updateLike("Dislike")}/>}
                </div>
                <div className="commentButt">
                    {!isEditing  && self.id == comment.authorId ? <div><button id="editButt" onClick={startEdit}>EDIT</button></div> : null}
                    {!isEditing  && self.id == comment.authorId ? <div><button onClick={deleteComment} id="deleteButt">DELETE</button></div> : null}
                </div>
            </div>
        </div>
    )
}

const CommentSection = ({id}) => {
    let [self, setSelf] = useState({id: 0});
    const [content, setContent] = useState("");
    const [comments, setComments] = useState([]);
    useEffect(() => {
        getSelf();
        getComments();
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
    const getComments = async () => {
        console.log(id);
        let res = await axios.get(`http://localhost:3001/api/posts/${id}/comments`, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        if (res.status === 200){
            setComments(res.data.comments);
        }
    }
    const addComment = async () => {
        let res = await axios.post(`http://localhost:3001/api/posts/${id}/comments`, {
            content: content
        }, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        if (res.status === 200){
            getComments();
            setContent("");
        }
    }
    const handleChange = (event, setState) => {
        setState(event.target.value);
    }
    return (
        <div>
            <h2 id="commentsLab">Comments: </h2>
            <div id="createCommentDiv">
                <form id="commentFormForm">
                    <div className="commentForm" id="commentAreaDiv">
                        <textarea rows={4} id="commentArea" placeholder="Write comment here" onChange={(event) => handleChange(event, setContent)}></textarea>
                    </div>
                    <div id="addCommentButtDiv" className="commentForm">
                        <button onClick={addComment} id="addCommentButt" type="button">ADD</button>
                    </div>
                </form>
            </div>
            <div id="comments">
                {comments.length > 0 ? comments.map((el) => (
                    <Comment
                        key={el.id}
                        comment={el}
                        self={self}
                    />
                )) : <h2 id="noComments">No comments so far</h2>}
            </div>
            
        </div>
        
    )
}

const Category = ({ categoryName }) => (
    <div className="postCategory">
        {categoryName}
    </div>
);

const Post = ({id}) => {
    const [found, setFound] = useState(true);
    const [post, setPost] = useState({categories: []});
    let [liked, setLiked] = useState(false);
    let [type, setType] = useState("Like");
    let [rating, setRating] = useState();
    let [self, setSelf] = useState({id: 0});
    const navigate = useNavigate();
    useEffect(() => {
        getPost();
        isLiked();
        getSelf();
    }, []);
    let getPost = async () => {
        try {
            let res = await axios.get(`http://localhost:3001/api/posts/${id}`);
            if (res.status == 200){
                setPost(res.data.post);
                setRating(res.data.post.likeCount);
            }
        }
        catch (error){
            if (error.response.status === 404){
                setFound(false);
            }
        }
        
    }
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
    const deletePost = async () => {
        let res = await axios.delete(`http://localhost:3001/api/posts/${id}`, {
            headers:{
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        });
        if (res.status === 200){
            navigate("/");
        }
    }
    if (found == false){
            return(
                <div>
                    <h2>Not found...</h2>  
                </div>)
    }
    return(
        <div className="postPagePost">
            <div>
                <div className="postHead">
                    <h2 id="title">{post.title}</h2>
                </div>
                <div className="postHead" id="additionalInfo">
                    <p>{post.authorName}</p>
                    <p>{new Date(post.publishDate).toLocaleDateString() + " " + new Date(post.publishDate).toLocaleTimeString().slice(0, -3)}</p>
                    <div>
                        {liked === true && type === "Like" ? <BiSolidLike className="likeIcon" size={35} onClick={(event) => updateLike("Like")}/> : <BiLike className="likeIcon" size={35}  onClick={(event) => updateLike("Like")}/>}
                    </div>
                    <div id="rateDiv">
                        <p>{rating}</p>
                    </div>
                    <div>
                        {liked === true && type === "Dislike" ? <BiSolidDislike className="likeIcon" size={35}  onClick={(event) => updateLike("Dislike")}/> : <BiDislike className="likeIcon" size={35}  onClick={(event) => updateLike("Dislike")}/>}
                    </div>
                    {self.id == post.authorId ? <div><a href={`http://localhost:3000/posts/${post.id}/edit`}><button id="editButt">EDIT</button></a></div> : null}
                    {self.id == post.authorId ? <div><button id="deleteButt" onClick={deletePost}>DELETE</button></div> : null}
                </div>
                <div>
                        {post.categories.map((cat) => (
                            <Category key={cat.id} categoryName={cat.title}/>
                        ))}
                </div>
            </div>
            <div className="postBody" id="content">
                {post.content}
            </div>
        </div>
    )
}

export default function PostPage(){
    const {id} = useParams();
    return (
        <div className="root">
            <Header/>
            <Grid container spacing={1}>
                <Grid item xs={2}>

                </Grid>
                <Grid item xs={8}>
                    <Post key={id} id={id} />
                    <CommentSection id={id} />
                </Grid>
                <Grid item xs={2}>
                    
                </Grid>
            </Grid>
        </div>
    )
}