import {
    Alert,
    Box,
    Button,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
const storage = getStorage();
const filter = createFilterOptions();

const names = [
    "football",
    "cricket",
    "swimming pool",
    "golf court",
    "smash ball",
    "gym",
    "clubhouse",
    "garden",
    "mall",
    "partyhall",
    "theatre",
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const AddProperty = () => {
    const user = auth.currentUser;
    const navigate = useNavigate();

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState();
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [option, setOption] = useState("Sell");
    // const [amenities, setAmenities] = useState("");
    const [titleDeed, setTitleDeed] = useState();
    const [propertyType, setPropertyType] = useState(null);
    const [propertyID, setPropertyID] = useState();
    const [price, setPrice] = useState(0);
    const [connected, setConnected] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState("");
    const imageUploadRef = useRef();
    const titleDeedRef = useRef();
    const [errorMessage, setErrorMessage] = useState("");
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setAmenities(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    function getStyles(name, personName, theme) {
        return {
            fontWeight:
                amenities.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    const theme = useTheme();
    const [amenities, setAmenities] = React.useState([]);

    const upload = async () => {
        if (
            name.trim().length == 0 ||
            propertyID.trim().length == 0 ||
            city.trim().length == 0 ||
            address.trim().length == 0 ||
            amenities.length == 0
        )
            return setErrorMessage("Please fill all required fields");

        setLoading(true);
        let imageURL;
        let titleDeedURL = "";
        try {
            const deedFile = titleDeed === undefined ? undefined : titleDeed[0];
            const imageFile = image === undefined ? undefined : image[0];

            if (deedFile === undefined) {
                alert("Upload Title Deed in PDF Format only");
                setLoading(false);
                return;
            }

            if (imageFile === undefined) {
                alert("Upload a picture");
                setLoading(false);
                return;
            }

            const deedStorageRef = ref(storage, `titleDeed/${deedFile.name}`);
            const snapshot = await uploadBytes(deedStorageRef, deedFile);
            const titleDeedurl = await getDownloadURL(snapshot.ref);

            const imageStorageRef = ref(storage, `images/${imageFile.name}`);
            const snapshotImage = await uploadBytes(imageStorageRef, imageFile);
            const imageurl = await getDownloadURL(snapshotImage.ref);

            // let amenitiesArray = amenities.split(" ");

            const data = {
                propertyId: propertyID,
                name: name,
                city: city,
                address: address,
                type: option,
                propertyType: propertyType,
                amenities,
                titleDeed: {
                    fileAddress: titleDeedurl,
                    verified: false,
                },
                images: [imageurl],
                ownerId: auth.currentUser.uid,
                authorize: false,
                sellerWalletAddress: walletAddress,
                authorizeToSell: false,
                alreadySold: false,
                purchaseRequests: [],
            };

            await addDoc(collection(db, "ListedProperties"), data);

            // const regRef = doc(db, "ListedProperties", propertyID);
            // const finalData = {
            //     propertyID,
            //     propertyType,
            //     type: option,
            //     ownerID: user.uid,
            //     imageURL,
            //     titleDeedURL,
            //     address,
            //     name,
            //     city,
            //     price,
            //     monthlyRent,
            //     deposit,
            //     amenities: amenitiesArray,
            //     status: "Requested",
            //     documents,
            //     verified: false,
            // };
            // await setDoc(regRef, finalData, { merge: true })
            //     .then(() => {
            //         alert("Property added successfully");
            //         navigate("/seller");
            //     })
            //     .catch((err) => console.log(err));
            setLoading(false);
            navigate("/seller/my");
        } catch (err) {
            console.error(err);
            alert("An error occured!!");
        }
        setLoading(false);
    };
    const handleConnect = () => {
        window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then((res) => {
                // console.log(res);
                setWalletConnected(true);
                setConnected(true);
                setWalletAddress(res[0]);
            });
    };

    return (
        <Box width={"80%"}>
            <Box
                component={Paper}
                sx={{
                    // height: "10vh",
                    marginTop: 5,
                    marginLeft: 3,
                    marginRight: 5,
                    // position: "fixed",
                    // alignItems: "center",

                    width: "95%",
                    textAlign: "center",
                    borderRadius: "0.5vw",
                    paddingTop: "12px",
                    backgroundColor: "white",
                    // marginBottom: "4.5vh",
                    height: "9vh",
                }}
                // className="awesome-bg-0"
            >
                <Typography variant="h4">
                    List A Property
                </Typography>
            </Box>
            <Box p={5} display="flex" mt={"10vh"}>
                <Box width={"100%"} mr={10}>
                    <Box display={errorMessage ? "block" : "none"}>
                        <Alert
                            style={{ marginBottom: "18px" }}
                            severity="error"
                            onClose={() => setErrorMessage("")}
                        >
                            {errorMessage}
                        </Alert>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: "3vh",
                            mt: "-3vh",
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Property ID"
                            // value={propertyID}
                            onChange={(e) => setPropertyID(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            // value={name}
                            onChange={(e) => setName(e.target.value)}
                            label="Name"
                            required
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="City"
                            // value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Full Legal Address"
                            // value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />

                        <div
                            style={{
                                display: "none",
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Price (Matic)"
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>

                        <Autocomplete
                            required
                            value={propertyType}
                            onChange={(event, newValue) => {
                                if (typeof newValue === "string") {
                                    setPropertyType(newValue.title);
                                } else if (newValue && newValue.inputValue) {
                                    setPropertyType(newValue.inputValue);
                                } else {
                                    setPropertyType(newValue.title);
                                }
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                const { inputValue } = params;
                                // Suggest the creation of a new value
                                const isExisting = options.some(
                                    (option) => inputValue === option.title
                                );
                                if (inputValue !== "" && !isExisting) {
                                    filtered.push({
                                        inputValue,
                                        title: `Add "${inputValue}"`,
                                    });
                                }

                                return filtered;
                            }}
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            id="Type of property"
                            options={propertyOptions}
                            getOptionLabel={(option) => {
                                if (typeof option === "string") {
                                    return option;
                                }
                                if (option.inputValue) {
                                    return option.inputValue;
                                }
                                return option.title;
                            }}
                            renderOption={(props, option) => (
                                <li {...props}>{option.title}</li>
                            )}
                            sx={{}}
                            freeSolo
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Type of Property"
                                    required
                                />
                            )}
                        />
                        <FormControl fullWidth sx={{}}>
                            <InputLabel id="demo-multiple-chip-label">
                                Amenities
                            </InputLabel>
                            <Select
                                required
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                value={amenities}
                                onChange={handleChange}
                                input={
                                    <OutlinedInput
                                        id="select-multiple-chip"
                                        label="Amenities"
                                    />
                                }
                                renderValue={(selected) => (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 0.5,
                                        }}
                                    >
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {names.map((name) => (
                                    <MenuItem
                                        key={name}
                                        value={name}
                                        style={getStyles(
                                            name,
                                            amenities,
                                            theme
                                        )}
                                    >
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <input
                            required
                            onChange={(e) => setTitleDeed(e.target.files)}
                            ref={titleDeedRef}
                            type="file"
                            style={{ display: "none" }}
                        />
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{ marginY: 2 }}
                            onClick={() => titleDeedRef.current.click()}
                            startIcon={titleDeed && <CheckCircleOutlineIcon />}
                        >
                            Upload title Deed
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleConnect}
                            disabled={connected}
                        >
                            Connect Wallet
                        </Button>

                        <Button
                            variant="contained"
                            onClick={upload}
                            disabled={loading || !walletConnected}
                        >
                            Submit Data
                        </Button>
                    </Box>
                </Box>
                <Box width="50%">
                    <Grid container justifyContent={"center"}>
                        <img
                            src={
                                image
                                    ? URL.createObjectURL(image[0])
                                    : "/placeholder-img.jpg"
                            }
                            width={300}
                            alt="Property Images"
                        />
                    </Grid>
                    <input
                        onChange={(e) => setImage(e.target.files)}
                        ref={imageUploadRef}
                        type="file"
                        style={{ display: "none" }}
                    />
                    <Button
                        variant="outlined"
                        size="large"
                        sx={{ marginY: 2 }}
                        fullWidth
                        onClick={() => imageUploadRef.current.click()}
                    >
                        Click to add Images
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

const propertyOptions = [
    { title: "Apartment" },
    { title: "Bunglow" },
    { title: "Building" },
    { title: "Duplex" },
];

export default AddProperty;
