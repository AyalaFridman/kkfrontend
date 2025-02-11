import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  OutlinedInput,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Papa from "papaparse"; // ספרייה לקריאת CSV
import supportedStore from "../../store/supported-store";
import allocationStore from "../../store/allocation-store";
import projectStore from "../../store/project-store";
import needyStore from "../../store/needy-store";

const Upload_csv = ({ open, onClose ,allocations_id,project_id}) => {
  const { control, handleSubmit, reset } = useForm();
  const [allocations, setAllocation] = useState([]);
  const [projects, setProjects] = useState([]);

  const [openAllocation, setOpenAllocation] = React.useState(false);
  const [openProject, setOpenProject] = React.useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [csvData, setCsvData] = useState([]);
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
  const handleAllocationChange = (event) => {
    setSelectedAllocation(event.target.value);
    setOpenAllocation(false);
  };
  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
    setOpenProject(false);
  };
  useEffect(() => {
    const fetchdata = async () => {
      try {
        await allocationStore.fetchAllocationList();
        setAllocation(allocationStore.allocationList);
        await projectStore.fetchProjectList();
        setProjects(projectStore.projectList);
        setLoading(false);
        if (project_id) {
          setSelectedProject([project_id]);
        }
        if (allocations_id) {
          setSelectedAllocation([allocations_id]);
        }
      } catch (error) {
        setLoading(false);
        Swal.fire("שגיאה", "לא ניתן לשמור את התמיכה", "error");
      }
    };
    fetchdata();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log(result);
          setCsvData(result.data);
        },
      });
    }
  };
  const conver_to_object = (data) => {
    data.forEach(async (obj) => {
      const needy = await needyStore.getNeedyByTz(obj["תז"]);
      console.log("n:",needy);
      
      const new_support = {
        needy_id: needy[0].id,
        amount: parseInt(obj["כמות"], 10),
        date: new Date().toISOString().split("T")[0],
        notes: csvData.notes || "",
        allocations_id: selectedAllocation,
      };
      console.log(new_support);
      await supportedStore.addSupported(new_support);
    });
  };

  const onSubmit = (data) => {
    conver_to_object(csvData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>הוספת תמיכות</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <FormControl fullWidth>
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
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="הערות"
                    variant="outlined"
                    fullWidth
                    rows={4}
                    sx={{ mb: 2 }}
                  />
                )}
              />
            </FormControl>

            <Button variant="contained" component="label">
              העלאת קובץ CSV
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleFileUpload}
              />
            </Button>

            {csvData.length > 0 && (
              <Box>
                <strong>נתונים שהועלו:</strong>
                <ul>
                  {csvData.map((row, index) => (
                    <li key={index}>
                      נצרך: {row["תז"]}, כמות: {row["כמות"]}
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ביטול</Button>
          <Button type="submit" variant="contained" color="primary">
            שמירה
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Upload_csv;
