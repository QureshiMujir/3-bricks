import {
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { Contract, ethers, providers } from "ethers";
import BigNumber from "bignumber.js";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contractAddress } from "../../constants";
import ThreeBricks from "../../artifacts/contracts/ThreeBricks.sol/ThreeBricks.json";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CustomizedDialogs from "../admin/DialogBox";

import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";

const provider = new providers.Web3Provider(window.ethereum);
// get the end user
const signer = provider.getSigner();
// get the smart contract
const contract = new Contract(contractAddress, ThreeBricks.abi, signer);

const ListingSellerItem = (props) => {
    const [stepCount, setStepCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [err, setErr] = useState(null);

    const [stepCount1, setStepCount1] = useState(0);
    const [open1, setOpen1] = useState(false);
    const [err1, setErr1] = useState(null);

    const {
        ownerId,
        name,
        images,
        purchaseRequests,
        titleDeed,
        tokenID,
        id,
        authorizeToSell,
        authorize,
        alreadySold,
    } = props;
    const navigate = useNavigate();

    const [token, setToken] = useState(0.001);
    const [price, setPrice] = useState(0.01);
    const [authorizeToSellState, setAuthorizeToSellState] =
        useState(authorizeToSell);

    const [showPurchaseRequests, setShowPurchaseRequests] = useState(true);

    const listPropertyForSale = async () => {
        setOpen(true);

        // take these values
        const depositAmt = ethers.utils.parseUnits(token.toString(), 18);
        const sellingPrice = ethers.utils.parseUnits(price.toString(), 18);

        // get these values from firebase
        const tokenIdOfThisProperty = tokenID;

        if (window.ethereum) {
            await window.ethereum.enable();
            console.log(contract);
            setStepCount((prev) => prev + 1);

            // call the pay to mint method on the smart contract
            const result = await contract.createPropertyListing(
                tokenIdOfThisProperty,
                sellingPrice,
                depositAmt
            );

            result.wait();

            console.log("result", result);
            const propertyRef = doc(db, "ListedProperties", id);

            await updateDoc(propertyRef, {
                authorizeToSell: true,
                downPaymentPrice: token,
                price: price,
                alreadySold: false,
            });
            setAuthorizeToSellState(true);
            setStepCount((prev) => prev + 1);
        }
    };

    const sell = async (buyerAddress, buyerUid) => {
        setOpen1(true);

        if (window.ethereum) {
            await window.ethereum.enable();
            // call the pay to mint method on the smart contract
            setStepCount1((prev) => prev + 1);

            const result = await contract.NFTOwnerStartEscrow(
                tokenID,
                buyerAddress
            );

            result.wait();

            // console.log(purchaseRequests)
            let tData = [];
            for (let i = 0; i < purchaseRequests.length; i++) {
                // console.log(purchaseRequests[i].walletAddress,buyerAddress)
                if (purchaseRequests[i].walletAddress === buyerAddress) {
                    tData.push({
                        uid: buyerUid,
                        walletAddress: buyerAddress,
                        approved: true,
                    });
                } else {
                    tData.push({
                        ...purchaseRequests[i],
                    });
                }
            }

            // update owner ID in firebase
            await updateDoc(doc(db, "ListedProperties", id), {
                // ownerId: buyerUid,

                // TODO: make a copy of them in another collection
                // and mark the winner ---- maybe

                // // clears all other requests
                purchaseRequests: tData,

                // remove property from listing
                alreadySold: true,
            });
            setStepCount1((prev) => prev + 1);

            setShowPurchaseRequests(false);
        }
    };

    return (
        <>
            <CustomizedDialogs
                stepCount={stepCount}
                open={open}
                setOpen={setOpen}
                error={err}
                steps={[
                    "Connecting to Smart Contract",
                    "Waiting for response",
                    "Success",
                ]}
            />

            <CustomizedDialogs
                stepCount={stepCount1}
                open={open1}
                setOpen={setOpen1}
                error={err1}
                steps={[
                    "Connecting to Smart contract",
                    "Initiating Escrow",
                    "Success",
                ]}
            />
            <Paper
                sx={{
                    padding: 1,
                    my: 3,
                    width: "100%",
                    height: "420px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    "&:hover": {
                        // transitionDelay: "2s",
                        // boxShadow: "-2px 6px 20px 5px rgba(0,0,0,0.3)",
                        boxShadow:
                            "5px 5px 10px #bebebe, -5px -5px 10px #ffffff",
                    },
                    display: "flex",
                    alignItems: "center",
                }}
                onClick={() => {
                    // navigate(`/property/${id}`);
                }}
            >
                <Box
                    sx={{
                        width: "40%",
                        height: "100%",
                        transition: "all 0.3s ease",
                    }}
                >
                    <img
                        src={images}
                        width="100%"
                        height={"100%"}
                        style={{ borderRadius: "6px 6px 0 0" }}
                        alt={name}
                    />
                </Box>
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"stretch"}
                    width="50%"
                    m={4}
                >
                    <Box
                        sx={{
                            display: "flex",
                            marginY: 5,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h3">{name}</Typography>
                        <a href={titleDeed.fileAddress} target="_blank">
                            <Button variant="outlined">title deed</Button>
                        </a>
                    </Box>

                    {showPurchaseRequests === true &&
                        purchaseRequests &&
                        alreadySold === false && (
                            <Box
                                border={"1px solid grey"}
                                p={2}
                                overflow={"hidden scroll"}
                                display={
                                    purchaseRequests.length == 0
                                        ? "none"
                                        : "block"
                                }
                            >
                                {purchaseRequests.map((item, i) => (
                                    <>
                                        <Box
                                            key={item.uid + i}
                                            display={"flex"}
                                            justifyContent="space-between"
                                            alignItems={"center"}
                                            p={2}
                                        >
                                            <Typography>{item.name}</Typography>
                                            <Button
                                                onClick={() => {
                                                    sell(
                                                        item.walletAddress,
                                                        item.uid
                                                    );
                                                }}
                                                variant="contained"
                                            >
                                                Sell
                                            </Button>
                                        </Box>
                                        {purchaseRequests.length - 1 == i ? (
                                            ""
                                        ) : (
                                            <Divider />
                                        )}
                                    </>
                                ))}
                            </Box>
                        )}
                    {authorize === true && authorizeToSellState === false && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-around",
                                textAlign: "left",
                            }}
                        >
                            <TextField
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                label="Token Amount"
                                sx={{
                                    marginBottom: "14px",
                                }}
                            >
                                {" "}
                            </TextField>
                            <TextField
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                label="Selling Price"
                                sx={{
                                    marginBottom: "20px",
                                }}
                            >
                                {" "}
                            </TextField>
                        </Box>
                    )}
                    {authorize === true && authorizeToSellState === false && (
                        <Box>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={listPropertyForSale}
                            >
                                List Property
                            </Button>
                        </Box>
                    )}
                </Box>
            </Paper>
        </>
    );
};

export default ListingSellerItem;
