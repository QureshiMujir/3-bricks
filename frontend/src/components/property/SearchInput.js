import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";

export default function SearchInput({ updateProperties }) {
    return (
        <Paper
            component="form"
            sx={{
                p: "2px 6px",
                display: "flex",
                alignItems: "center",
                width: "95%",
                my: "26px",
                background: "#FFFFFF",
                boxShadow: "0px 20px 70px rgba(86, 138, 146, 0.1)",
                borderRadius: "6px",
            }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Properties"
                inputProps={{ "aria-label": "search properties" }}
                onChange={(e) => updateProperties(e)}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}
