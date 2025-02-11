import React, { useEffect, useState } from "react";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// MobX
import { observer } from "mobx-react";
import ProjectStore from "../../store/project-store";
// mui
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import InfoIcon from "@mui/icons-material/Info";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Popover, Button, Tooltip } from "@mui/material";
import { useParams } from "react-router-dom";
// 
import localeText from "../needy/localeText";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import projectStore from "../../store/project-store";

const Project_Details = observer(() => {
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const { id } = useParams();


    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);


    useEffect(() => {
        projectStore.getProjectAllocations(id)
            .then(() => {
                console.log(projectStore.currentProject);
                console.log("allocations", ProjectStore.currentProjectAllocations)
                // ברגע שהנתונים טוענים, נעדכן את הטופס
                // reset(projectStore.currentProject); // reset את הטופס עם הנתונים
            })
            .catch((error) => {
                console.error("Error loading needy data:", error);
            });

    }, [id, navigate]);

    // Handle loading or error
    if (ProjectStore.isLoading) {
        return <div>טוען...</div>;
    }

    if (ProjectStore.isError) {
        return <div>שגיאה: {ProjectStore.errorMessage}</div>;
    }


    const columns = [
        
        { field: "id", headerName: " ", width: 80, sortable: false },
        // {
        //     field: "Name",
        //     headerName: "פרוייקט",
        //     width: 140,
        //     renderCell: (params) => (
        //         <Link to={`/NeedyDetails/${params.row.id}`} underline="hover" color="inherit">
        //             {`${params.row.last_name || ""} ${params.row.husband_name || ""} ${params.row.wife_name || ""}`}
        //         </Link>
        //     )
        // },

        { field: "allocation_type", headerName: "סוג החלוקה", width: 140 },
        { field: "allocation_method", headerName: "באמצעות", width: 140 },
        { field: "additional", headerName: "פרטים נוספים" }
        // { field: "created-date", headerName: "תאריך יצירה", width: 140 },

    ];

    const paginationModel = { page: 0, pageSize: 5 };

    const theme = createTheme({
        direction: "rtl",
    });

    const cacheRtl = createCache({
        key: "muirtl",
        stylisPlugins: [prefixer, rtlPlugin],
    });

    const handleDelete = () => {
        Swal.fire({
            title: "?האם אתה בטוח שאתה למחוק",
            text: "!לא תוכל לשחזר את החומר",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "!כן, מחק",
            cancelButtonText: "לא, בטל",
        }).then((result) => {
            if (result.isConfirmed) {
                const selectedIds = [...selectedRows];
                console.log("IDs to delete:", selectedIds);
                Swal.fire({
                    title: "נמחק",
                    text: " פרוייקטים אלו נמחקו",
                    icon: "success",
                });
            }
        });
    };

    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <div
                    dir="rtl"
                    style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <h1>
                        <ContactsRoundedIcon />  חלוקות תחת הפרויקט
                    </h1>
                    <Tooltip title="פרוייקט חדש" arrow>
                        <Button
                            style={{
                                width: "auto",
                                alignSelf: "flex-start",
                                marginBottom: "10px",
                            }}
                            onClick={() => navigate("/newNeedy")}
                        >
                            <PersonAddIcon />
                        </Button>
                    </Tooltip>
                    <div style={{ display: "flex", gap: "10px", alignSelf: "flex-end" }}>
                        <Tooltip title="מחיקת פרוייקטים" arrow>
                            <Button style={{ width: "auto" }} onClick={handleDelete}>
                                <DeleteIcon />
                            </Button>
                        </Tooltip>
                    </div>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                        }}
                    >
                    </Popover>
                    <DataGrid
                        rows={ProjectStore.currentProjectAllocations}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        checkboxSelection
                        onRowSelectionModelChange={(newSelection) => {
                            setSelectedRows(newSelection);
                        }}
                        sx={{ border: 0 }}
                        localeText={localeText}
                    />
                </div>
            </ThemeProvider>
        </CacheProvider>
    );
});

export default Project_Details;
