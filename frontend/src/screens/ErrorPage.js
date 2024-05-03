import React from "react";
import Center from "../components/utils/Center";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function ErrorPage() {
    return (
        <Center>
            <img src="/assets/error.webp" />
            <Typography variant="h1">Page Not Found</Typography>
            <Link to="/">
                <Button variant="contained" size="large">
                    Return Home
                </Button>
            </Link>
        </Center>
    );
}

export default ErrorPage;
