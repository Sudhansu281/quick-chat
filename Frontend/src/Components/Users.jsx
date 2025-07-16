import React from "react";
import "./mystyles.css";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";


function Users() {
  const lightTheme = useSelector((state) => state.themeKey);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ ease: "anticipate", duration: "0.3" }}
        className="list-container"
      >
        <div className={"ug-header" + (lightTheme ? "" : " dark")}>
          <p className={"ug-title" + (lightTheme ? "" : " dark")}>
            Online users
          </p>
        </div>
        <div className="sb-search">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <input placeholder="Search" className="search-box" />
        </div>
        <div className="ug-list">
          <div className="list-item">
            <p className="con-icon">T</p>
            <p className="con-title">Test User</p>
          </div>
          <div className="list-item">
            <p className="con-icon">T</p>
            <p className="con-title">Test User</p>
          </div>
          <div className="list-item">
            <p className="con-icon">T</p>
            <p className="con-title">Test User</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Users;
