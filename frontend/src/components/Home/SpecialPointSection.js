import { Box, List, ListItem, Typography } from "@mui/material";
import Aos from "aos";
import React, { useEffect } from "react";
import "../../aos.css";
import TickMark from "../Lottie/TickMark";

function SpecialPointSection({
    heading,
    imageUrl,
    pointsList,
    isOnlyImage = false,
    reverse = false,
    backgroundColor = "#ffffff",
}) {
    useEffect(() => {
        console.log(pointsList && pointsList.map);
        Aos.init({
            duration: 2000,
        });
    }, []);

    return (
        <Box
            bgcolor={backgroundColor}
            display={"flex"}
            alignItems="center"
            height={"100vh"}
            flexDirection={
                isOnlyImage ? "column" : reverse ? "row-reverse" : "row"
            }
        >
            <Box
                display={"flex"}
                justifyContent={"center"}
                flexDirection={"column"}
                alignItems={"center"}
                width={"50%"}
            >
                <Typography
                    variant="h3"
                    align="center"
                    color={"#348FF9"}
                    letterSpacing={"2px"}
                    my={8}
                    data-aos="zoom-in"
                    data-aos-duration={500}
                >
                    {heading}
                </Typography>
                <Typography
                    align="center"
                    variant="p"
                    fontSize={"16px"}
                    width={"80%"}
                    letterSpacing={"2px"}
                    data-aos="fade-up"
                    data-aos-duration={300}
                >
                    <List>
                        {pointsList &&
                            pointsList.map((point, index) => (
                                <ListItem key={index}>
                                    <TickMark text={point} />
                                </ListItem>
                            ))}
                    </List>
                </Typography>
            </Box>
            <Box
                width={"50%"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                data-aos="zoom-in-up"
                data-aos-duration={1000}
                p={1}
            >
                <img src={imageUrl} style={{ margin: "auto" }} />
            </Box>
        </Box>
    );
}

export default SpecialPointSection;
