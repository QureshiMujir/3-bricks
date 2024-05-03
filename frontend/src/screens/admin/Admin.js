import {
    Avatar,
    Box,
    Container,
    List,
    ListItemAvatar,
    Typography,
    ListItem,
    ListItemText,
    Divider,
    Card,
    Button,
    Paper,
    Grid,
    ListItemIcon,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ApprovalIcon from "@mui/icons-material/Approval";
import RequestListItem from "../../components/admin/RequestListItem";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import Wallet from "../../components/admin/Wallet.png";
import { useNavigate } from "react-router-dom";

function Admin() {
    const [data, setData] = useState([]);
    const [walletAddress, setWalletAddress] = useState("");
    const [approved, setApproved] = useState(8);
    const [pending, setPending] = useState(7);
    const navigate = useNavigate();

    useEffect(() => {
        handleConnect();
    }, []);
    const handleConnect = () => {
        window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then((res) => {
                setWalletAddress(res[0]);
            });
    };

    useEffect(() => {
        const getProperties = async () => {
            const snapshot = await getDocs(collection(db, "ListedProperties"));
            let tData = [];
            snapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                let temp = doc.data();

                if (temp.authorize !== true) {
                    tData.push({ ...doc.data(), id: doc.id });
                }
            });
            setData(tData);
            console.log(tData);
        };
        getProperties();
    }, []);

    return (
        <Box
            component={Paper}
            width={"97vw"}
            elevation={12}
            sx={{
                maxHeight: "96vh",
                height: "fit-content",
                borderRadius: "1vw",
                padding: "1.5vw",
                display: "flex",
                flexDirection: "row",
                marginY: "1.5vh",
                marginX: "1.5vw",
            }}
            className="awesome-bg-0 "
        >
            <Box width={"20%"}>
                {/* <img
                    src="/logo.png"
                    style={{
                        height: "10vh",
                        // width: "100%",
                        margin:"auto"
                    }}
                /> */}
                <div
                    style={{
                        paddingLeft: "18px",
                        marginTop: "12px",
                        marginBottom: "28px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <ListItem onClick={() => navigate("/")}>
                        <ListItemIcon>
                            <img src="/logo.png" width={"40px"} />
                        </ListItemIcon>
                        <ListItemText>
                            <h2>Rentify</h2>
                        </ListItemText>
                    </ListItem>
                </div>

                <Box
                    width={"100%"}
                    component={Paper}
                    sx={{
                        borderRadius: "1vw",
                        // padding: "0.5vw",
                        marginY: "5vh",
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                position: "absolute",
                                top: "20%",
                                left: "10%",
                            }}
                        >
                            Your Wallet
                        </Typography>

                        <Typography
                            sx={{
                                position: "absolute",
                                bottom: "17%",
                                left: "10%",
                            }}
                        >
                            {walletAddress.length > 10
                                ? walletAddress.substring(0, 12) + "..."
                                : walletAddress}
                        </Typography>
                        <img
                            src={`${Wallet}`}
                            style={{
                                width: "100%",
                            }}
                        />
                    </Box>
                </Box>
                <Grid container style={{ gap: 15 }}>
                    <Grid
                        item
                        xs={5}
                        component={Paper}
                        sx={{
                            borderRadius: "1vw",
                            padding: "1vw",
                            textAlign: "center",
                        }}
                    >
                        <Typography>Approved </Typography>
                        <Typography variant="h5">{approved}</Typography>
                    </Grid>
                    <Grid
                        item
                        xs={5}
                        component={Paper}
                        sx={{
                            borderRadius: "1vw",
                            padding: "1vw",
                            textAlign: "center",
                        }}
                    >
                        <Typography>Pending</Typography>
                        <Typography variant="h5">{pending}</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box
                width={"80%"}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    gap: "2vh",
                    paddingX: "5%",
                }}
            >
                <Box
                    component={Paper}
                    sx={{
                        backgroundColor: "white",
                        padding: "2%",
                        textAlign: "center",
                        borderRadius: "0.5vw",
                        marginBottom: "4.5vh",
                        height: "10vh",
                    }}
                >
                    <Typography variant="h4"> Ownership Validation</Typography>
                </Box>

                <Box sx={{ overflowY: "scroll", height: "80vh" }}>
                    {data.map((item, index) => (
                        <RequestListItem {...item} key={item.id} />
                    ))}
                </Box>
                {/* </Box> */}
            </Box>
        </Box>
    );
}

export default Admin;
