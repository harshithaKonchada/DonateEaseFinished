import { Outlet, useNavigate } from "react-router-dom"
import NavbarComponent from "./NavbarComponent";
import { useEffect } from "react";

const MainPage =() => {
    const navigate = useNavigate();
    return (
        <>
            <NavbarComponent/>
            <Outlet/>
        </>
    )
}

export default MainPage;