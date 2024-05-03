import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Paper,
    TextField,
    Divider,
    Button,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";

const Chat = (props) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    // console.log(props);
    const userId = props.chatter;
    const scroll = useRef();
    // console.log("userId is ", userId);
//     onKeyDown={(e) => {
//         if (e.key === "Enter") {
//            console.log("hello enter pressed");
//            handleSend();
//        }
//    }}

    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("timestamp"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let newMessages = [];
            querySnapshot.forEach((doc) => {
                let temp = doc.data();
                // console.log(doc.data());
                if (
                    (temp.sender === auth.currentUser.uid &&
                        temp.receiver === userId) ||
                    (temp.sender === userId &&
                        temp.receiver === auth.currentUser.uid)
                ) {
                    newMessages.push({ ...temp, id: doc.id });
                }
            });
            setMessages(newMessages);
        });
        return () => unsubscribe();
    }, [userId]);

    const handleSend = async () => {
        console.log(userId);
        if (message.trim().length===0) return;
        await addDoc(collection(db, "messages"), {
            message: message,
            sender: auth.currentUser.uid,
            receiver: userId,
            timestamp: serverTimestamp(),
        });
        setMessage("");
        scroll.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Box
            // sx={{
            //     display: "flex",
            //     alignItems: "center",
            //     textAlign: "center",
            //     flexDirection: "column",
            // }}
        >

            <Grid
                container
                component={Paper}
                elevation={12}
                sx={{
                    width: "58%",
                    margin: "5%",
                    height: "70vh",
                    position: "absolute",
                    right: "0%",
                    top: "10%",
                    boxShadow: "none",
                    background: "none"
                }}
            >
                <Grid item xs={12} height="45%">
                    <List>
                        {messages.map((item) => (
                            <ListItem key={item.id}>
                                <Grid container>
                                    <Grid
                                        item
                                        xs={12}
                                        align={
                                            auth.currentUser.uid === item.sender
                                                ? "right"
                                                : "left"
                                        }
                                    >
                                        <Paper
                                            elevation={3}
                                            sx={{
                                                borderRadius: "16px",
                                                backgroundColor: `${
                                                    auth.currentUser.uid ===
                                                    item.sender
                                                        ? "#5f95f1e3"
                                                        : "white"
                                                }`,
                                                paddingX: "4%",
                                                paddingY: "1%",
                                                width: "fit-content",
                                                color: `${
                                                    auth.currentUser.uid ===
                                                    item.sender
                                                        ? "white"
                                                        : "black"
                                                }`,
                                            }}
                                        >
                                            {item.message}
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))}
                    </List>
                    <div ref={scroll} />
                </Grid>
                <Divider />
                <Grid item xs={12} margin="1rem">
                    <Box
                        sx={{
                            display: "flex",
                            position: "absolute",
                            padding: "20px",
                            flexDirection: "row",
                            gap: "2%",
                            marginTop: "8.5%",
                            width: "58%",
                            position: "fixed",
                            backgroundColor: "#F6F7FF"
                        }}
                    >
                        <TextField
                            variant="standard"
                            fullWidth
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                            }}
                            placeholder="Enter Message Here"
                            onKeyDown = {(e) => {
                                if (e.key === "Enter") handleSend();
                            }}
                        ></TextField>
                        <Button variant="contained" onClick={handleSend}>
                            <SendIcon />
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Chat;
