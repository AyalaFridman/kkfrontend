import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Grid, IconButton } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import EditIcon from '@mui/icons-material/Edit';
import needyStore from "../../store/needy-store";
import Swal from "sweetalert2";


export default function BankDetails({ account, newNeedy, onSave }) {
    const [formData, setFormData] = useState("")

    useEffect(() => {
        if (account) {
            setFormData({
                account_owner_name: account.account_owner_name || "",
                account_number: account.account_number || "",
                branch_number: account.branch_number || "",
                bank_number: account.bank_number || "",
            });
        }
    }, [account]);

    const [errors, setErrors] = useState({}); // שדות השגיאה
    const [isFormValid, setIsFormValid] = useState(true); // מצב אם הטופס תקין
    const [touchedFields, setTouchedFields] = useState({}); // לעקוב אחרי השדות שביקרו בהם

    // פונקציה לבדוק תקינות של שדה
    const validate = () => {
        let valid = true;
        let newErrors = {};

        // בדיקת שם בעל החשבון
        if (!formData.account_owner_name) {
            newErrors.account_owner_name = "שם בעל החשבון חובה!";
            valid = false;
        }

        // בדיקת מספר חשבון
        if (!formData.account_number) {
            newErrors.account_number = "מספר חשבון חובה!";
            valid = false;
        } else if (!/^\d+$/.test(formData.account_number)) {
            newErrors.account_number = "מספר חשבון חייב להיות מספר!";
            valid = false;
        }

        // בדיקת מספר סניף
        if (!formData.branch_number) {
            newErrors.branch_number = "מספר סניף חובה!";
            valid = false;
        } else if (!/^\d+$/.test(formData.branch_number)) {
            newErrors.branch_number = "מספר סניף חייב להיות מספר!";
            valid = false;
        }

        // בדיקת מספר בנק
        if (!formData.bank_number) {
            newErrors.bank_number = "מספר בנק חובה!";
            valid = false;
        } else if (!/^\d+$/.test(formData.bank_number)) {
            newErrors.bank_number = "מספר בנק חייב להיות מספר!";
            valid = false;
        }

        // עדכון השגיאות
        setErrors(newErrors);
        setIsFormValid(valid); // מעדכנים את המצב של התקינות של הטופס
        return valid;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBlur = (event) => {
        const { name } = event.target;
        // עדכון שאכן ביקרנו בשדה
        setTouchedFields((prev) => ({
            ...prev,
            [name]: true,
        }));
        validate(); // כל פעם שמשתמש עובר שדה, נבצע את הבדיקות
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
            console.log("Submitted Data:", formData)
            console.log(formData);

            if (newNeedy) {
                onSave(formData)
            }
            else{
                needyStore.updateBankDetial(account.id, formData).then((res) => {
                    if (res == 200) {
                        Swal.fire({
                            title: "עידכון",
                            text: "פרטי הבנק עודכנו בהצלחה",
                            icon: "success",
                        });
                    }
                    else {
                        Swal.fire({
                            title: "תקלה",
                            text: "תקלה בעת עדכון הנתונים",
                            icon: "error",
                        });
                    }
                })
                account = formData
            }
        }
    };
    const theme = createTheme({
        direction: 'rtl',
    });

    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
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
                        פרטי חשבון בנק:
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                variant="standard"
                                label="שם בעל החשבון:"
                                name="account_owner_name"
                                value={formData.account_owner_name}
                                onChange={handleChange}
                                onBlur={handleBlur} // על כל שינוי בשדה, נעדכן את הסטטוס של השדה
                                fullWidth
                                error={touchedFields.account_owner_name && !!errors.account_owner_name} // הצגת שגיאה רק אחרי ביקור בשדה
                                helperText={touchedFields.account_owner_name && errors.account_owner_name}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                variant="standard"
                                label="מספר חשבון:"
                                name="account_number"
                                value={formData.account_number}
                                onChange={handleChange}
                                onBlur={handleBlur} // על כל שינוי בשדה, נעדכן את הסטטוס של השדה
                                fullWidth
                                error={touchedFields.account_number && !!errors.account_number} // הצגת שגיאה רק אחרי ביקור בשדה
                                helperText={touchedFields.account_number && errors.account_number}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                variant="standard"
                                label="מספר סניף:"
                                name="branch_number"
                                value={formData.branch_number}
                                onChange={handleChange}
                                onBlur={handleBlur} // על כל שינוי בשדה, נעדכן את הסטטוס של השדה
                                fullWidth
                                error={touchedFields.branch_number && !!errors.branch_number} // הצגת שגיאה רק אחרי ביקור בשדה
                                helperText={touchedFields.branch_number && errors.branch_number}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                variant="standard"
                                label="מספר בנק:"
                                name="bank_number"
                                value={formData.bank_number}
                                onChange={handleChange}
                                onBlur={handleBlur} // על כל שינוי בשדה, נעדכן את הסטטוס של השדה
                                fullWidth
                                error={touchedFields.bank_number && !!errors.bank_number} // הצגת שגיאה רק אחרי ביקור בשדה
                                helperText={touchedFields.bank_number && errors.bank_number}
                            />
                        </Grid>

                        {/* כפתור שליחה */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={!isFormValid} // אם הטופס לא תקין, הכפתור יהיה מנוטרל
                            >
                                שמור
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
        </CacheProvider>
    );

};

