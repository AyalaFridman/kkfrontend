import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Grid, IconButton } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import EditIcon from '@mui/icons-material/Edit';
import allocationStore from "../../store/allocation-store";
import Swal from "sweetalert2";
import Supported_list from "../supported/supported-list";
import { useParams } from "react-router-dom";

export default function AllocationDetails({ }) {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState("")
    const [allocation, setAllocation] = useState();
    // const [projectId, setProjectId] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const { id } = useParams();
    const {projectId} = useParams();

    console.log(projectId);
    
    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    setIsLoading(true);
                    setIsError(false);
                    await allocationStore.getAllocationById(id)
                    setAllocation(allocationStore.currentallocation)
                } catch (error) {
                    setIsError(true);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [id]);


const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
};

const toggleEditMode = () => {
    setEditMode((prev) => !prev); // הפעלת מצב עריכה
};

const theme = createTheme({
    direction: 'rtl',
});

const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
            {/* כאן נמצאים פרטי החלוקה */}
            <CacheProvider value={cacheRtl}>
                <ThemeProvider theme={theme}>
                    <Box
                        component="form"
                        // onSubmit={handleSubmit}
                        sx={{
                            maxWidth: 400,
                            margin: "0 auto",
                            padding: 2,
                            backgroundColor: "#f9f9f9",
                            borderRadius: 2,
                            boxShadow: 1,
                        }}
                    >
                        <Typography variant="h5" sx={{ marginBottom: 2, textAlign: "center" }}>
                            פרטי החלוקה :
                        </Typography>

                        {/* כפתור עריכה */}
                        <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                            <IconButton onClick={toggleEditMode}>
                                <EditIcon />
                            </IconButton>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    variant="standard"
                                    label="סוג החלוקה:"
                                    name="allocation_type"
                                    value={allocation?.allocation_type || ""}
                                    onChange={handleChange}
                                    // onBlur={handleBlur} // על כל שינוי בשדה, נעדכן את הסטטוס של השדה
                                    fullWidth
                                    InputProps={{ readOnly: !editMode }} // אם לא במצב עריכה, השדה יהיה לקריאה בלבד
                                // error={touchedFields.account_owner_name && !!errors.account_owner_name} // הצגת שגיאה רק אחרי ביקור בשדה
                                // helperText={touchedFields.account_owner_name && errors.account_owner_name}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="standard"
                                    label="תיאור:"
                                    name="allocation_method"
                                    value={allocation?.allocation_method || ""}
                                    onChange={handleChange}
                                    // onBlur={handleBlur} // על כל שינוי בשדה, נעדכן את הסטטוס של השדה
                                    fullWidth
                                    InputProps={{ readOnly: !editMode }} // אם לא במצב עריכה, השדה יהיה לקריאה בלבד
                                // error={touchedFields.account_owner_name && !!errors.account_owner_name} // הצגת שגיאה רק אחרי ביקור בשדה
                                // helperText={touchedFields.account_owner_name && errors.account_owner_name}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="standard"
                                    label="כמות לחלוקה:"
                                    name="amount_or_quantity"
                                    value={allocation?.amount_or_quantity || ""}
                                    onChange={handleChange}
                                    // onBlur={handleBlur} // על כל שינוי בשדה, נעדכן את הסטטוס של השדה
                                    fullWidth
                                    InputProps={{ readOnly: !editMode }} // אם לא במצב עריכה, השדה יהיה לקריאה בלבד
                                // error={touchedFields.account_owner_name && !!errors.account_owner_name} // הצגת שגיאה רק אחרי ביקור בשדה
                                // helperText={touchedFields.account_owner_name && errors.account_owner_name}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="standard"
                                    label="חולק:"
                                    name="distributed"
                                    value={allocation?.distributed || 0}
                                    onChange={handleChange}
                                    // onBlur={handleBlur} // על כל שינוי בשדה, נעדכן את הסטטוס של השדה
                                    fullWidth
                                    InputProps={{ readOnly: !editMode }} // אם לא במצב עריכה, השדה יהיה לקריאה בלבד
                                // error={touchedFields.account_owner_name && !!errors.account_owner_name} // הצגת שגיאה רק אחרי ביקור בשדה
                                // helperText={touchedFields.account_owner_name && errors.account_owner_name}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="standard"
                                    label="נותר לחלוקה:"
                                    name="remainingToDistribute"
                                    value={allocation?.amount_or_quantity - allocation?.distributed || ""}
                                    onChange={handleChange}
                                    // onBlur={handleBlur} // על כל שינוי בשדה, נעדכן את הסטטוס של השדה
                                    fullWidth
                                    InputProps={{ readOnly: !editMode }} // אם לא במצב עריכה, השדה יהיה לקריאה בלבד
                                // error={touchedFields.account_owner_name && !!errors.account_owner_name} // הצגת שגיאה רק אחרי ביקור בשדה
                                // helperText={touchedFields.account_owner_name && errors.account_owner_name}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="standard"
                                    label="שם הפרויקט:"
                                    name="project.name"
                                    value={allocation?.project.name || ""}
                                    onChange={handleChange}
                                    // onBlur={handleBlur} // על כל שינוי בשדה, נעדכן את הסטטוס של השדה
                                    fullWidth
                                    InputProps={{ readOnly: !editMode }} // אם לא במצב עריכה, השדה יהיה לקריאה בלבד
                                // error={touchedFields.account_owner_name && !!errors.account_owner_name} // הצגת שגיאה רק אחרי ביקור בשדה
                                // helperText={touchedFields.account_owner_name && errors.account_owner_name}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="standard"
                                    label="שם הקרן:"
                                    name="fund.name"
                                    value={allocation?.fund.name || ""}
                                    onChange={handleChange}
                                    // onBlur={handleBlur} // על כל שינוי בשדה, נעדכן את הסטטוס של השדה
                                    fullWidth
                                    InputProps={{ readOnly: !editMode }} // אם לא במצב עריכה, השדה יהיה לקריאה בלבד
                                // error={touchedFields.account_owner_name && !!errors.account_owner_name} // הצגת שגיאה רק אחרי ביקור בשדה
                                // helperText={touchedFields.account_owner_name && errors.account_owner_name}
                                />
                            </Grid>
                            {/* כפתור שליחה */}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                // disabled={!isFormValid || !editMode} // אם הטופס לא תקין, הכפתור יהיה מנוטרל
                                >
                                    שמור
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </ThemeProvider>
            </CacheProvider>
        </div>

        <div style={{ flex: 1 }}>
            <Supported_list allocation_id={id} project_id={projectId} />
        </div>
    </div>
);

};

