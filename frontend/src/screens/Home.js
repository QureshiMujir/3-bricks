import { Box, Button, Typography } from "@mui/material";
import HeaderImage from "../assets/header.png";
import { Link } from "react-router-dom";
import Navbar from "../components/navbars/Navbar";
import TickMark from "../components/Lottie/TickMark";
import MeraLottie from "../components/Lottie/MeraLottie";
import SpecialPointSection from "../components/Home/SpecialPointSection";
import problemsImg from "../assets/problems.png";
import polygon from "../assets/polygon.png";
const Home = (props) => {
    return (
        <>
            <Box
                sx={{
                    height: "100vh",
                    position: "relative",
                }}
                className="awesome-bg-0"
            >
                <Navbar />
                <Box
                    sx={{
                        margin: 2,
                        maxWidth: "50%",
                        position: "absolute",
                        top: "25%",
                        left: "5%",
                        padding: "18px",
                        zIndex: 3,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        alignItems: "start",
                    }}
                >
                    <Typography fontSize="40px" style={{ width: "100%" }}>
                        Making Housing Affordable
                    </Typography>
                    <Box sx={{ my: 4 }}>
                        <TickMark text={"Minimize Corruption"} />
                        <TickMark text={"No Middlemen needed"} />
                        <TickMark text={"Transperent Transactions"} />
                        <TickMark text={"Handle Escrow Onchain"} />
                        <TickMark text={"Seamless Transfer"} />
                    </Box>
                    <Box sx={{ width: "30vw", display: "flex", mt: 2 }}>
                        <Button
                            variant="contained"
                            component={Link}
                            to="/buyer/browse"
                            fullWidth
                            sx={{
                                mr: 3,
                                p: 1.8,
                                borderRadius: 3,
                                background:
                                    "linear-gradient(166.88deg, #54A3FF 9.45%, #348FF9 227.32%)",
                                boxShadow: "none",
                                fontSize: "15px",
                            }}
                        >
                            Browse Properties
                        </Button>
                        <Button
                            variant="contained"
                            component={Link}
                            to="/seller/create"
                            fullWidth
                            sx={{
                                mr: 3,
                                p: 1.8,
                                borderRadius: 3,
                                background:
                                    "linear-gradient(166.88deg, #54A3FF 9.45%, #348FF9 227.32%)",
                                boxShadow: "none",
                                fontSize: "15px",
                            }}
                        >
                            List A Property
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        top: "10vh",
                        right: "10vh",
                        maxWidth: "50%",
                        zIndex: "100",
                    }}
                >
                    <img
                        src={HeaderImage}
                        style={{
                            height: "100vh",
                            zIndex: "-1",
                            position: "relative",
                        }}
                        alt=""
                    />
                </Box>
            </Box>
            <Box marginTop={11} paddingTop={"10px"}>
                <SpecialPointSection
                    heading="What problems are we solving?"
                    isOnlyImage={true}
                    imageUrl={problemsImg}
                />
            </Box>
            <Box marginTop={14} bgcolor={"#eef5f8"}>
                <SpecialPointSection
                    backgroundColor="#eef5f8"
                    heading="Property Selection Process"
                    imageUrl={"/assets/property_selection.svg"}
                    isOnlyImage
                />
            </Box>
            <SpecialPointSection
                backgroundColor="#fdf9fb"
                heading="Property Selling Process"
                imageUrl={"/assets/property_selling.svg"}
                isOnlyImage
            />
            <SpecialPointSection
                heading="Industrial Applications"
                backgroundColor="#eef5f8"
                pointsList={[
                    "Streamlined and automated property ownership transfer process using NFTs and smart contracts",
                    "Increased transparency and security through the use of the blockchain for property ownership records",
                ]}
                imageUrl="https://media2.giphy.com/media/U22HxRRRXQDHrRwxz7/giphy.gif?cid=790b761128ae72216af0c92cd2b5d03ec12e4192a263eb3a&rid=giphy.gif&ct=s"
                // imageUrl="https://media1.giphy.com/media/4E5RAy2GhY4Lc84IMi/giphy.gif?cid=ecf05e47yw86f3c7su5uqmkrmz29jt4rq985bsroevfip1b9&rid=giphy.gif&ct=s"
                reverse={true}
            />
            <SpecialPointSection
                heading="Security Features"
                backgroundColor="#fdf9fb"
                pointsList={[
                    "Secure storage of property ownership records using the immutability and cryptographic features of the blockchain",
                    "Authentication and authorization mechanisms using smart contracts and digital signatures to ensure only authorized parties can transfer property ownership",
                    "Use of escrow mechanism in smart contract to ensure that the payment is released only after the successful transfer of property ownership",
                ]}
                imageUrl="https://media4.giphy.com/media/IzLOkxWYZJQacKuUFn/giphy.gif?cid=790b7611f105d87d1f829218228d79a482783225ae95def7&rid=giphy.gif&ct=s"
            />
            <SpecialPointSection
                backgroundColor="#fefbef"
                heading="Powered by Polygon"
                pointsList={[
                    "Accurate identification and verification of property ownership",
                    "Reduced time and cost for property ownership transfer and related processes",
                ]}
                imageUrl={polygon}
                reverse={true}
            />
            <Box height={"10vh"}></Box>
        </>
    );
};

export default Home;
