import { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/navbars/Navbar";
import DashboardNavbar from "../components/navbars/DashboardNavbar";
import AllChatsOptions from "../components/navbars/AllChatsOptions";
import Chat from "./Chat";
import { Box, Typography, Paper } from "@mui/material";

function AllChats() {
    const [allChats, setAllChats] = useState([]);
    const [otherPerson, setOtherPerson] = useState([]);
    const [locateme, setLocateMe] = useState();

    const [chatter, setChatter] = useState(null);

    useEffect(() => {
        // console.log(auth.currentUser.uid)   
        let tData = [];
        let tDataOther=[];

        let url = new URL(window.location.href);
        let params = new URLSearchParams(url.search);
        const chatwith = params.get("chatter");
        console.log(chatwith)

        if (chatwith!=null) {
            setChatter(chatwith);
        }
        // console.log(chatwith);
        const getAllChats = async () => {
            const querySnapshot = await getDocs(collection(db, "messages"));
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            if ((doc.data().sender===auth.currentUser.uid || doc.data().receiver===auth.currentUser.uid) && !(doc.data().sender===auth.currentUser.uid && doc.data().receiver===auth.currentUser.uid)) {
                tData.push(doc.data());
            }
            });
            tData.forEach((doc) => {
                // console.log(doc.sender)
                // console.log(doc.sender===auth.currentUser.uid, " ", doc.receiver===auth.currentUser.uid && !tDataOther.includes(doc.sender));
                if (doc.sender===auth.currentUser.uid && !tDataOther.includes(doc.receiver)) {
                    tDataOther.push(doc.receiver);
                } else if (doc.receiver===auth.currentUser.uid && !tDataOther.includes(doc.sender)) {
                    tDataOther.push(doc.sender);
                }
            })

            console.log(chatwith)
            if (chatwith && !tDataOther.includes(chatwith)) {
                tDataOther.push(chatwith);
            }
            setAllChats(tData);
            setOtherPerson(tDataOther);
            // console.log(tDataOther);
        }
        getAllChats();
        // console.log(allChats);
    }, [])

    const updateChat = () => {
    let url= new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    const chatwith = params.get("chatter");
    if (chatwith!=null) {
        setChatter(chatwith);
        setLocateMe(chatwith);
    }
    };

  return (
    <>
        {/* <Navbar /> */}
        {/* <div style={{position: "absolute", top: "3%", right: "40%", }}><h2>Messages</h2></div> */}
        {/* <h2>Messages</h2> */}
        <Box m={2} style={{marginTop: "2.5%"}}>
            <Box
                component={Paper}
                sx={{
                    width: "60vw",
                    textAlign: "center",
                    borderRadius: "0.5vw",
                    paddingTop: "12px",
                    backgroundColor: "white",
                    marginLeft: "35vw",
                    height: "9vh",
                }}
            >
                <Typography variant="h4">Messages</Typography>
            </Box>
        </Box>
        <DashboardNavbar />
        <div style={{marginTop: "500px", opacity: 0.95}} onClick={updateChat}>
            {otherPerson.length>0 && <AllChatsOptions allChatter={otherPerson} chatter={chatter}/>}
            </div>
        {chatter!=null && <Chat location={locateme} chatter={chatter}/>}
    </>
  )
}

export default AllChats;

