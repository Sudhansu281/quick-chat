// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllUsers, getLoggedUser } from "../apiCalls/user";
// import { useDispatch, useSelector } from "react-redux";
// import { setAllUsers } from "../Features/userSlice";
// import { hideLoader, showLoader } from "../Features/loaderSlice";
// import toast from "react-hot-toast";

// function ProtectedRoute({ children }) {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   // const [user, setUser] = useState(null);
//   const { user } = useSelector((state) => state.userReducer);
//   const [allUser, setAllUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchUser = async () => {
//     try {
//       dispatch(showLoader());
//       response = await getLoggedUser();
//       dispatch(hideLoader());
//       if (response.success) {
//         dispatch(setUser(response.data));
//         setLoading(false);
//       } else {
//         toast.error(response.message);
//         navigate("/login");
//       }
//     } catch (error) {
//       dispatch(hideLoader());
//       navigate("/login");
//     }
//   };
//   const getAllUsersFromDb = async () => {
//     let response = null;
//     try {
//       dispatch(showLoader());
//       response = await getAllUsers();
//       dispatch(hideLoader());
//       if (response.success) {
//         dispatch(setAllUsers(response.data));
//         setLoading(false);
//       } else {
//         toast.error(response.message);
//         navigate("/login");
//       }
//     } catch (error) {
//       dispatch(hideLoader());
//       navigate("/login");
//     }
//   };
//   useEffect(() => {
//     if (localStorage.getItem("token")) {
//       fetchUser(), getAllUsersFromDb();
//     } else {
//       navigate("/login");
//     }
//   }, []);

//   // ✅ Prevent children from rendering until user is fetched
//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return <>{children}</>;
// }

// export default ProtectedRoute;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser, getAllUsers } from '../apiCalls/user';
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../Features/loaderSlice";
import toast from "react-hot-toast";
import { setAllChats, setAllUsers, setUser } from "../Features/userSlice";
import { getAllChats } from "../apiCalls/chat";

function ProtectedRoute({children}){
    const { user } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    const navigate = useNavigate();
 
    const getloggedInUser = async () => {
        let response = null;
        try{
            dispatch(showLoader())
            response = await getLoggedUser();
            dispatch(hideLoader())

            if(response.success){
                dispatch(setUser(response.data));
            }else{
                toast.error(response.message);
                window.location.href = '/login';
            }
        }catch(error){
            dispatch(hideLoader())
            navigate('/login');
        }
    }

    const getAllUsersFromDb = async () => {
        let response = null;
        try{
            dispatch(showLoader());
            response = await getAllUsers();
            dispatch(hideLoader());

            if(response.success){
                dispatch(setAllUsers(response.data));
            }else{
                toast.error(response.message);
                window.location.href = '/login';
            }
        }catch(error){
            dispatch(hideLoader())
            navigate('/login');
        }
    }

    const getCurrentUserChats = async () => {
        try{
            const response = await getAllChats();
            if(response.success){
                dispatch(setAllChats(response.data))
            }
        }catch(error){
            navigate('/login');
        }
    }

    useEffect(() => {
        if(localStorage.getItem('token')){
            getloggedInUser();
            getAllUsersFromDb();
            getCurrentUserChats();
        }else{
            navigate('/login');
        }
    }, []);

    return (
        <div>
            { children }
        </div>
    );
}

export default ProtectedRoute;