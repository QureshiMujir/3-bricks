import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import HomeIcon from "@mui/icons-material/Home";

import {
    auth,
    isUserAuth,
    userName,
    userProfileImgUrl,
} from "../../config/firebase";

import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import AuthContainer from "../auth/AuthContainer";
import useYScroll from "../hooks/useYScroll";
import TickMark from "../Lottie/TickMark";
import { useTheme } from "@mui/material";
const pages = [
    {
        text: "Browse Properties",
        linkTo: "/buyer/browse",
    },
    {
        text: "Sell Properties",
        linkTo: "/seller/my",
    },
    {
        text: "My Properties",
        linkTo: "/buyer/my",
    },
];
const settings = ["Messages", "Logout"];

function Navbar() {
    const yScroll = useYScroll();
    const theme = useTheme();

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (setting) => {
        if (setting === "Logout") {
            signOut(auth)
                .then(() => {
                    navigate("/");
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        if (setting === "Messages") {
            navigate("/chat");
        }
        setAnchorElUser(null);
    };

    return (
        <AppBar
            style={{
                background: "transparent",
                boxShadow: "none",
            }}
            position={yScroll === 0 ? "static" : "fixed"}
            elevation={0}
            className="awesome-bg-0"
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box
                        onClick={() => {
                            navigate("/");
                        }}
                        display={"flex"}
                        alignItems={"center"}
                        sx={{
                            cursor: "pointer",
                        }}
                    >
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <img
                            width={"40px"}
                            style={{ margin: "18px 0" }}
                            src="./logo.png"
                        />
                        <Typography
                            variant="h5"
                            mx={4}
                            sx={{
                                mr: 2,
                                fontWeight: 600,
                                letterSpacing: "0.1rem",
                                textDecoration: "none",
                                color: theme.palette.text.primary,
                            }}
                        >
                            Rentify
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "flex", md: "none" },
                            }}
                        >
                            {pages.map((page, i) => (
                                <Link to={page.linkTo} key={page.linkTo + i}>
                                    <MenuItem
                                        key={page.text}
                                        onClick={handleCloseNavMenu}
                                    >
                                        <Typography
                                            textAlign="center"
                                            color={"black"}
                                        >
                                            {page.text}
                                        </Typography>
                                    </MenuItem>
                                </Link>
                            ))}
                            {!isUserAuth() ? (
                                <MenuItem>
                                    <Link to="/login">
                                        <Button
                                            style={{ marginRight: 12 }}
                                            variant="contained"
                                        >
                                            Login/Register
                                        </Button>
                                    </Link>
                                </MenuItem>
                            ) : (
                                ""
                            )}
                        </Menu>
                    </Box>
                    <HomeIcon
                        sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        Rentify
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                    >
                        {pages.map((page, i) => (
                            <Link to={page.linkTo} key={page.linkTo + i}>
                                <Button
                                    key={page.text}
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        my: 2,
                                        mx: 3,
                                        display: "block",
                                    }}
                                    variant="outlined"
                                    color="info"
                                    size="large"
                                >
                                    {page.text}
                                </Button>
                            </Link>
                        ))}

                        {!isUserAuth() && <AuthContainer />}
                    </Box>

                    {/* logout waala part */}
                    {isUserAuth() && (
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar
                                        alt={userName()}
                                        src={userProfileImgUrl()}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem
                                        key={setting}
                                        onClick={() =>
                                            handleCloseUserMenu(setting)
                                        }
                                    >
                                        <Typography textAlign="center">
                                            {setting}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Navbar;
