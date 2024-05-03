import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { db, auth } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import NavLink from "./NavLink";
import { useEffect, useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AllChatsOptions = (props) => {
    const [allChatter, setAllChatter] = useState([]);
    const [renderList, setRenderList] = useState();
    const navigate = useNavigate();
    const currentRoute = useLocation().pathname;
    useEffect(() => {
        let userUIDs = props.allChatter;
        let active = props.chatter;
        // console.log(props.allChatter);
        let arr = [];
        const getData = async () => {
            for (let i = 0; i<userUIDs.length; ++i) {
                console.log(userUIDs[i]);
                const docRef = doc(db, "UserAuth", userUIDs[i]);
                const docSnap = await getDoc(docRef);
                // console.log("Document data:", docSnap.data());
                arr.push(docSnap.data().name);
            }
            let i = -1;
            setAllChatter(arr);
            // console.log(arr);
            setRenderList(
                arr.map((doc) => (
                    <NavLink
                        text={doc}
                        icon={<ChatIcon />}
                        key={doc}
                        onClickNavigateTo={`/chat?chatter=${userUIDs[++i]}`}
                        isActive={userUIDs[i]===active}
                    />
                ))
            );
        };
        getData();
    }, [props.allChatter, props.chatter]);

    // console.log(allChatter);

    return (
        <Drawer
            sx={{
                width: 240,
                flexShrink: 0,
                border: "none",
                "& .MuiDrawer-paper": {
                    marginLeft: "300px",
                    marginTop: "4%",
                    width: 240,
                    boxSizing: "border-box",
                    // background: "rgba(252, 254, 254, 0.43)",

                    background: "rgba(255, 0, 0, 0.85)",
                    backdropFilter: "blur(25px)",
                },
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
                            marginTop: "-8px",
                            marginBottom: "28px",
                            paddingTop: "20%",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                        }}
                    ></div>
                    {renderList}
                </List>
                <Box
                    position={"absolute"}
                    width={"calc(100% - 20px)"}
                    bottom={"20px"}
                    margin={"auto"}
                ></Box>
            </Box>
        </Drawer>
    );
};

export default AllChatsOptions;
