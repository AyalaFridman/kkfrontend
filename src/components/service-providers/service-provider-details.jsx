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
  Popover,
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
import { useSaveData } from "../bank-file/file_context";
import paymentStore from "../../store/payments-store"
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function ServiceProviderDetails({ onSave }) {
  const [editMode, setEditMode] = useState(false);
  const { id } = useParams();
  const [isFormValid, setIsFormValid] = useState(true);
  const [data, setData] = useState(null);
  const [serviceProvider, setServiceProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { saveData } = useSaveData();
  const [amount, setAmount] = useState("");


  const [formData, setFormData] = useState();
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
    defaultValues: {
      name: serviceProvider?.name || "",
      phone: serviceProvider?.phone || "",
      type_of_service: serviceProvider?.type_of_service || "",
      provider_type: serviceProvider?.provider_type || "",
      address:
        {
          city: serviceProvider?.city || "",
          street: serviceProvider?.street || "",
          building_number: serviceProvider?.building_number || "",
          aprtment_number: serviceProvider?.aprtment_number || "",
        } || "",
      email: serviceProvider?.email || "",
      account_owner_name: serviceProvider?.account_owner_name || "",
      account_number: serviceProvider?.account_number || "",
      bank_number: serviceProvider?.bank_number || "",
      branch_number: serviceProvider?.branch_number || "",
      special_supports: serviceProvider?.special_supports || [],
      cashbox: serviceProvider?.cashbox || [],
      payments : serviceProvider?.payments || []
    },
  });
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          setIsError(false);
          await serviceProviderStore.getServiceProviderById(id);
          setServiceProvider(serviceProviderStore.currentServiceProvider[0]);
        } catch (error) {
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (serviceProvider) {
      Object.entries(serviceProvider).forEach(([key, value]) => {
        setValue(key, value || "", { shouldValidate: true });
      });

    }
  }, [serviceProvider, reset]);

  const handleSave = async () => {
    const isValid = await trigger(); // יבדוק את כל השדות
    if (isValid) {
      // שמירה אם אין שגיאות
      console.log("Data is valid, saving...");
      const updatedData = getValues(); // כל הנתונים בטופס
      const { address, children, ...filteredData } = updatedData;
      console.log(updatedData);

      needyStore.updateNeedy(id, updatedData).then((res) => {
        if (res == 200) {
          Swal.fire({
            title: "עידכון",
            text: "פרטי הנותן שירות עודכנו בהצלחה",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "תקלה",
            text: "תקלה בעת עדכון הנתונים",
            icon: "error",
          });
        }
      });
    } else {
      console.log("There are errors in the form.");
    }
  };

  const handleOpenAmountPopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAmountPopup = () => {
    setAnchorEl(null);
  };

  const handleSaveBankTransfer = () => {
    if (amount.trim() !== "") {
      addBankTransfer(amount);
      const new_payment = {
        date : formatDate(Date()),
        amount : amount,
        payment_method : "העברה בנקאית",
        service_provider_id : serviceProvider?.id
      }
      paymentStore.addPayment(new_payment)
    }
    handleCloseAmountPopup();
  };

  const addBankTransfer = (amount) => {
    const account_details = {
      account_owner_name: serviceProvider?.account_owner_name,
      bank_number: serviceProvider?.bank_number,
      branch_number: serviceProvider?.branch_number,
      account_number: serviceProvider?.account_number,
      amount: amount
    }
    saveData(account_details)
  };

  const handleSavePayment = () => {
    if (amount.trim() !== "") {
      const new_payment = {
        date : formatDate(Date()),
        amount : amount,
        payment_method : "שיק",
        service_provider_id : serviceProvider?.id
      }
      paymentStore.addPayment(new_payment)
    }
    handleCloseAmountPopup();
  }

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // כי חודשים מתחילים מ-0
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
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
          InputProps={{ readOnly: !editMode }}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          sx={{ direction }}
          onBlur={() => trigger(name)}
        />
      )}
    />
  );

  const navigate = useNavigate();

  const [isSaved, setIsSaved] = useState(false);

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

  const providerTypesMap = {
    needy: "נתמך",
    fund: "קופה",
  };
  const AddressDetails = () => (
    <>
      <Typography
        variant="h6"
        sx={{ marginBottom: 2, fontWeight: "bold", color: "#333" }}
      >
        פרטי כתובת
      </Typography>
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          padding: 2,
          marginBottom: 2,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant="standard"
              label="עיר"
              name="address.city"
              fullWidth
              value={serviceProvider?.city || ""}
              onChange={handleChange}
              InputProps={{ readOnly: !editMode }}
              error={touchedFields.address?.city && !!errors.address?.city}
              helperText={touchedFields.address?.city && errors.address?.city}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="standard"
              label="רחוב"
              name="address.street"
              fullWidth
              value={serviceProvider?.street || ""}
              onChange={handleChange}
              InputProps={{ readOnly: !editMode }}
              error={touchedFields.address?.street && !!errors.address?.street}
              helperText={touchedFields.address?.street && errors.address?.street}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="standard"
              label="מספר בנין"
              name="address.building_number"
              fullWidth
              value={serviceProvider?.building_number || ""}
              onChange={handleChange}
              InputProps={{ readOnly: !editMode }}
              error={touchedFields.address?.building_number && !!errors.address?.building_number}
              helperText={touchedFields.address?.building_number && errors.address?.building_number}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="standard"
              label="מספר דירה"
              name="address.aprtment_number"
              fullWidth
              value={serviceProvider?.apartment_number || ""}
              onChange={handleChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
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
            direction: "ltr",
          }}
        >
          <Box display="flex" justifyContent="flex-end" marginBottom={2}>
            <IconButton onClick={() => setEditMode(!editMode)}>
              <EditIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="standard"
                label=":שם"
                name="name"
                value={serviceProvider?.name || ""}
                onChange={handleChange}
                fullWidth
                InputProps={{ readOnly: !editMode }}
                error={touchedFields.name && !!errors.name}
                helperText={touchedFields.name && errors.name}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="standard"
                label=":טלפון"
                name="phone"
                value={serviceProvider?.phone || ""}
                onChange={handleChange}
                fullWidth
                InputProps={{ readOnly: !editMode }}
                error={touchedFields.phone && !!errors.phone}
                helperText={touchedFields.phone && errors.phone}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="standard"
                label=":מייל"
                name="email"
                value={serviceProvider?.email || ""}
                onChange={handleChange}
                fullWidth
                InputProps={{ readOnly: !editMode }}
                error={touchedFields.email && !!errors.email}
                helperText={touchedFields.email && errors.email}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="standard"
                label=":סוג שירות"
                name="type_of_service"
                value={serviceProvider?.type_of_service || ""}
                onChange={handleChange}
                fullWidth
                InputProps={{ readOnly: !editMode }}
                error={
                  touchedFields.type_of_service && !!errors.type_of_service
                }
                helperText={
                  touchedFields.type_of_service && errors.type_of_service
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="standard"
                label=":מקבל השירות"
                name="provider_type"
                value={
                  providerTypesMap[serviceProvider?.provider_type] || "לא ידוע"
                }
                // value={(providerTypesMap[serviceProvider?.provider_type] || []).join(", ")}
                onChange={(e) => {
                  const reverseMapping = Object.entries(providerTypesMap).find(
                    ([key, value]) => value === e.target.value
                  );
                  setFormData((prev) => ({
                    ...prev,
                    provider_type: reverseMapping ? reverseMapping[0] : "",
                  }));
                }}
                fullWidth
                InputProps={{ readOnly: !editMode }}
                error={touchedFields.provider_type && !!errors.provider_type}
                helperText={touchedFields.provider_type && errors.provider_type}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="standard"
                label="שם בעל החשבון:"
                name="account_owner_name"
                value={serviceProvider?.account_owner_name || ""}
                onChange={handleChange}
                fullWidth
                InputProps={{ readOnly: !editMode }}
                error={
                  touchedFields.account_owner_name &&
                  !!errors.account_owner_name
                }
                helperText={
                  touchedFields.account_owner_name && errors.account_owner_name
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="standard"
                label="מספר חשבון:"
                name="account_number"
                value={serviceProvider?.account_number || ""}
                onChange={handleChange}
                fullWidth
                InputProps={{ readOnly: !editMode }}
                error={touchedFields.account_number && !!errors.account_number}
                helperText={
                  touchedFields.account_number && errors.account_number
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="standard"
                label="מספר סניף:"
                name="branch_number"
                value={serviceProvider?.branch_number || ""}
                onChange={handleChange}
                fullWidth
                InputProps={{ readOnly: !editMode }}
                error={touchedFields.branch_number && !!errors.branch_number}
                helperText={touchedFields.branch_number && errors.branch_number}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="standard"
                label="מספר בנק:"
                name="bank_number"
                value={serviceProvider?.bank_number || ""}
                onChange={handleChange}
                fullWidth
                InputProps={{ readOnly: !editMode }}
                error={touchedFields.bank_number && !!errors.bank_number}
                helperText={touchedFields.bank_number && errors.bank_number}
              />
            </Grid>
            <Grid item xs={3}>
              <Button variant="outlined"
                style={{
                  fontSize: "12px",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
                // onClick={() => addBankTransfer(data)}
                onClick={handleOpenAmountPopup}
              >הוסף העברה בנקאית
              </Button>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCloseAmountPopup}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Typography>הזן סכום להעברה</Typography>
                  <TextField
                    label="סכום"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    fullWidth
                  />
                  <Button variant="contained" onClick={handleSaveBankTransfer}>
                    שמור
                  </Button>
                </div>
              </Popover>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="outlined"
                style={{
                  fontSize: "12px",
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
                onClick={handleOpenAmountPopup}
              >
                הוסף תשלום בשיק
              </Button>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCloseAmountPopup}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Typography>הזן סכום לתשלום</Typography>
                  <TextField
                    label="סכום"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    fullWidth
                  />
                  <Button variant="contained" onClick={handleSavePayment}>
                    שמור
                  </Button>
                </div>
              </Popover>
            </Grid>
            <AddressDetails />
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDownwardIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography>רשימת נתמכים:</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List sx={{ width: "100%" }}>
                    {getValues("special_supports")?.map((support, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`✔️ ${support.needy.last_name} ${support.needy.husband_name} ${support.needy.wife_name}`}
                        />
                        <ListItemText
                          primary={` סכום: ${support.amount} ש"ח`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDownwardIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography>רשימת תשלומים:</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List sx={{ width: "100%" }}>
                    {getValues("payments")?.map((payment, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`✔️ ${payment.date} ${payment.amount} ש"ח ${payment.payment_method}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDownwardIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Typography>רשימת שירותים לקופה:</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List sx={{ width: "100%" }}>
                    {getValues("cashbox")?.map((cashbox, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={`✔️ ${cashbox.name} `} />
                        <ListItemText
                          primary={` סכום: ${cashbox.balance} ש"ח`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
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
      </ThemeProvider>
    </CacheProvider>
  );
}
