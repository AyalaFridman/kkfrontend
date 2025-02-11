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
  Dialog, DialogActions, DialogContent, DialogTitle,
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
import serviceProviderStore from "../../store/service-provider-store";
import Swal from "sweetalert2";



export default function AddServiceProvider({ open, onClose }) {
  const [isFormValid, setIsFormValid] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type_of_service: "",
    provider_type: "",
    email: "",
    account_owner_name: "",
    account_number: "",
    bank_number: "",
    branch_number: "",
  });

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
    defaultValues: formData,
  });

  const handleSave = async () => {
    const isValid = await trigger(); // יבדוק את כל השדות
    if (isValid) {
      try {
        const newData = getValues();
        await serviceProviderStore.createServiceProvider(newData);
        Swal.fire({
          title: "נותן השירות נוסף בהצלחה",
          text: "",
          icon: "success",
          timer: 800,
          showConfirmButton: false, // לא להציג כפתור אוקי
          timerProgressBar: true
        });
        if (!open) {
          setTimeout(() => navigate("/ServiceProviders"), 800);
        }
        else{
          onClose(true, dataWithId);
        }
      } catch (error) {
        Swal.fire({
          title: "שגיאה בהוספת הפרויקט",
          text: error.message || "לא ניתן לשמור את הפרויקט.",
          icon: "error",
          showConfirmButton: true,
        });
        onClose(false);
      }
    } else {
      console.log("There are errors in the form.");
    }
  };
  const renderTextField = (
    name,
    label,
    validationRules = {},
    direction = "rtl"
  ) => (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field }) => (
        <TextField
          {...field}
          variant="standard"
          label={label}
          fullWidth
          error={!!errors[name]}
          helperText={errors[name]?.message}
          sx={{ direction }}
          onBlur={() => trigger(name)}
        />
      )}
    />
  );
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
          <DialogTitle>הוספת נותן שירות</DialogTitle>
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
                direction: "ltr",
              }}
            >
               <Grid container spacing={2}>
                {/* שדות טופס */}
                <Grid item xs={6}>
                  {renderTextField("name", ":שם")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("phone", ":טלפון")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("email", ":מייל")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("type_of_service", ":סוג שירות")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("provider_type", ":מקבל השירות")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("account_owner_name", "שם בעל החשבון:")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("account_number", "מספר חשבון:")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("branch_number", "מספר סניף:")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("bank_number", "מספר בנק:")}
                </Grid>

                {/* כפתור שליחה */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!isValid} // כפתור שמור יהיה כבוי אם יש שגיאות
                  >
                    שמור
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <DialogActions>
              <Button onClick={onClose} color="secondary">
                ביטול
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </CacheProvider>
  );
}