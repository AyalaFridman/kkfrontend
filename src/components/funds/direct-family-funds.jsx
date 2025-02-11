import React, { useEffect, useState, useRef } from "react";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// MobX
import { observer } from "mobx-react";
// mui
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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

const Direct_family_Funds_list = observer(() => {
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
        fundStore.fetchDirectFamilyFundList(); // שליפת נתונים מה-store
    }, []);

    // Handle loading or error
    if (fundStore.isLoading) {
        return <div>טוען...</div>;
    }

    if (fundStore.isError) {
        return <div>שגיאה: {fundStore.errorMessage}</div>;
    }


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
        <Grid container spacing={3} sx={{ padding: 3 }}>
            {fundStore.directFamilyFunds.map((fund) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={fund.id}>
                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                                {fund.name}
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 1 }}>
                                {fund.description}
                            </Typography>
                            <Typography variant="body2"  sx={{ marginTop: 1 }}>
                                {fund.contact_name}
                            </Typography>
                            <Typography variant="body2"  sx={{ marginTop: 1 }}>
                                {fund.phone}
                            </Typography>
                            <Typography variant="body2" sx={{ marginTop: 1 }}>
                                {fund.mail}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
});

export default Direct_family_Funds_list;
