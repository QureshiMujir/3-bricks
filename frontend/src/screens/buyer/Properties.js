import React from "react";
import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ListingItem from "../../components/property/ListingItem";
import { db, auth } from "../../config/firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import SearchInput from "../../components/property/SearchInput";

const Properties = () => {
    const [data, setData] = useState([]);
    const [tempData, setTempData] = useState([]);

    useEffect(() => {
        const getProperties = async () => {
            const snapshot = await getDocs(collection(db, "ListedProperties"));
            let tData = [];
            snapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                let temp = doc.data();
                if (
                    temp.authorize !== false &&
                    temp.authorizeToSell !== false &&
                    temp.alreadySold !== true &&
                    temp.ownerId != auth.currentUser.id
                ) {
                    tData.push({ ...doc.data(), id: doc.id });
                }
            });
            setData(tData);
            setTempData(tData);
        };
        getProperties();
    }, []);
    const updateProperties = (e) => {
        const searchQuery = e.target.value;
        if (searchQuery.trim().length == 0) setData(tempData);
        else
            setData(
                tempData.filter((element) => element.name.includes(searchQuery))
            );
    };
    return (
        <Box m={2} style={{marginTop: "3%"}}>
            <Box
                ccomponent={Paper}
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
                <Typography variant="h4">Availabe Properties</Typography>
            </Box>
            <SearchInput updateProperties={updateProperties} />
            <Box
                width={"76vw"}
                sx={{
                    display: "grid",
                    marginTop: "30px",
                    gridColumn: "3",
                    // gridGap: "10px",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    // paddingX:"3%",
                }}
            >
                {data.map((item) => (
                    <ListingItem {...item} key={item.id} />
                ))}
            </Box>
        </Box>
    );
};

export default Properties;
