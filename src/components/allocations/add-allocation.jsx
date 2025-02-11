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
    OutlinedInput,
    MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import Select from '@mui/material/Select';
import allocationStore from "../../store/allocation-store";
import projectStore from "../../store/project-store";
import fundStore from "../../store/fund-store";
import Swal from "sweetalert2";


export default function Add_allocation({ onSave }) {

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const { project_id, fund_id } = useParams();
    const [formData, setFormData] = useState();

    const [projects, setProjects] = useState([]);
    const [funds, setFunds] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [selectedFunds, setSelectedFunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = React.useState(false);
    const [openFunds, setOpenFunds] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleCloseFunds = () => {
        setOpenFunds(false);
    };

    const handleOpenFunds = () => {
        setOpenFunds(true);
    };
    const navigate = useNavigate();
    const {
        handleSubmit,
        formState: { errors, isValid },
        trigger,
        reset,
        control,
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            allocation_type: "",
            allocation_method: "",
            amount_or_quantity: 0,
            distributed: 0,
        }
    });


    const distributed = useWatch({ control, name: "distributed" });
    const totalToDistribute = useWatch({ control, name: "totalToDistribute" });

    const remainingToDistribute = (totalToDistribute - distributed)||0;
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // הפונקציה של השליפה מה-API
                await projectStore.fetchProjectList();
                setProjects(projectStore.projectList);
                await fundStore.fetchFundList();
                setFunds(fundStore.fundList);
                setLoading(false);
                if (project_id) {
                    setSelectedProjects([project_id]);
                }
                if (fund_id) {
                    setSelectedFunds([fund_id]);
                }
                
            } catch (error) {
                setLoading(false);
                Swal.fire("שגיאה", "/הקרנותלא ניתן לטעון את רשימת הפרויקטים", "error");
            }
        };
        fetchProjects();
    }, []);  

    if (loading) {
        return <div>טעינה...</div>; // או הצג קומפוננטת loading אחרת
    }
    const getStyles = (item, selectedItems) => {
        return {
            fontWeight: selectedItems.includes(item)
                ? theme.typography.fontWeightMedium
                : theme.typography.fontWeightRegular,
        };
    };

    const handleProjectChange = (event) => {
        setSelectedProjects(event.target.value);
        setOpen(false);
    };

    const handleFundChange = (event) => {
        setSelectedFunds(event.target.value);
        setOpenFunds(false);
    };
    const handleSave = async (data) => {
        const isValid = await trigger();
        if (isValid) {
            try {
                // יצירת אובייקט חדש מהנתונים שנאספו
                const allocationData = {
                    id: Math.max(...allocationStore.allocationList.map(allocation => allocation.id)) + 1,
                    project_id: selectedProjects[0],
                    fund_id: selectedFunds[0],
                    allocation_type: data.allocation_type,
                    allocation_method: data.allocation_method,
                    amount_or_quantity: data.totalToDistribute,
                    distributed: data.distributed,
                };

                console.log("Allocation Data to Save:", allocationData);

                // שליחה לסטור
                await allocationStore.addAllocation(allocationData);

                // הודעת הצלחה
                Swal.fire({
                    title: "החלוקה נוספה בהצלחה",
                    text: "",
                    icon: "success",
                    timer: 800,
                    showConfirmButton: false,
                    timerProgressBar: true,
                });

                setTimeout(() => {
                    if (project_id){
                        navigate(`/allocations/project/${project_id}`)
                    }
                    else if (fund_id){
                        navigate(`/allocations/fund/${fund_id}`)
                    }
                    else{
                        navigate("/allocations"), 800
                    }
                });
            } catch (error) {
                // טיפול בשגיאות
                Swal.fire({
                    title: "שגיאה בהוספת החלוקה",
                    text: error.message || "לא ניתן לשמור את החלוקה.",
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
                    <div>
                        {/* שדה בחירה לפרויקט */}
                        <Controller
                            name="project"
                            control={control}
                            render={({ field }) => (
                                <FormControl sx={{ m: 1, width: 300 }}>
                                    <InputLabel id="project-label">בחר פרויקט</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="project-label"
                                        id="project-select"
                                        multiple
                                        open={open}
                                        onClose={handleClose}
                                        onOpen={handleOpen}
                                        value={selectedProjects}
                                        onChange={handleProjectChange}
                                        input={<OutlinedInput label="בחר פרויקט" />}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 48 * 4.5 + 8,
                                                    width: 250,
                                                },
                                            },
                                        }}
                                    >
                                        {projects.map((project) => (
                                            <MenuItem
                                                key={project.id}
                                                value={project.id}
                                                style={getStyles(project.name, selectedProjects)}
                                            >
                                                {project.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />

                        {/* שדה בחירה לקרן */}
                        <Controller
                            name="fund"
                            control={control}
                            render={({ field }) => (
                                <FormControl sx={{ m: 1, width: 300 }}>
                                    <InputLabel id="fund-label">בחר קרן</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="fund-label"
                                        id="fund-select"
                                        multiple
                                        open={openFunds}
                                        onClose={handleCloseFunds}
                                        onOpen={handleOpenFunds}
                                        value={selectedFunds}
                                        onChange={handleFundChange}
                                        input={<OutlinedInput label="בחר קרן" />}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 48 * 4.5 + 8,
                                                    width: 250,
                                                },
                                            },
                                        }}
                                    >
                                        {funds.map((fund) => (
                                            <MenuItem
                                                key={fund.id}
                                                value={fund.id}
                                                style={getStyles(fund.name, selectedFunds)}
                                            >
                                                {fund.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </div>
                    {/* שדה שם הפרויקט */}
                    <Controller
                        name="allocation_type"
                        control={control}
                        rules={{
                            required: "שדה זה הוא חובה",
                            // minLength: { value: 2, message: " הפרויקט חייב להיות לפחות 2 תווים" },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label=" סוג החלוקה"
                                variant="outlined"
                                fullWidth
                                error={!!errors.allocation_name}
                                helperText={errors.allocation_name?.message}
                                sx={{ mb: 2 }}
                            />
                        )}
                    />

                    {/* שדה תיאור */}
                    <Controller
                        name="allocation_method"
                        control={control}
                        rules={{
                            // minLength: { value: 5, message: "התיאור חייב להיות לפחות 5 תווים" },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="תיאור החלוקה"
                                variant="outlined"
                                fullWidth
                                rows={4}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                sx={{ mb: 2 }}
                            />
                        )}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Controller
                                name="totalToDistribute"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="סה''כ לחלוקה"
                                        variant="outlined"
                                        type="number"
                                        fullWidth
                                        inputProps={{ min: 0 }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>

                            {/* שדה חולק */}
                            <Controller
                                name="distributed"
                                control={control}
                                // rules={{
                                //     validate: (value) =>
                                //         value >= 0 && value <= totalToDistribute ||
                                //         "הערך חייב להיות בין 0 לסכום הכולל",
                                // }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="חולק"
                                        variant="outlined"
                                        type="number"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                        inputProps={{ min: 0, max: totalToDistribute }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {/* שדה סכום שנותר */}
                            <TextField
                                value={remainingToDistribute}
                                label="סה''כ נשאר לחלוקה"
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>
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
