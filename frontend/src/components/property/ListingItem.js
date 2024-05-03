import { Button, Typography, Paper } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
// import Matic from "../../assets/matic.png";
// import LocationPin from "../../assets/location.png";

const ListingItem = (props) => {
    const { name, price, images, id, city, propertyType } = props;
    const navigate = useNavigate();
    return (
        <Paper
            sx={{
                padding: 1,
                my: 3,
                width: "350px",
                height: "420px",
                borderRadius: "6px",
                cursor: "pointer",
                "&:hover": {
                    // transitionDelay: "2s",
                    // boxShadow: "-2px 6px 20px 5px rgba(0,0,0,0.3)",
                    boxShadow: "5px 5px 10px #bebebe, -5px -5px 10px #ffffff",
                },
            }}
            onClick={() => {
                navigate(`/buyer/browse/${id}`);
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
            <Box m={1}>
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Typography
                        variant="h4"
                        fontSize={"26px"}
                        color="rgb(52, 143, 249)"
                        textTransform="uppercase"
                        letterSpacing={"1px"}
                        overflow={"hidden"}
                        textOverflow={"ellipsis"}
                        whiteSpace="nowrap"
                        paddingRight={2}
                    >
                        {name}
                    </Typography>
                    <Typography variant="h6" fontSize={14} mx={1}>
                        {propertyType}
                    </Typography>
                </Box>

                <Typography
                    variant="h6"
                    sx={{ marginBottom: "14px" }}
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <img
                        src="/assets/location.png"
                        width={"30px"}
                        style={{ marginRight: "6px" }}
                    />
                    {city}
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ marginBottom: "6px" }}
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <img
                        src="/assets/matic.png"
                        width={"40px"}
                        style={{ marginRight: "6px" }}
                    />
                    {price}
                </Typography>
            </Box>
        </Paper>
    );
};

export default ListingItem;
