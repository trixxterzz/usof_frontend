import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoutes(){
    return Cookies.get("token") ? <Outlet/> : <Navigate to={"/login"}/>
}