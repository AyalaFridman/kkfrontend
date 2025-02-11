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
    Dialog, DialogActions, DialogContent, DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import needyStore from "../../store/needy-store";
import serviceProviderStore from "../../store/service-provider-store";
import specialSupportedStore from "../../store/specisl-support-store";
import AddServiceProvider from "../service-providers/add-service-provider";
import Swal from "sweetalert2";

export default function Add_special_supported({ open, onClose, needy_id }) {
    const [serviceProvideropenDialog, setServiceProviderOpenDialog] = useState(false);

    const [needies, setNeedies] = useState([]);
    const [serviceProviders, setServiceProviders] = useState([]);
    const [openNeedy, setOpenNeedy] = React.useState(false);
    const [openServiceProviders, setOpenServiceProviders] = React.useState(false);
    const [selectedNeedy, setSelectedNeedy] = useState([]);
    const [selectedServiceProviders, setSelectedServiceProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    // const { needy_id } = useParams();
    const [formData, setFormData] = useState();

    const handleCloseNeedy = () => {
        setOpenNeedy(false);
    };

    const handleOpenNeedy = () => {
        setOpenNeedy(true);
    };
    const handleCloseServiceProviders = () => {
        setOpenServiceProviders(false);
    };
    const handleOpenServiceProviders = () => {
        setOpenServiceProviders(true);
    };

    const handleServiceProviderOpenDialog = () => {
        setServiceProviderOpenDialog(true);
    };

    const handleServiceProviderCloseDialog = (isAdded, newServiceProvider) => {
        setServiceProviderOpenDialog(false);
        if (isAdded && newServiceProvider) {
            serviceProviders.push(newServiceProvider);
            setSelectedServiceProviders([...selectedServiceProviders, newServiceProvider.id]);
        }
    };

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
            amount: 0,
            notes: "",
        },
    });

    useEffect(() => {
        const fetchdata = async () => {
            try {
                // הפונקציה של השליפה מה-API
                await needyStore.fetchNeedyList();
                setNeedies(needyStore.needyList);
                await serviceProviderStore.fetchServiceProviderList()
                setServiceProviders(serviceProviderStore.serviceProviderList)
                setLoading(false);
                if (needy_id) {
                    setSelectedNeedy([needy_id]);
                }
            } catch (error) {
                setLoading(false);
                Swal.fire("שגיאה", "לא ניתן לשמור את התמיכה", "error");
            }
        };
        fetchdata();
    }, [needy_id]);

    const handleSave = async (data) => {
        const isValid = await trigger();
        if (isValid) {
            try {
                const maxId = Math.max(
                    ...specialSupportedStore.specialSupportedList.map((support) => support.id)
                );
                const currentDate = new Date();
                const date =
                    currentDate.getFullYear() +
                    "/" +
                    (currentDate.getMonth() + 1) +
                    "/" +
                    currentDate.getDate();
                const jsonData = {
                    id: maxId + 1,
                    needy_id: selectedNeedy[0],
                    amount: parseFloat(data.amount),
                    date: date,
                    notes: data.notes,
                    service_provider_id: selectedServiceProviders[0],
                };
                await specialSupportedStore.addSpecialSupported(jsonData);
                Swal.fire({
                    title: "התמיכה נוספה בהצלחה",
                    text: "",
                    icon: "success",
                    timer: 800,
                    showConfirmButton: false, // לא להציג כפתור אוקי
                    timerProgressBar: true,
                });
                // setTimeout(() => navigate("/supported"), 800);
                onClose(true);
            } catch (error) {
                Swal.fire({
                    title: "שגיאה בהוספת הפרויקט",
                    text: error.message || "לא ניתן לשמור את התמיכה.",
                    icon: "error",
                    showConfirmButton: true,
                });
                onClose(false);
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

    const getStyles = (item, selectedItems) => {
        return {
            fontWeight: selectedItems.includes(item)
                ? theme.typography.fontWeightMedium
                : theme.typography.fontWeightRegular,
        };
    };

    const handleNeedyChange = (event) => {
        setSelectedNeedy(event.target.value);
        setOpenNeedy(false);
    };

    const handleServiceProvidersChange = (event) => {
        setSelectedServiceProviders(event.target.value);
        setOpenServiceProviders(false);
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
                <Dialog open={open} onClose={onClose}>
                    <DialogTitle>הוספת תמיכה מיוחדת</DialogTitle>
                    <DialogContent>
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
                                <Controller
                                    name="serviceProvider"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl sx={{ m: 1, width: 300 }}>
                                            <InputLabel id="serviceProvider-label">בחר נותן שירות</InputLabel>
                                            <Select
                                                {...field}
                                                labelId="serviceProvider-label"
                                                id="serviceProvider-select"
                                                multiple
                                                open={openServiceProviders}
                                                onClose={handleCloseServiceProviders}
                                                onOpen={handleOpenServiceProviders}
                                                value={selectedServiceProviders}
                                                onChange={handleServiceProvidersChange}
                                                input={<OutlinedInput label="בחר נותן שירות" />}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 48 * 4.5 + 8,
                                                            width: 250,
                                                        },
                                                    },
                                                }}
                                            >
                                                {serviceProviders.map((serviceProvider) => (
                                                    <MenuItem
                                                        key={serviceProvider.id}
                                                        value={serviceProvider.id}
                                                    >
                                                        {serviceProvider.name + ", " + serviceProvider.type_of_service}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleServiceProviderOpenDialog}
                                    style={{ marginTop: '10px' }}
                                >
                                    הוסף נותן שירות
                                </Button>
                                <AddServiceProvider
                                    open={serviceProvideropenDialog}
                                    onClose={(isAdded, newServiceProvider) => {
                                        handleServiceProviderCloseDialog(isAdded, newServiceProvider);
                                    }}
                                />
                                <Controller
                                    name="needy"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl sx={{ m: 1, width: 300 }}>
                                            <InputLabel id="needy-label">בחר נתמך</InputLabel>
                                            <Select
                                                {...field}
                                                labelId="needy-label"
                                                id="needy-select"
                                                multiple
                                                open={openNeedy}
                                                onClose={handleCloseNeedy}
                                                onOpen={handleOpenNeedy}
                                                value={selectedNeedy}
                                                onChange={handleNeedyChange}
                                                input={<OutlinedInput label="בחר נתמך" />}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 48 * 4.5 + 8,
                                                            width: 250,
                                                        },
                                                    },
                                                }}
                                            >
                                                {needies.map((needy) => (
                                                    <MenuItem
                                                        key={needy.id}
                                                        value={needy.id}
                                                        style={getStyles(needy.name, selectedNeedy)}
                                                    >
                                                        {needy.last_name +
                                                            " " +
                                                            needy.husband_name +
                                                            " " +
                                                            needy.wife_name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </div>
                            <Controller
                                name="notes"
                                control={control}
                                rules={
                                    {
                                        // minLength: { value: 5, message: "התיאור חייב להיות לפחות 5 תווים" },
                                    }
                                }
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="הערות"
                                        variant="outlined"
                                        fullWidth
                                        rows={4}
                                        error={!!errors.notes}
                                        helperText={errors.notes?.message}
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            />
                            <Controller
                                name="amount"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="כמות"
                                        variant="outlined"
                                        type="number"
                                        fullWidth
                                        inputProps={{ min: 0 }}
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
                        <DialogActions>
                            <Button onClick={onClose} color="secondary">
                                ביטול
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </ThemeProvider>
        </CacheProvider >
    );
}
