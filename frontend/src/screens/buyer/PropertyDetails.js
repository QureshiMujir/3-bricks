import { Button, Typography, Paper, Grid, Chip } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useState } from "react";

import { providers, Contract, utils } from "ethers";
import { contractAddress } from "../../constants";
import ThreeBricks from "../../artifacts/contracts/ThreeBricks.sol/ThreeBricks.json";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useSnackbar } from "notistack";

const provider = new providers.Web3Provider(window.ethereum);
// get the end user
const signer = provider.getSigner();
// get the smart contract
const contract = new Contract(contractAddress, ThreeBricks.abi, signer);

const PropertyDetails = () => {
    const { propertyID } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const {
        id,
        name,
        price,
        images,
        city,
        address,
        amenities,
        ownerId,
        purchaseRequests,
    } = data;

    const { enqueueSnackbar } = useSnackbar();
    let seller_long = "72.88800325961361",
        seller_lat = "19.068371276850556";
    let map_image = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/pin-s+555555(${seller_long},${seller_lat})/${seller_long},${seller_lat},15,0/300x200@2x?access_token=pk.eyJ1IjoibWJtcGgiLCJhIjoiY2tya2F0OTJvMGk1YjJwbGZ1bDJ1eGU0dCJ9.fLJp01SsIpdhGmWdBzaSnQ`;

    const [allowRequestPurchase, setAllowRequestPurchase] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);

    useEffect(() => {
        handleConnect();
    }, []);

    useEffect(() => {
        console.log(propertyID);
        const getData = async () => {
            setLoading(true);
            const docRef = doc(db, "ListedProperties", propertyID);
            const docSnap = await getDoc(docRef);
            setData({ ...docSnap.data(), id: docSnap.id });
            setLoading(false);
        };
        getData();
    }, [propertyID]);

    useEffect(() => {
        setAllowRequestPurchase(true);

        if (!purchaseRequests) return;
        purchaseRequests.forEach((request) => {
            if (request.uid === auth.currentUser.uid) {
                setAllowRequestPurchase(false);
            }
        });
    }, [purchaseRequests]);

    const makeDeposit = async () => {
        const tokenId = data.tokenID;
        const downPayment = data.downPaymentPrice;
        console.log(tokenId, downPayment);

        if (!walletAddress) {
            console.log("wallet address nahi hai");
            return;
        }

        if (window.ethereum) {
            await window.ethereum.enable();
            // Convert the amount to wei
            const amountInWei = utils.parseUnits(downPayment.toString(), 18);

            if (window.ethereum) {
                await window.ethereum.enable();

                const result = await contract.makeDownPayment(
                    tokenId,
                    walletAddress,
                    {
                        value: amountInWei,
                    }
                );

                result.wait();

                const propertyRef = doc(db, "ListedProperties", id);

                await updateDoc(propertyRef, {
                    purchaseRequests: arrayUnion({
                        name: auth.currentUser.displayName,
                        uid: auth.currentUser.uid,
                        walletAddress: walletAddress,
                        approved: false,
                    }),
                });

                enqueueSnackbar("Purchase Made", {
                    variant: "success",
                });

                setAllowRequestPurchase(false);

                // console.log("result", result);
            }
        }
    };

    const handleConnect = () => {
        window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then((res) => {
                setWalletAddress(res[0]);
            });
    };

    if (
        !loading &&
        (data.authorize === false ||
            data.authorizeToSell === false ||
            data.alreadySold === true)
    ) {
        return (
            <Box p={5} display="flex">
                <Typography variant="h2">
                    Property listing does not exist OR is already sold
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            p={5}
            display="flex"
            flexDirection={"row-reverse"}
            justifyContent="space-between"
            width={"80vw"}
        >
            {loading && <Typography variant="h2">Loading...</Typography>}
            {!loading && (
                <>
                    <Box width={"30%"}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                gap: "10vh",
                            }}
                        >
                            <Box>
                                <img
                                    width={"300px"}
                                    height={"200px"}
                                    style={{
                                        objectFit: "contain",
                                    }}
                                    src={images[0]}
                                    alt={name}
                                />
                            </Box>
                            <Box
                                component={Paper}
                                sx={{
                                    padding: "4%",
                                    borderRadius: "0.5vw",
                                }}
                            >
                                <img
                                    width={"300px"}
                                    height={"200px"}
                                    src={map_image}
                                    alt="map"
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box mx={10}>
                        <Typography variant="h1" my={4}>
                            {name}
                        </Typography>

                        <Typography variant="h4" my={4}>
                            Matic.{price}
                        </Typography>
                        <Box>
                            {ownerId === auth.currentUser.uid && (
                                <Typography>
                                    You already own this property
                                </Typography>
                            )}

                            {ownerId !== auth.currentUser.uid &&
                                allowRequestPurchase && (
                                    <Button
                                        variant="contained"
                                        onClick={makeDeposit}
                                        disabled={loading}
                                        sx={{ marginRight: 4 }}
                                    >
                                        Request Purchase
                                    </Button>
                                )}

                            <Button
                                variant="outlined"
                                component={Link}
                                to={`/chat?chatter=${ownerId}`}
                            >
                                Chat with Owner
                            </Button>
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{ marginY: "26px" }}
                            style={{ display: "flex", alignItems: "center" }}
                        >
                            <img
                                src="/assets/location.png"
                                width={"30px"}
                                style={{ marginRight: "15px" }}
                            />
                            {city}
                        </Typography>
                        <Typography variant="h6" my={4}>
                            <strong>Address:</strong> {address}
                        </Typography>

                        <Typography variant="h4" mb={3}>
                            Amenities
                        </Typography>
                        <Grid container>
                            {amenities.map((item, index) => (
                                <Paper
                                    sx={{
                                        marginX: 1,
                                        paddingY: "0.65vw",
                                        paddingX: "0.90vw",
                                        height: "5vh",
                                        borderRadius: "2.5vh",
                                    }}
                                    key={index}
                                >
                                    {item}
                                </Paper>
                            ))}
                        </Grid>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default PropertyDetails;
