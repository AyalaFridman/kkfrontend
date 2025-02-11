import React, { useEffect, useState } from "react";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// MobX
import { observer } from "mobx-react";
import donorStore from "../../store/donor-store";
// mui
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import InfoIcon from "@mui/icons-material/Info";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Popover, Button, Tooltip, ToggleButtonGroup, ToggleButton, CircularProgress, Typography } from "@mui/material";
// 
import localeText from "../needy/localeText";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const DonorsKevaList = observer(({ donorId, donor }) => {
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [statusFilter, setStatusFilter] = useState("active");

    const [fileName, setFileName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [extractedText, setExtractedText] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");


    const convertExcelDate = (excelDate) => {
        if (excelDate && typeof excelDate === "number") {
            const epoch = Date.parse("1900-01-01");
            const date = new Date(epoch + excelDate * 86400000); // המרת התאריך
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        }
        return excelDate;
    };

    const handleTransactionsFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const binaryData = event.target.result;

                    const workbook = XLSX.read(binaryData, { type: "binary" });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const parsedData = XLSX.utils.sheet_to_json(sheet, {
                        header: 4,
                        range: 4,
                    });

                    const dateColumns = ["תאריך", "תאריך ערך"];

                    const dataWithCorrectDates = parsedData.map((row) => {
                        const updatedRow = {};
                        Object.keys(row).forEach((key) => {
                            if (dateColumns.includes(key)) {
                                updatedRow[key] = convertExcelDate(row[key]);
                            } else {
                                updatedRow[key] = row[key];
                            }
                        });
                        return updatedRow;
                    });

                    setData(dataWithCorrectDates);

                    if (dataWithCorrectDates.length > 0) {
                        setHeaders(Object.keys(dataWithCorrectDates[0]));
                        setData(dataWithCorrectDates);
                        setUploadStatus("success");

                        dataWithCorrectDates.forEach((row) => {

                            if (row['סוג פעולה'] == 222  && row['תיאור'] == "קופת כרמיאל") {

                                const json_data = {
                                    key: "monthlyBankKevaDonation",
                                    value :""

                                }
                                console.log(json_data);

                                donorStore.addBankDonation(json_data);
                            }
                        });
                    }
                    else {
                        setUploadStatus("empty");
                    }
                }
                catch (error) {
                    console.error("Error processing the Excel file:", error);
                    setUploadStatus("error");
                }
            };

            reader.onerror = (error) => {
                console.error("Error reading the Excel file:", error);
            };

            reader.readAsBinaryString(file);
        }
    };



    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://127.0.0.1:8000/upload/upload-pdf", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload file");
            }

            const data = await response.json();
            setExtractedText(data.text || "No text extracted.");

        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStatusChange = (event, newStatus) => {
        setStatusFilter(newStatus);
    };

    const open = Boolean(anchorEl);
    const id = open ? "color-ranges-popover" : undefined;

    // Fetch data from MobX store
    useEffect(() => {
        donorStore.fetchDonorsKevaList();
    }, []);

    const filteredRows = donorId
        ? donor.donations_keva
            .filter((keva) =>
                statusFilter === null ? true : keva.status === (statusFilter === "active")
            )
            .map((keva, index) => ({
                id: index,
                ...keva,
            }))
        : donorStore.donorKevaList.filter((keva) =>
            statusFilter === null ? true : keva.status === (statusFilter === "active")
        );

    console.log("filteredRows:", filteredRows);

    if (donorStore.isLoading) {
        return <div>טוען...</div>;
    }

    if (donorStore.isError) {
        return <div>שגיאה: {donorStore.errorMessage}</div>;
    }

    const columns = [
        { field: "id", headerName: " ", width: 80, sortable: false },
        donorId
            ? {
                field: "Name",
                headerName: "תורם",
                width: 140,
                renderCell: () => `${donor.last_name || ""} ${donor.first_name || ""}`,
            }
            : {
                field: "Name",
                headerName: "תורם",
                width: 140,
                renderCell: (params) => (
                    <Link
                        to={`/DonorDetails/${params.row.donors_id}`}
                        underline="hover"
                        color="inherit"
                    >
                        {`${params.row.donor.name || ""} `}
                    </Link>
                ),
                valueGetter: (value, row) => {
                    return `${row.donor.name || ""} `
                }
            },
        { field: "monthly_amount", headerName: "סכום חודשי", width: 140 },
        { field: "category", headerName: "קטגוריה", width: 140 },
        {
            field: "status_color",
            headerName: " סטטוס",
            width: 140,
            disableColumnMenu: true, // מכבה את תפריט ניהול העמודות
            renderCell: (params) => (
                <span
                    style={{
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        backgroundColor: params.row.status ? "#519f12" : "#ff0000",
                    }}
                >
                    {params.row.status ? "פעיל" : "לא פעילה"}
                </span>
            ),
        },
        { field: "were_carried_out", headerName: "מספר חיובים שבוצעו", width: 140 },
    ];

    const paginationModel = { page: 0, pageSize: 15 };

    const theme = createTheme({
        direction: "rtl",
    });

    const cacheRtl = createCache({
        key: "muirtl",
        stylisPlugins: [prefixer, rtlPlugin],
    });

    const handleDelete = async () => {
        Swal.fire({
            title: "?האם אתה בטוח שאתה למחוק",
            text: "!לא תוכל לשחזר את החומר",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "!כן, מחק",
            cancelButtonText: "לא, בטל",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const selectedIds = [...selectedRows];
                console.log("IDs to delete:", selectedIds);
                await needyStore.deleteNeedies(selectedIds);
                needyStore.setNeedyList(
                    needyStore.needyList.filter((item) => !selectedIds.includes(item.id))
                );
                Swal.fire({
                    title: "נמחק",
                    text: "אנשי קשר אלו נמחקו",
                    icon: "success",
                });
            }
        });
    };

    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        mt: 4,
                    }}
                >
                    <div style={{ padding: "16px" }}>
                        <Button variant="contained" component="label">
                            בחר קובץ סך הו"ק בנקאיות                            <input
                                type="file"
                                accept=".xls, .xlsx"
                                hidden
                                onChange={handleTransactionsFileUpload}
                            />
                        </Button>
                    </div >
                    <Button variant="contained" component="label">
                        העלה קובץ PDF
                        <input
                            type="file"
                            accept="application/pdf"
                            hidden
                            onChange={handleFileUpload}
                        />
                    </Button>

                    {fileName && (
                        <Typography variant="body1">קובץ בבחירה: {fileName}</Typography>
                    )}

                    {isLoading && (
                        <CircularProgress />
                    )}
                </Box>
                <div
                    dir="rtl"
                    style={{
                        height: "100%",
                        width: "100%,",
                        display: "flex",
                        flexDirection: "column",
                        padding: "0px",
                    }}
                >
                    <h1>
                        <ContactsRoundedIcon /> הוראות קבע
                    </h1>

                    {/* סינון לפי סטטוס */}
                    <Box marginBottom="10px">
                        <ToggleButtonGroup
                            value={statusFilter}
                            exclusive
                            onChange={handleStatusChange}
                            aria-label="סינון סטטוס"
                        >
                            <ToggleButton value={null} aria-label="הכל">
                                הכל
                            </ToggleButton>
                            <ToggleButton value="active" aria-label="פעיל">
                                פעיל
                            </ToggleButton>
                            <ToggleButton value="inactive" aria-label="לא פעיל">
                                לא פעיל
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
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

export default DonorsKevaList;
