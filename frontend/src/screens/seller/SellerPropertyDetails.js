import React, { useRef, useState, useEffect } from "react";

import { Box, Typography, Paper } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import ListingSellerItem from "../../components/property/ListingSellerItem";
import CustomizedDialogs from "../../components/admin/DialogBox";

function SellerPropertyDetails() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getProperties = async () => {
            const snapshot = await getDocs(collection(db, "ListedProperties"));
            let tData = [];
            snapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                let temp = doc.data();
                // console.log(temp.ownerId,auth.currentUser.uid)

                if (temp.ownerId === auth.currentUser.uid) {
                    tData.push({ ...doc.data(), id: doc.id });
                }
            });
            setData(tData);
            console.log(tData);
        };
        getProperties();
    }, []);

    return (
        <Box m={5} width={"100%"}>
            <Box
                component={Paper}
                sx={{
                    width: "95%",
                    textAlign: "center",
                    borderRadius: "0.5vw",
                    paddingTop: "12px",
                    backgroundColor: "white",
                    // marginBottom: "4.5vh",
                    height: "9vh",
                }}
            >
                <Typography variant="h4">My Property Listings</Typography>
            </Box>
            <Box
                width={"100%"}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    marginTop: "30px",
                    // paddingX:"3%",
                    // marginLeft: "-30px",
                }}
            >
                {data.map((item) => (
                    <ListingSellerItem key={item.id} {...item} />
                ))}
            </Box>
        </Box>
    );
}

export default SellerPropertyDetails;
