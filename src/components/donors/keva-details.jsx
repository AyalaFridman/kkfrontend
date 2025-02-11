import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Box,
    IconButton,
    FormControl,
    InputLabel,
    NativeSelect,
    Typography,
    Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import donorStore from "../../store/donor-store";

export default function KevaDetails({ onSave, donor }) {

    const [donorDetails, setDonorDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const { id } = useParams();
    const {
        handleSubmit,
        control,
        formState: { errors, isValid, touchedFields },
        trigger,
        reset,
        getValues,
        setValue,
    } = useForm({
        mode: "onBlur",
    });



    // Fetch data from MobX store
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setIsError(false);
                await donorStore.fetchDonorsKevaDetails(id);
                setDonorDetails(donorStore.currentDonorKeva[0] || null);
                console.log(donorDetails);
                
            } catch (error) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

// Handle loading or error
if (donorStore.isLoading) {
    return <div>טוען...</div>;
}

if (donorStore.isError) {
    return <div>שגיאה: {donorStore.errorMessage}</div>;
}

const theme = createTheme({
    direction: "rtl",
});

const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
});

return (
    <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>

            <Typography
                variant="h6"
                sx={{ marginBottom: 2, fontWeight: "bold", color: "#333" }}
            >
                פרטי הוראת קבע
            </Typography>
            <TextField
                label="שם תורם"
                value={`${donorDetails?.donor.last_name} ${donorDetails?.donor.first_name}`}
                InputProps={{
                    readOnly: true,
                }}
            />

            <TextField
                label="סכום חודשי"
                value={donorDetails?.monthly_amount}
                InputProps={{
                    readOnly: true,
                }}
            />

            <TextField
                label="קטגוריה"
                value={donorDetails?.category}
                InputProps={{
                    readOnly: true,
                }}
            />

            <TextField
                label="סטטוס"
                value={donorDetails?.status ? "פעיל" : "לא פעילה"}
                InputProps={{
                    readOnly: true,
                }}
            />

        </ThemeProvider>
    </CacheProvider>
);
}
