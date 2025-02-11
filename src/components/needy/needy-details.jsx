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
  Divider,
FormControlLabel,
Checkbox
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
import Swal from "sweetalert2";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ranks from "../../ranks";

export default function NeedyDetails({ onSave, needy ,newNeedy}) {
  const { id } = useParams();
  const {
    handleSubmit,
    control,
    formState: { errors, isValid, touchedFields },
    trigger,
    reset,
    watch,
    getValues,
    setValue,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      husband_name: needy?.husband_name || "",
      id_husband: needy?.id_husband || "",
      last_name: needy?.last_name || "",
      marital_status: needy?.marital_status || "נשוי",
      wife_name: needy?.wife_name || "",
      id_wife: needy?.id_wife || "",
      husband_phone: needy?.husband_phone || "",
      wife_phone: needy?.wife_phone || "",
      phone: needy?.phone || "",
      city: needy?.city || "",
      street: needy?.street || "",
      building_number: needy?.building_number || "",
      apartment_number: needy?.apartment_number || "",
      num_of_children: needy?.children.length || 0,
      num_of_minor_children: needy?.num_of_minor_children || 0,
      num_of_unmarried_children: needy?.num_of_unmarried_children || 0,
      children: needy?.children || [],
      email: needy?.email || "",
      husband_date_of_birth: needy?.husband_date_of_birth || null,
      wife_date_of_birth: needy?.wife_date_of_birth || null,
      level_of_need: needy?.level_of_need || 1,
      total_debt: needy?.total_debt || 0.0,
      one_time_support: needy?.one_time_support || 0,
      reason_for_expense: needy?.reason_for_expense || "",
      status: needy?.status || true,
      gerim: needy?.gerim || false,
    },
  });
  const maritalStatus = watch("marital_status"); // מעקב בזמן אמת אחרי השדה
  const handleSave = async () => {
    if (isValid) {
      // שמירה אם אין שגיאות
      console.log("Data is valid, saving...");
      const updatedData = getValues(); // כל הנתונים בטופס
      const { address, children, ...filteredData } = updatedData; 
      if (newNeedy) {      
        console.log("new",updatedData);
        onSave(updatedData);
      } else {
        needyStore.updateNeedy(id, updatedData).then((res) => {
          if (res == 200) {
            Swal.fire({
              title: "עידכון",
              text: "פרטי הנצרך עודכנו בהצלחה",
              icon: "success",
              timer: 2000,
            });
          } else {
            Swal.fire({
              title: "תקלה",
              text: "תקלה בעת עדכון הנתונים",
              icon: "error",
              timer: 2000,
            });
          }
        });
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

  const ManDetails = () => (
    <>
      <Typography
        variant="h6"
        sx={{ marginBottom: 2, fontWeight: "bold", color: "#333" }}
      >
        {getValues().marital_status == "נשוי" ? "פרטי הבעל" : "פרטי ההורה"}
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
            {renderTextField(
              "last_name",
              "שם משפחה",
              {
                required: "שדה חובה",
                minLength: {
                  value: 2,
                  message: "שם משפחה חייב להכיל לפחות 2 תווים",
                },
              },
              "ltr"
            )}
          </Grid>
          <Grid item xs={6}>
            {renderTextField(
              "husband_name",
              "שם פרטי",
              {
                required: "שדה חובה",
                minLength: {
                  value: 2,
                  message: "שם משפחה חייב להכיל לפחות 2 תווים",
                },
              },
              "ltr"
            )}
          </Grid>
          <Grid item xs={6}>
            {renderTextField(
              "id_husband",
              "ת.ז",
              {
                required: "נא להזין ת.ז",
                pattern: {
                  value: /^\d+$/,
                  message: "ת.ז חייבת להכיל מספרים בלבד",
                },
              },
              "rtl"
            )}
          </Grid>
          <Grid item xs={6}>
            {renderTextField(
              "husband_phone",
              "פלאפון בעל",
              {
                required: "נא להזין פלאפון",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "פלאפון חייב להכיל 10 ספרות",
                },
              },
              "rtl"
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );

  const WhomanDetails = () => {
    return (
      <>
        <Typography
          variant="h6"
          sx={{ marginBottom: 2, fontWeight: "bold", color: "#333" }}
        >
          פרטי האישה
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
              {renderTextField(
                "last_name",
                "שם משפחה",
                {
                  required: "שדה חובה",
                  minLength: {
                    value: 2,
                    message: "שם משפחה חייב להכיל לפחות 2 תווים",
                  },
                },
                "ltr"
              )}
            </Grid>
            <Grid item xs={6}>
              {renderTextField(
                "wife_name",
                "שם פרטי",
                {
                  required: "שדה חובה",
                  minLength: {
                    value: 2,
                    message: "שם פרטי חייב להכיל לפחות 2 תווים",
                  },
                },
                "ltr"
              )}
            </Grid>
            <Grid item xs={6}>
              {renderTextField(
                "id_wife",
                "ת.ז",
                {
                  required: "נא להזין ת.ז",
                  pattern: {
                    value: /^\d+$/,
                    message: "ת.ז חייבת להכיל מספרים בלבד",
                  },
                },
                "rtl"
              )}
            </Grid>
            <Grid item xs={6}>
              {renderTextField(
                "wife_phone",
                "פלאפון אישה",
                {
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "פלאפון חייב להכיל 10 ספרות",
                  },
                },
                "rtl"
              )}
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };

  const AdditionalDetails = () => (
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
            {renderTextField(
              "city",
              "עיר",
              {
                required: "שדה חובה",
                minLength: {
                  value: 2,
                  message: " חייב להכיל לפחות 2 תווים",
                },
              },
              "ltr"
            )}
          </Grid>
          <Grid item xs={6}>
            {renderTextField(
              "street",
              "רחוב",
              {
                required: "שדה חובה",
                minLength: {
                  value: 2,
                  message: "חייב להכיל לפחות 2 תווים",
                },
              },
              "ltr"
            )}
          </Grid>
          <Grid item xs={6}>
            {renderTextField("building_number", "מספר דירה", "rtl")}
          </Grid>
          <Grid item xs={6}>
            {renderTextField("apartment_number", "מספר בית", "rtl")}
          </Grid>
          <Grid item xs={6}>
            {renderTextField("email", "מייל", "rtl")}
          </Grid>
          <Grid item xs={6}>
            {renderTextField("phone", "טלפון", "rtl")}
          </Grid>
          
        </Grid>
      </Box>
    </>
  );

  const FamilyDetails = ({ needy_id }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [childData, setChildData] = useState({
      needy_id: `${needy_id}`||0,
      name: "",
      child_id: "",
      birth_date: "",
      place_of_study: "",
      tuition_amount: 0,
      additional_expenses: 0,
    });

    const handleOpenDialog = () => {
      setOpenDialog(true);
    };

    const handleCloseDialog = () => {
      setOpenDialog(false);
    };
    const handleSaveChild = () => {
      if(newNeedy){
        childData.needy_id=0
      }
      else{
        needyStore.add_child(childData).then((res) => {
        if (res == 200 || res == 201) {
          Swal.fire({
            title: "הוספת ילד-מזל טוב!!",
            text: "הילד נוסף בהצלחה",
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
      }

      const updatedChildren = [...getValues("children"), childData];
      setValue("children", updatedChildren);
      handleCloseDialog();
    };
    return (
      <>
        <Typography
          variant="h6"
          sx={{ marginBottom: 2, fontWeight: "bold", color: "#333" }}
        >
          פרטי ילדים
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
              {renderTextField(
                "num_of_children",
                "מספר ילדים",
                {
                  required: "שדה חובה",
                },
                "rtl"
              )}
            </Grid>
            <Grid item xs={6}>
              {renderTextField(
                "num_of_minor_children",
                "מספר ילדים לא נשואים",
                {
                  required: "שדה חובה",
                },
                "rtl"
              )}
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography>רשימת ילדים:</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List sx={{ width: "100%" }}>
                      {getValues("children")?.map((child, index) => (
                        <React.Fragment key={index}>
                          <ListItem sx={{ display: "flex", flexWrap: "wrap" }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={6} md={4}>
                                <ListItemText primary={`✔️ ${child.name}`} />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <ListItemText
                                  primary={`ת"ז: ${child.child_id}`}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <ListItemText
                                  primary={`תאריך לידה: ${child.birth_date}`}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <ListItemText
                                  primary={`מוסד לימודים: ${child.place_of_study}`}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <ListItemText
                                  primary={`שכר לימוד: ${child.tuition_amount}`}
                                />
                              </Grid>
                              {child.additional_expenses != 0 && (
                                <Grid item xs={12} sm={6} md={4}>
                                  <ListItemText
                                    primary={`הוצאות מיוחדות: ${child.additional_expenses}`}
                                  />
                                </Grid>
                              )}
                            </Grid>
                          </ListItem>
                          {index < getValues("children").length - 1 && (
                            <Divider
                              sx={{
                                marginY: 2,
                                borderWidth: 2,
                                backgroundColor: "#ADD8E6",
                              }}
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              <Grid item xs={4}>
                <Button variant="contained" onClick={handleOpenDialog}>
                  הוספת ילד
                </Button>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogTitle>הוספת ילד</DialogTitle>
                  <DialogContent>
                    <TextField
                      label="שם"
                      value={childData.name}
                      onChange={(e) =>
                        setChildData({ ...childData, name: e.target.value })
                      }
                      fullWidth
                    />
                    <TextField
                      label="תז"
                      value={childData.child_id}
                      onChange={(e) =>
                        setChildData({ ...childData, child_id: e.target.value })
                      }
                      fullWidth
                      sx={{ marginTop: 2 }}
                    />
                    <TextField
                      label="תאריך לידה"
                      type="date"
                      value={childData.birth_date}
                      onChange={(e) =>
                        setChildData((prev) => ({
                          ...prev,
                          birth_date: e.target.value,
                        }))
                      }
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{ marginTop: 2 }}
                    />
                    <TextField
                      label="מוסד לימודים"
                      value={childData.place_of_study}
                      onChange={(e) =>
                        setChildData({
                          ...childData,
                          place_of_study: e.target.value,
                        })
                      }
                      fullWidth
                      sx={{ marginTop: 2 }}
                    />
                    <TextField
                      label="שכר לימוד"
                      value={childData.tuition_amount}
                      type="number"
                      onChange={(e) =>
                        setChildData({
                          ...childData,
                          tuition_amount: e.target.value,
                        })
                      }
                      fullWidth
                      sx={{ marginTop: 2 }}
                    />
                    <TextField
                      label="הוצאות נוספות"
                      value={childData.additional_expenses}
                      onChange={(e) =>
                        setChildData({
                          ...childData,
                          additional_expenses: e.target.value,
                        })
                      }
                      fullWidth
                      sx={{ marginTop: 2 }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog}>סגור</Button>
                    <Button onClick={handleSaveChild} variant="contained">
                      שמירה
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };
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
          <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={6}>
  <Controller
    name="gerim"
    control={control}
    render={({ field }) => (
      <FormControlLabel
        control={<Checkbox {...field} checked={field.value} />}
        label="גרי צדק"
      />
    )}
  />
</Grid>

            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h6">עדכון דרגת נצרך:</Typography>
              <Controller
                name="level_of_need"
                control={control}
                render={({ field }) => (
                  
                  <select
                    {...field}
                    value={needy?.level_of_need}
                    style={{
                      width: "80%",
                      padding: "5px",
                      borderRadius: "5px",
                      margin: "10px",
                    }}
                    onBlur={() => trigger(name)}
                  >
                    {ranks.map((rank, index) => (
                      <option
                        key={index + 1}
                        value={index + 1}
                        style={{ color: `${rank.color}` }}
                      >
                        {rank.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </Grid>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h6">מצב משפחתי:</Typography>
              <Controller
                name="marital_status"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    value={field.value || ""}
                    style={{
                      width: "80%",
                      padding: "5px",
                      borderRadius: "5px",
                      margin: "10px",
                      direction: "rtl",
                    }}
                    onBlur={() => trigger("marital_status")}
                  >
                    <option value="נשוי">נשואים</option>
                    <option value="גרוש">גרוש/ה</option>
                    <option value="פרוד">פרוד/ה</option>
                    <option value="אלמן">אלמן/ה</option>
                  </select>
                )}
              />
            </Grid>

            {maritalStatus == "נשוי" ? (
              <div>
                <ManDetails />
                <WhomanDetails />
              </div>
            ) : (
              <ManDetails />
            )}

            <FamilyDetails needy_id={id} />

            <AdditionalDetails />
            {/* כפתור שליחה */}
            <Grid item xs={12}>
              <Button
                onClick={handleSave}
                // type="submit"
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
