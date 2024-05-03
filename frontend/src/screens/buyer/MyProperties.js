import React from "react";
import { auth } from "../../config/firebase";
import { Box, Typography, Paper } from "@mui/material";
import ListingMyItem from "../../components/property/ListingMyItem";
import { db } from "../../config/firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import SearchInput from "../../components/property/SearchInput";

const MyProperties = () => {
    const [data, setData] = useState([]);
    const [tempData, setTempData] = useState([]);

    useEffect(() => {
        console.log(auth.currentUser.uid);
        const getProperties = async () => {
            const snapshot = await getDocs(collection(db, "ListedProperties"));
            let tData = [];
            snapshot.forEach((doc) => {
                console.log(doc.data());
                if (doc.data().ownerId === auth.currentUser.uid) {
                    tData.push({ ...doc.data(), id: doc.id });
                } else {
                    for (
                        let i = 0;
                        i < doc.data().purchaseRequests.length;
                        i++
                    ) {
                        let temp = doc.data().purchaseRequests[i];
                        if (
                            // temp.approved === true &&
                            temp.uid === auth.currentUser.uid
                        ) {
                            tData.push({
                                ...doc.data(),
                                id: doc.id,
                                maiKhareedSakta:
                                    temp.approved === true ? true : false,
                            });
                        }
                    }
                }
            });

            setData(tData);
            setTempData(tData);
            console.log(tData);
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
                <Typography variant="h4">My Properties</Typography>
            </Box>
            <SearchInput updateProperties={updateProperties} />
            <Box
                width={"76vw"}
                sx={{
                    display: "grid",
                    marginTop: "30px",
                    gridColumn: "3",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    // marginLeft: "-25px",
                }}
            >
                {data.map((item) => (
                    <ListingMyItem {...item} key={item.id} />
                ))}
            </Box>
        </Box>
    );
};

export default MyProperties;
