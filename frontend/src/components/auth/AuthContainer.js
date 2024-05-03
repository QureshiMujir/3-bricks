import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, Providers, db } from "../../config/firebase";
import { Button, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Center from "../utils/Center";
import { setDoc, doc } from "firebase/firestore";

const AuthContainer = (props) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [disabled, setDisabled] = useState(false);

    const signInWithGoogle = () => {
        setDisabled(true);
        signInWithPopup(auth, Providers.google)
            .then(async (result) => {
                setDisabled(false);
                // console.info("TODO: navigate to authenticated screen");
                console.log(result.user.email);
                console.log(result.user.displayName);
                await setDoc(doc(db, "UserAuth", result.user.uid), {email: result.user.email, name: result.user.displayName, uid: result.user.uid});
                navigate("/");
            })
            .catch((error) => {
                setErrorMessage(error.code + ": " + error.message);
                setDisabled(false);
            });
    };

    return (
        <Center height={"auto"}>
            <Button
                startIcon={<GoogleIcon />}
                size="large"
                disabled={disabled}
                variant="contained"
                onClick={signInWithGoogle}
            >
                Sign In With Google
            </Button>
            <Typography sx={{ mt: 2 }} color={"red"}>
                {errorMessage}
            </Typography>
        </Center>
    );
};

export default AuthContainer;
