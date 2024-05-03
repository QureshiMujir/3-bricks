import { Button, Typography, Paper } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import { auth, db } from "../../config/firebase";
import { providers, Contract, utils } from "ethers";
import { contractAddress } from "../../constants";
import ThreeBricks from "../../artifacts/contracts/ThreeBricks.sol/ThreeBricks.json";
import { doc, updateDoc } from "firebase/firestore";

const provider = new providers.Web3Provider(window.ethereum);
// get the end user
const signer = provider.getSigner();
// get the smart contract
const contract = new Contract(contractAddress, ThreeBricks.abi, signer);

const ListingItem = (props) => {
    // const navigate = useNavigate();
    const {
        name,
        images,
        id,
        ownerId,
        price,
        downPaymentPrice,
        tokenID,
        maiKhareedSakta,
    } = props;

    const [paymentMade, setPaymentMade] = useState(false);

    const makePayment = async () => {
        // get these values from firebase
        const remainingAmountFromFb = price - downPaymentPrice;
        const tokenIdOfThisProperty = tokenID;
        console.log(price, downPaymentPrice);
        if (window.ethereum) {
            await window.ethereum.enable();

            const amountInWei = utils.parseUnits(
                remainingAmountFromFb.toString(),
                18
            );

            // call the pay to mint method on the smart contract
            const result = await contract.completePaymentAndEsrow(
                tokenIdOfThisProperty,
                {
                    value: amountInWei,
                }
            );

            result.wait();

            // update ownerId
            const propertyRef = doc(db, "ListedProperties", id);

            await updateDoc(propertyRef, {
                ownerId: auth.currentUser.uid,
                purchaseRequests: [],
                authorizeToSell: false,
            });

            setPaymentMade(true);
            // console.log("result", result);
        }
    };

    return (
        <Paper
            sx={{
                padding: 1,
                my: 3,
                width: "380px",
                height: "450px",
                borderRadius: "6px",
                cursor: "pointer",
                "&:hover": {
                    // transitionDelay: "2s",
                    // boxShadow: "-2px 6px 20px 5px rgba(0,0,0,0.3)",
                    boxShadow: "5px 5px 10px #bebebe, -5px -5px 10px #ffffff",
                },
            }}
            onClick={() => {
                // navigate(`/property/${id}`);
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: "60%",
                    transition: "all 0.3s ease",
                    // "&:hover": { transform: "scale(0.98)" },
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
            <Typography fontSize={"2.5rem"}>{name}</Typography>
            <Typography
                variant="h5"
                sx={{
                    marginBottom: "8px",
                    alignItems: "center",
                    display: price ? "flex" : "none",
                }}
            >
                <img
                    src="/assets/matic.png"
                    style={{ marginRight: "10px" }}
                    width={"40px"}
                />
                {price}
            </Typography>
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                m={1}
            >
                {
                    (auth.currentUser.uid !== ownerId,
                    price,
                    downPaymentPrice && (
                        <>
                            {maiKhareedSakta && (
                                <Button
                                    size="large"
                                    variant="contained"
                                    startIcon={<DoneAllRoundedIcon />}
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                >
                                    Approved
                                </Button>
                            )}
                            {!maiKhareedSakta && !paymentMade && (
                                <Button
                                    variant="outlined"
                                    startIcon={<AccessTimeIcon />}
                                    disableRipple={true}
                                    disableFocusRipple={true}
                                    size="large"
                                    fullWidth
                                    disabled={auth.currentUser.uid === ownerId}
                                >
                                    {auth.currentUser.uid !== ownerId
                                        ? `Waiting For Approval`
                                        : `You own the property`}
                                </Button>
                            )}
                        </>
                    ))
                }
                <Box>
                    {!paymentMade && auth.currentUser.uid !== ownerId && (
                        <>
                            {maiKhareedSakta && (
                                <Button
                                    size="large"
                                    variant="outlined"
                                    onClick={makePayment}
                                >
                                    Complete payment
                                </Button>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default ListingItem;
