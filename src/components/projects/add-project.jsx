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
    Snackbar,
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
import needyStore from "../../store/needy-store";
import projectStore from "../../store/project-store";
import Swal from "sweetalert2";


export default function Add_project({ onSave }) {

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [formData, setFormData] = useState(
    );

    const navigate = useNavigate();
    const {
        handleSubmit,
        control,
        formState: { errors, isValid },
        trigger,
        reset,
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            project_name: "",
            description: ""
        }
    });

    const handleSave = async (data) => {
        const isValid = await trigger();
        if (isValid) {
            try {
                const maxId = Math.max(...projectStore.projectList.map(project => project.id));
                
                console.log("lastProjectId", maxId);
                
                const jsonData = {
                    id: maxId+1,
                    name: data.project_name,
                    description: data.description,
                };
                console.log(jsonData);
                await projectStore.addProject(jsonData);
                Swal.fire({
                    title: "הפרויקט נוסף בהצלחה",
                    text: "",
                    icon: "success",
                    timer: 800,
                    showConfirmButton: false, // לא להציג כפתור אוקי
                    timerProgressBar: true
                });
                setTimeout(() => navigate("/Project_list"), 800);
                // console.log("Project saved:", data);
                // reset({
                //     project_name: "",
                //     description: "",
                // });
                // alert("הפרויקט נשמר בהצלחה!");
            } catch (error) {
                Swal.fire({
                    title: "שגיאה בהוספת הפרויקט",
                    text: error.message || "לא ניתן לשמור את הפרויקט.",
                    icon: "error",
                    showConfirmButton: true,
                });
            }
        } else {
            console.log("There are errors in the form.");
        }
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



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
                <Box
                    component="form"
                    onSubmit={handleSubmit(handleSave)}
                    sx={{
                        maxWidth: 600,
                        margin: "0 auto",
                        padding: 2,
                        backgroundColor: "#f9f9f9",
                        borderRadius: 2,
                        boxShadow: 1,
                    }}
                >
                    {/* שדה שם הפרויקט */}
                    <Controller
                        name="project_name"
                        control={control}
                        rules={{
                            required: "שדה זה הוא חובה",
                            minLength: { value: 2, message: "שם הפרויקט חייב להיות לפחות 2 תווים" },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="שם הפרויקט"
                                variant="outlined"
                                fullWidth
                                error={!!errors.project_name}
                                helperText={errors.project_name?.message}
                                sx={{ mb: 2 }}
                            />
                        )}
                    />

                    {/* שדה תיאור */}
                    <Controller
                        name="description"
                        control={control}
                        rules={{
                            // minLength: { value: 5, message: "התיאור חייב להיות לפחות 5 תווים" },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="תיאור"
                                variant="outlined"
                                fullWidth
                                rows={4}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                sx={{ mb: 2 }}
                            />
                        )}
                    />

                    {/* כפתור שמור */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={!isValid}
                    >
                        שמור
                    </Button>
                </Box>
            </ThemeProvider>
        </CacheProvider>
    );
}
