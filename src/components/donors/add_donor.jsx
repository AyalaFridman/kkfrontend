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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import Swal from "sweetalert2";

export default function AddServiceProvider({ open, onClose }) {
  const [isFormValid, setIsFormValid] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    zeout: "",
    name: "",
    city: "",
    address: "",
    phone: "",
    husband_phone: "",
    wife_phone: "",
    mail: "",
    account_num: "",
    bank: "",
    brunch: "",
    source_of_details: "",
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
        await donorStore.addDonor(newData);

        Swal.fire({
          title: "התורם נוסף בהצלחה",
          text: "",
          icon: "success",
          timer: 800,
          showConfirmButton: false,
          timerProgressBar: true,
        }).then(() => {
          // אחרי שההוספה הצליחה, לשאול האם להנפיק קבלה
          console.log(newData);
          
          Swal.fire({
            title: "האם להנפיק קבלה לתורם?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "כן",
            cancelButtonText: "לא",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: `הנפקת קבלה עבור ${newData.name}`,
                html: `
                  <input type="text" id="description" class="swal2-input" placeholder="תיאור על הקבלה">
                  <input type="number" id="payment" class="swal2-input" placeholder="סכום התרומה">
                  <select id="payment_type" class="swal2-input">
                  <option value="1">מזומן</option>
                  <option value="4">העברה בנקאית</option>
                  </select>
                  <input type="text" id="comment" class="swal2-input" placeholder="הערות (לא חובה)">
                  <label>
                    <input type="checkbox" id="send_email"> שלח קבלה למייל
                  </label>
                `,
                showCancelButton: true,
                confirmButtonText: "שלח",
                cancelButtonText: "ביטול",
                preConfirm: () => {
                  const description =
                    document.getElementById("description").value;
                  const payment = document.getElementById("payment").value;
                  const paymentType =
                  document.getElementById("payment_type").value;
                  const comment = document.getElementById("comment").value;
                  const sendEmail = document.getElementById("send_email").checked? 1 : 0;
                  console.log(sendEmail);
                  
                  if (!payment || !description) {
                    Swal.showValidationMessage(
                      "יש להזין סכום תרומה ותיאור קבלה"
                    );
                  }
                  const paymentObj = [
                    {
                      payment_type: parseInt(paymentType),
                      payment_sum: parseInt(payment),
                    },
                  ];

                  if (paymentType == 4) {
                    console.log("in 4");
                    
                    // paymentObj[0].checks_number = parseInt(formData.bank);
                    paymentObj[0].bt_bank_branch = parseInt(newData.brunch);
                    paymentObj[0].bt_bank_account = parseInt(newData.account_num);
                    paymentObj[0].comment = `מספר סניף:${newData.brunch} מספר חשבון:${newData.account_num}`

                  }
                  const recepitData = {
                    description: description,
                    customer_zeout:newData.zeout,
                    customer_name: newData.name,
                    customer_email: newData.mail | "",
                    customer_address: `${newData.city} ${newData.address}`,
                    payment: paymentObj,
                    price_total: parseInt(payment),
                    comment: comment,
                    send_email: sendEmail,
                  };
                  return recepitData;
                },
              }).then((receiptResult) => {
                if (receiptResult.isConfirmed) {
                  donorStore
                    .IssuingAReceipt(receiptResult.value)
                    .then((res) => {
                      console.log(res);

                      Swal.fire({
                        title: "קבלה נשלחה בהצלחה",
                        html: `<a href="${res}" target="_blank" style="color: blue; text-decoration: underline;">לחץ כאן לצפייה בקבלה</a>`,
                        icon: "success",
                      }).then(() => navigate("/donors"));
                    });
                }
              });
            } else {
              navigate("/donors");
            }
          });
        });

        if (!open) {
          setTimeout(() => navigate("/donors"), 800);
        } else {
          onClose(true, dataWithId);
        }
      } catch (error) {
        console.log(error);

        Swal.fire({
          title: "שגיאה בהוספת התורם",
          text: error.message || "לא ניתן לשמור את התורם.",
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
          <DialogTitle>הוספת תורם</DialogTitle>
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
                  {renderTextField("zeout", "ת.ז")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("name", ":שם", {
                    required: "שדה חובה",
                  })}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("city", "עיר")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("address", "כתובת")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("phone", "טלפון")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("husband_phone", "פאלפון בעל:")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("wife_phone", "פאלפון אישה:")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("mail", "מייל:")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("account_num", "מספר חשבון:")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("brunch", "מספר סניף:")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("bank", "מספר בנק:")}
                </Grid>
                <Grid item xs={6}>
                  {renderTextField("source_of_detials", "מקור התרומה:")}
                </Grid>

                {/* כפתור שליחה */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!isValid}
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
