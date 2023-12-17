import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import Login from "./components/Login";
import PostPage from "./components/PostPage";
import EditPostPage from "./components/EditPostPage";
import DeleteComment from "./components/DeleteComment";
import FavouritesPage from "./components/FavouritesPage";
import PostByCategoryPage from "./components/PostsByCategoryPage";
import CategoriesPage from "./components/CategoriesPage";
import AddPostPage from "./components/AddPostPage";
import RegisterPage from "./components/RegisterPage";
import PasswordRecoveryPage from "./components/PasswordRecoveryPage";
import ProfilePage from "./components/ProfilePage";
import PasswordRecoveryForm from "./components/PasswordRecoveryForm";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Users from "./components/Users";

class App extends React.Component{
    render(){
        return(
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/passwordRecovery" element={<PasswordRecoveryPage/>}/>
                    <Route path="/password-reset/:token" element={<PasswordRecoveryForm/>} />
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/" element={<Main/>}/>
                        <Route path="/posts/:id" element={<PostPage/>} />
                        <Route path="/posts/:id/edit" element={<EditPostPage/>}/>
                        <Route path="/comments/:id/delete" element={<DeleteComment/>} />
                        <Route path="/favourites" element={<FavouritesPage/>} />
                        <Route path="/posts/byCategory/:id" element={<PostByCategoryPage />}/>
                        <Route path="/categories" element={<CategoriesPage/>}/>
                        <Route path="/posts/add" element={<AddPostPage/>}/>
                        <Route path="/users/self" element={<ProfilePage/>}/>
                        <Route path="/users" element={<Users/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        )
    }
}

export default App;