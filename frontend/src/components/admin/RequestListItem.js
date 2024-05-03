import { Box, Button, Paper, Typography } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { db } from "../../config/firebase";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { providers, Contract } from "ethers";
import { contractAddress } from "../../constants";

import ThreeBricks from "../../artifacts/contracts/ThreeBricks.sol/ThreeBricks.json";
import { pinFileToIPFS } from "../../utils/pinFileToIPFS";
import CustomizedDialogs from "./DialogBox";

const provider = new providers.Web3Provider(window.ethereum);
// get the end user
const signer = provider.getSigner();
// get the smart contract
const contract = new Contract(contractAddress, ThreeBricks.abi, signer);

const RequestListItem = (props) => {
    const [expand, setExpand] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [item, _setItem] = useState(props);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [stepCount, setStepCount] = useState(0);
    const [error, setError] = useState(null);

    const upload = async () => {
        setLoading(true);
        setModal(true);
        try {
            const propertyId = item.propertyId;
            const titleDeedFileURL = item.titleDeed.fileAddress;
            const walletAddressOfPropertyOwner = item.sellerWalletAddress;

            // get image Blob
            let imageBlob;
            try {
                const fetchTitleDeedURL = await fetch(titleDeedFileURL);
                imageBlob = await fetchTitleDeedURL.blob();
            } catch (e) {
                console.log(e);
                setLoading(false);
                setError(JSON.stringify(e));
                return;
            }

            // pass image blob to pinata
            const pinataResponse = await pinFileToIPFS(imageBlob, propertyId);

            setStepCount((prev) => prev + 1);

            if (window.ethereum) {
                await window.ethereum.enable();

                const ipfsHash = pinataResponse.data.IpfsHash;

                // call the pay to mint method on the smart contract
                const result = await contract.mintNFT(
                    walletAddressOfPropertyOwner,
                    ipfsHash,
                    propertyId
                );

                setStepCount((prev) => prev + 1);

                // wait for result to be mined
                const newlyMintedToken = (await result.wait()).events[0].args
                    .tokenId;

                setStepCount((prev) => prev + 1);

                // get token ID returned by the smart contract
                const tokenId = parseInt(
                    newlyMintedToken._hex.substring(2),
                    16
                );
                console.log("tokenId from contract: ", tokenId);

                // save tokenId to fire base
                // mark this property as verified
                const propertyRef = doc(db, "ListedProperties", item.id);

                await updateDoc(propertyRef, {
                    authorize: true,
                    tokenID: tokenId,
                });

                setLoading(false);
                setCompleted(true);
            }
        } catch (err) {
            console.error(err);
            // alert("An error occured!");
            setLoading(false);
            setError(JSON.stringify(err));
        }
    };

    // already verified waala case
    if (item && item.authorize === true) {
        return null;
    }

    return (
        <>
            <CustomizedDialogs
                open={modal}
                setOpen={setModal}
                stepCount={stepCount}
                error={error}
                steps={[
                    "Uploading Title Deed to IPFS",
                    "Transacting with Rentify smart contract",
                    "Minting NFT",
                    "Success",
                ]}
            />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginBottom: "1vh",
                    borderRadius: "1vh",
                    paddingY: "3vh",
                    paddingX: "2vw",
                    mb: 3,
                }}
                component={Paper}
                // elevation={6}
                // className={"awesome-bg-0"}
            >
                <Box width={"20%"}>
                    <img
                        src={item.images[0]}
                        style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "contain",
                        }}
                        alt={item.name}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        marginX: "2%",
                        height: "100%",
                        flexGrow: 1,
                        gap: "1.5vh",
                    }}
                >
                    <Typography variant="h4">{item.name}</Typography>
                    <Typography variant="body1">{item.city}</Typography>
                    {expand && (
                        <>
                            <Typography variant="body1">
                                Address: {item.address}
                            </Typography>
                            <Typography variant="body1">
                                Property Type: {item.propertyType}
                            </Typography>
                            <Typography variant="h5">Amenities: </Typography>
                            {item.amenities.map((i, index) => (
                                <Typography variant="body2" key={index}>
                                    {index}) {i}
                                </Typography>
                            ))}
                            <a
                                href={item.titleDeed.fileAddress}
                                target="_blank"
                            >
                                <Button variant="outlined">Title Deed</Button>
                            </a>
                        </>
                    )}
                </Box>
                <Box width="20%">
                    <Typography variant="body1">
                        Seller Wallet Address:{" "}
                        {item.sellerWalletAddress.length > 10
                            ? item.sellerWalletAddress.substring(0, 7) + "..."
                            : item.sellerWalletAddress}
                    </Typography>
                    <Button
                        fullWidth
                        onClick={() => setExpand(!expand)}
                        sx={{
                            marginTop: "10%",
                        }}
                        variant="outlined"
                        endIcon={
                            !expand ? (
                                <KeyboardDoubleArrowDownIcon />
                            ) : (
                                <KeyboardDoubleArrowUpIcon />
                            )
                        }
                    >
                        {expand ? `Collapse` : `Expand`}
                    </Button>
                    {expand && !completed && (
                        <Button
                            fullWidth
                            onClick={() => {
                                upload();
                            }}
                            sx={{
                                marginTop: "10%",
                            }}
                            variant="contained"
                            disabled={loading}
                        >
                            Verify
                        </Button>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default RequestListItem;
