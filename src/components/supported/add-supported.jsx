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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  Checkbox,
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
import supportedStore from "../../store/supported-store";
import allocationStore from "../../store/allocation-store";
import projectStore from "../../store/project-store";
import Swal from "sweetalert2";
import ranks from "../../ranks";
export default function Add_supported({
  open,
  onClose,
  needy_id,
  allocations_id,
  project_id,
}) {
  const [needies, setNeedies] = useState([]);
  const [allocations, setAllocation] = useState([]);
  const [projects, setProjects] = useState([]);

  const [openNeedy, setOpenNeedy] = React.useState(false);
  const [openAllocation, setOpenAllocation] = React.useState(false);
  const [openLevel, setOpenLevel] = React.useState(false);
  const [openProject, setOpenProject] = React.useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState([]);
  const [selectedNeedy, setSelectedNeedy] = useState([]);
  const [selectedNeedyDetial, setselectedNeedyDetial] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState();
  const handleCloseNeedy = () => {
    setOpenNeedy(false);
  };

  const handleOpenNeedy = () => {
    setOpenNeedy(true);
  };
  const handleCloseAllocation = () => {
    setOpenAllocation(false);
  };

  const handleOpenAllocation = () => {
    setOpenAllocation(true);
  };
  const handleCloseProject = () => {
    setOpenProject(false);
  };
  const handleOpenProject = () => {
    setOpenProject(true);
  };
  const handleCloseLevel = () => {
    setOpenLevel(false);
  };
  const handleOpenLevel = () => {
    setOpenLevel(true);
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
        console.log(needyStore.needyList[0]);

        await allocationStore.fetchAllocationList();
        setAllocation(allocationStore.allocationList);
        await projectStore.fetchProjectList();
        setProjects(projectStore.projectList);
        setLoading(false);
        if (needy_id) {
          setSelectedNeedy([needy_id]);
          const n=needyStore.needyList.find(
            (needy) => needy.id == needy_id
          )
          setselectedNeedyDetial(n)
        }
        if (project_id) {
          setSelectedProject([project_id]);
        }
        if (allocations_id) {
          setSelectedAllocation([allocations_id]);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        
        Swal.fire("שגיאה", "לא ניתן לשמור את התמיכה", "error");
      }
    };
    fetchdata();
  }, [needy_id]);
  const handleSave = async (data) => {
    const isValid = await trigger();
    let newSupports=[];
    if (isValid) {
      const filteredNeedies = needies.filter((needy) =>
        selectedLevel.includes(needy.level_of_need)
      );
      if (needy_id) {
        newSupports = [{
          needy_id: needy_id,
          amount: parseFloat(data.amount), // סכום התמיכה
          date: new Date().toISOString().split("T")[0], // תאריך התמיכה
          notes: data.notes || "No notes provided", // הערות
          allocations_id: selectedAllocation, // הקצאה שנבחרה
        }]
      } else {
        // יצירת אובייקטי תמיכה עבור הנתמכים שנבחרו בשדה "נתמך מסוים"
        const supportsForSelectedNeedies = selectedNeedy.map((needyId) => ({
          needy_id: needyId, // נתמך שנבחר
          amount: parseFloat(data.amount), // סכום התמיכה
          date: new Date().toISOString().split("T")[0], // תאריך התמיכה
          notes: data.notes || "No notes provided", // הערות
          allocations_id: selectedAllocation, // הקצאה שנבחרה
        }));

        // יצירת אובייקטי תמיכה עבור הנתמכים שדורגו לפי דרגת הנצרך
        const supportsByLevel = filteredNeedies.map((needy) => ({
          needy_id: needy.id, // נתמך מתאים לדרגת הנצרך
          amount: parseFloat(data.amount), // סכום התמיכה
          date: new Date().toISOString().split("T")[0], // תאריך התמיכה
          notes: data.notes || "No notes provided", // הערות
          allocations_id: selectedAllocation,
        }));

        // שילוב התמיכות מכל המקורות
        newSupports = [...supportsForSelectedNeedies, ...supportsByLevel];
        console.log("newSupports: ", newSupports);
      }

      try {
        // הוספת התמיכות החדשות לסטור
        await Promise.all(
          newSupports.map((support) => supportedStore.addSupported(support))
        );
        console.log("הכל בסדר");
        onClose(true);
        Swal.fire({
          title: "התמכות נוספו בהצלחה",
          icon: "success",
          timer: 800,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      } catch (error) {
        Swal.fire({
          title: "שגיאה בהוספת התמיכות",
          text: error.message || "לא ניתן לשמור את התמיכות.",
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
  const handleNeedyChange = (event) => {
    setSelectedNeedy(event.target.value);
    setOpenNeedy(false);
  };

  const handleAllocationChange = (event) => {
    setSelectedAllocation(event.target.value);
    setOpenAllocation(false);
  };
  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
    setOpenProject(false);
  };
  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
    setOpenLevel(false);
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
        <DialogTitle>
  {needy_id&&selectedNeedyDetial?
    `הוספת תמיכה ל: ${selectedNeedyDetial.last_name} ${selectedNeedyDetial.husband_name} ${selectedNeedyDetial.wife_name}`
    : "הוספת תמיכה"}
</DialogTitle>   
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
                  name="projects"
                  control={control}
                  render={({ field }) => (
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="project-label">בחר פרויקט</InputLabel>
                      <Select
                        {...field}
                        labelId="project-label"
                        id="project-select"
                        open={openProject}
                        onClose={handleCloseProject}
                        onOpen={handleOpenProject}
                        value={selectedProject}
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
                          <MenuItem key={project.id} value={project.id}>
                            {project.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="allocation"
                  control={control}
                  render={({ field }) => (
                    <FormControl sx={{ m: 1, width: 300 }}>
                      <InputLabel id="allocation-label">בחר חלוקה</InputLabel>
                      <Select
                        {...field}
                        labelId="allocation-label"
                        id="allocation-select"
                        open={openAllocation}
                        onClose={handleCloseAllocation}
                        onOpen={handleOpenAllocation}
                        value={selectedAllocation}
                        onChange={handleAllocationChange}
                        input={<OutlinedInput label="בחר חלוקה" />}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 48 * 4.5 + 8,
                              width: 250,
                            },
                          },
                        }}
                      >
                        {allocations
                          .filter((allocation) =>
                            selectedProject != ""
                              ? allocation.project_id == selectedProject
                              : true
                          )
                          .map((allocation) => (
                            <MenuItem key={allocation.id} value={allocation.id}>
                              {allocation.allocation_type +
                                " " +
                                allocation.allocation_method}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                />
                {!needy_id && (
                  <Controller
                    name="needy"
                    control={control}
                    render={({ field }) => (
                      <FormControl sx={{ m: 1, width: 300 }}>
                        <Autocomplete
                          {...field}
                          multiple
                          options={needies}
                          getOptionLabel={(option) =>
                            `${option.last_name} ${option.husband_name} ${option.wife_name}`
                          }
                          onChange={(event, newValue) => {
                            setSelectedNeedy(newValue.map((item) => item.id));
                            field.onChange(newValue.map((item) => item.id));
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox
                                checked={selected}
                                style={{ marginRight: 8 }}
                              />
                              {`${option.last_name} ${option.husband_name} ${option.wife_name}`}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="בחר נתמכים"
                              variant="outlined"
                            />
                          )}
                        />
                      </FormControl>
                    )}
                  />
                )}

                {!needy_id && (
                  <Controller
                    name="needies_from_level"
                    control={control}
                    render={({ field }) => (
                      <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="project-label">
                          בחר דרגת נתמכים
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="level-label"
                          id="level-select"
                          multiple
                          open={openLevel}
                          onClose={handleCloseLevel}
                          onOpen={handleOpenLevel}
                          value={selectedLevel}
                          onChange={handleLevelChange}
                          input={<OutlinedInput label="בחר דרגת נצרך" />}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 48 * 4.5 + 8,
                                width: 250,
                              },
                            },
                          }}
                        >
                          {ranks.map((rank) => (
                            <MenuItem key={rank.level} value={rank.level}>
                              {rank.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                )}
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
            {/* כפתורי פעולה */}
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
