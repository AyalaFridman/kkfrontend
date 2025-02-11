import React, { useEffect, useState, useRef } from "react";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// MobX
import { observer } from "mobx-react";
// mui
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Popover, Button, Tooltip, Fab } from "@mui/material";
import localeText from "../needy/localeText";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import fundStore from "../../store/fund-store";

const EditableCell = ({ value, onChange }) => {
    const inputRef = useRef(null);

    const handleKeyPress = (event) => {
        if (event.key === " " && inputRef.current) {
            event.preventDefault();  // מונע את עיבוד הרווח
            const newValue = value + " ";  // מוסיף רווח ידנית
            onChange(newValue);
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();  // מוודא שהפוקוס נשמר
        }
    }, [value]);

    return (
        <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyPress}  // מאזין למקש רווח
        />
    );
};

const Fund_list = observer(() => {
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [editingRow, setEditingRow] = useState(null);  // שורה ערוכה
    const [editedData, setEditedData] = useState({});  // נתוני השורה לעריכה

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "color-ranges-popover" : undefined;

    // Fetch data from MobX store
    useEffect(() => {
        fundStore.fetchFundList(); // שליפת נתונים מה-store
    }, []);

    // Handle loading or error
    if (fundStore.isLoading) {
        return <div>טוען...</div>;
    }

    if (fundStore.isError) {
        return <div>שגיאה: {fundStore.errorMessage}</div>;
    }

    // const columns = [
    //     { field: "id", headerName: " ", width: 80, sortable: false },
    //     {
    //         field: "Name",
    //         headerName: "קרן",
    //         width: 140,
    //         renderCell: (params) =>
    //             editingRow === params.row.id ? (
    //                 <EditableCell
    //                     value={editedData.name || params.row.name}
    //                     onChange={(value) => setEditedData({ ...editedData, name: value })}
    //                 />
    //             ) : (
    //                 <Link to={`/allocations/fund/${params.row.id}`} underline="hover" color="inherit">
    //                     {`${params.row.name || ""}`}
    //                 </Link>
    //             ),
    //         valueGetter:(value,row)=>{
    //                 return row?.name || "";
    //             }
    //     },
    //     {
    //         field: "description",
    //         headerName: "תיאור",
    //         width: 140,
    //         renderCell: (params) => (
    //             editingRow === params.row.id ? (
    //                 <EditableCell
    //                     value={editedData.description || params.row.description}
    //                     onChange={(value) => setEditedData({ ...editedData, description: value })}
    //                 />
    //             ) : (
    //                 params.row.description
    //             )
    //         ),
    //     },
    // {field:"contact_name",headerName:"שם איש קשר",width:140},
    // {field:"phone",headerName:"פלאפון",width:140},
    // {field:"mail",headerName:"מייל",width:160},

    //     // { field: "created-date", headerName: "תאריך יצירה", width: 140 },
    //     {
    //         field: "edit",
    //         headerName: "עריכה",
    //         minWidth: 150,
    //         flex: 1,
    //         renderCell: (params) => (
    //             editingRow === params.row.id ? (
    //                 <>
    //                     <Button onClick={handleSaveClick} color="primary">
    //                         שמור
    //                     </Button>
    //                     <Button onClick={handleCancelClick} color="secondary">
    //                         ביטול
    //                     </Button>
    //                 </>
    //             ) : (
    //                 <Button onClick={() => handleEditClick(params.row)} color="primary">
    //                     <EditIcon />
    //                 </Button>
    //             )
    //         ),
    //     }
    // ];
    const columns = [
        { field: "id", headerName: " ", width: 80, sortable: false },
        {
            field: "name",
            headerName: "קרן",
            width: 140,
            renderCell: (params) =>
                editingRow === params.row.id ? (
                    <EditableCell
                        value={editedData.name || params.row.name}
                        onChange={(value) => setEditedData({ ...editedData, name: value })}
                    />
                ) : (
                    <Link to={`/allocations/fund/${params.row.id}`} underline="hover" color="inherit">
                        {params.row.name || ""}
                    </Link>
                ),
        },
        {
            field: "description",
            headerName: "תיאור",
            width: 140,
            renderCell: (params) =>
                editingRow === params.row.id ? (
                    <EditableCell
                        value={editedData.description || params.row.description}
                        onChange={(value) => setEditedData({ ...editedData, description: value })}
                    />
                ) : (
                    params.row.description || ""
                ),
        },
        {
            field: "contact_name",
            headerName: "שם איש קשר",
            width: 140,
            renderCell: (params) =>
                editingRow === params.row.id ? (
                    <EditableCell
                        value={editedData.contact_name || params.row.contact_name}
                        onChange={(value) => setEditedData({ ...editedData, contact_name: value })}
                    />
                ) : (
                    params.row.contact_name || ""
                ),
        },
        {
            field: "phone",
            headerName: "פלאפון",
            width: 140,
            renderCell: (params) =>
                editingRow === params.row.id ? (
                    <EditableCell
                        value={editedData.phone || params.row.phone}
                        onChange={(value) => setEditedData({ ...editedData, phone: value })}
                    />
                ) : (
                    params.row.phone || ""
                ),
        },
        {
            field: "mail",
            headerName: "מייל",
            width: 160,
            renderCell: (params) =>
                editingRow === params.row.id ? (
                    <EditableCell
                        value={editedData.mail || params.row.mail}
                        onChange={(value) => setEditedData({ ...editedData, mail: value })}
                    />
                ) : (
                    params.row.mail || ""
                ),
        },
        {
            field: "edit",
            headerName: "עריכה",
            minWidth: 150,
            flex: 1,
            renderCell: (params) => (
                editingRow === params.row.id ? (
                    <>
                        <Button onClick={handleSaveClick} color="primary">
                            שמור
                        </Button>
                        <Button onClick={handleCancelClick} color="secondary">
                            ביטול
                        </Button>
                    </>
                ) : (
                    <Button onClick={() => handleEditClick(params.row)} color="primary">
                        <EditIcon />
                    </Button>
                )
            ),
        },
    ];

    const handleEditClick = (fund) => {
        setEditingRow(fund.id);
        setEditedData({ ...fund });

    };

    const handleSaveClick = () => {

        const existingFund = fundStore.fundList.find(fund => fund.id === editingRow);
        const updatedFund = { ...existingFund, ...editedData };
        console.log(updatedFund);
        fundStore.updateFund(updatedFund);
        fundStore.updateFund(editedData);
        setEditingRow(null);
        navigate(0)
    };

    const handleCancelClick = () => {
        setEditingRow(null);
    };

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
                const deletePromises = selectedIds.map(id => fundStore.deleteFund(id));
                Promise.all(deletePromises)
                    .then(() => {
                        Swal.fire({
                            title: "נמחק",
                            text: "הפרויקטים נמחקו בהצלחה",
                            icon: "success",
                        });
                    },
                        navigate(0)
                    )
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
                        קרנות
                    </h1>
                    <Tooltip title="קרן חדש" arrow>
                        <Button
                            style={{
                                width: "auto",
                                alignSelf: "flex-start",
                                marginBottom: "10px",
                            }}
                            onClick={() => navigate("/Add_fund")}
                        >
                            <Fab size="medium" color="primary" aria-label="add">
                                <AddIcon />
                            </Fab>
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
                        rows={fundStore.fundList}
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

export default Fund_list;
