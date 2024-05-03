import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import NavLink from "./NavLink";
import Logout from "../auth/Logout";

import ApartmentIcon from "@mui/icons-material/Apartment";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ChatIcon from "@mui/icons-material/Chat";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useLocation, useNavigate } from "react-router-dom";

const SellerDashboard = (props) => {
    const navigate = useNavigate();
    const currentRoute = useLocation().pathname;

    return (
        <Drawer
            sx={{
                width: 350,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: 290,
                    boxSizing: "border-box",
                    background: "rgba(252, 254, 254, 0.43)",
                    backdropFilter: "blur(25px)",
                },
                marginLeft: "-10px",
            }}
            variant="permanent"
            anchor="left"
            classes={{ paper: "awesome-bg-0" }}
        >
            <Box role="presentation" p={2}>
                <List>
                    <div
                        style={{
                            paddingLeft: "18px",
                            marginTop: "-6px",
                            marginBottom: "28px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                        }}
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        <ListItem>
                            <ListItemIcon>
                                <img src="/logo.png" width={"40px"} />
                            </ListItemIcon>
                            <ListItemText>
                                <h2>Rentify</h2>
                            </ListItemText>
                        </ListItem>
                    </div>

                    <NavLink
                        text={"List A Property"}
                        icon={<HandshakeIcon />}
                        onClickNavigateTo="/seller/create"
                        isActive={currentRoute === "/seller/create"}
                    />
                    <NavLink
                        text={"My Property Listings"}
                        icon={<ApartmentIcon />}
                        onClickNavigateTo="/seller/my"
                        isActive={currentRoute === "/seller/my"}
                    />
                    <NavLink
                        text={"My Chats"}
                        icon={<ChatIcon />}
                        onClickNavigateTo="/chat"
                        isActive={currentRoute === "/chat"}
                    />
                </List>
                <Box
                    position={"absolute"}
                    width={"calc(100% - 20px)"}
                    bottom={"20px"}
                    margin={"auto"}
                >
                    <Logout />
                </Box>
            </Box>
        </Drawer>
    );
};

export default SellerDashboard;
