import React, { useEffect, useState } from "react";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// MobX
import { observer } from "mobx-react";
// mui
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, TextField, Tooltip, Button, Alert } from "@mui/material";
// 
import localeText from "../needy/localeText";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import donorStore from "../../store/donor-store";

const DonationsList = observer(({ donorId, donor }) => {
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    const [filterYear, setFilterYear] = useState(""); // שדה עבור השנה שנבחרה
    const [totalDonations, setTotalDonations] = useState(0); // סכום התרומות

    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [uploadStatus, setUploadStatus] = useState("");

    

    const handleTransfersFileUpload = async (e) => {

        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            console.log("in try");

            const response = await fetch("http://127.0.0.1:8000/upload/upload-excel", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload file");
            }

            const data = await response.json();
            setExcelData(data.data || []);

        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (uploadStatus) {
            const timer = setTimeout(() => {
                setUploadStatus("");
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [uploadStatus]);

    // useEffect(() => {

    //     const fetchData = async () => {
    //         try {
    //             setIsLoading(true);
    //             setIsError(false);
    //             await donorStore.fetchBankDonationList();
    //             setBankDonations(donorStore.bankDonationList || null);
    //         } catch (error) {
    //             setIsError(true);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []
    // );

    // if (donorStore.isLoading) {
    //     return <div>טוען...</div>;
    // }

    // if (donorStore.isError) {
    //     return <div>שגיאה: {donorStore.errorMessage}</div>;
    // }


    // Fetch data from MobX store
    useEffect(() => {
        donorStore.fetchRegDonation(); // שליפת נתוני תרומות מה-store
    }, []);

    useEffect(() => {
        if (filterYear) {
            // מסנן תרומות לפי שנה וזיהוי התורם (אם קיים)
            const filteredDonations = donorStore.regDonationList.filter((donation) => {
                const isYearMatch =
                    new Date(donation.transactionTime).getFullYear().toString() === filterYear;
                const isDonorMatch = !donorId || donation.donor.id === donorId;
                return isYearMatch && isDonorMatch;
            });
    
            // חישוב הסכום הכולל של התרומות המסוננות
            const total = filteredDonations.reduce((sum, donation) => sum + donation.amount, 0);
            setTotalDonations(total);
        } else {
            setTotalDonations(0); // אפס אם השנה אינה מוגדרת
        }
    }, [filterYear, donorStore.regDonationList]);
    // console.log(donorStore.regDonationList);

    const filteredRows = donorId
        ? donor.donations.map((donation, index) => ({
            id: index,
            ...donation
        }))
        : donorStore.regDonationList;
    console.log("filteredRows:", filteredRows);

    // Handle loading or error
    if (donorStore.isLoading) {
        return <div>טוען...</div>;
    }

    if (donorStore.isError) {
        return <div>שגיאה: {donorStore.errorMessage}</div>;
    }


    const columns = [
        { field: "id", headerName: " ", width: 80, sortable: false },
        donorId ? ({
            field: "Name",
            headerName: "שם תורם",
            width: 180,
            renderCell: () => (
                `${donor.name || ""} `
            ),
        }) : (
            {
                field: "Name",
                headerName: "שם תורם",
                width: 180,
                renderCell: (params) => (
                    <Link to={`/DonorDetails/${params.row.donor.id}`} underline="hover" color="inherit">
                        {`${params.row.donor.name || ""}  `}
                    </Link>
                ),
                valueGetter: (value, row) => {
                    return `${row.donor.name || ""} `
                }
            }
        ),
        { field: "amount", headerName: "סכום תרומה", width: 140 },
        { field: "groupe", headerName: "קטגוריה", width: 140 },
        {
            field: "transactionTime",
            headerName: "זמן העברה",
            width: 200,
            renderCell: (params) => (
                <span>{new Date(params.row.transactionTime).toLocaleDateString("he-IL")}</span>
            ),
        },
        { field: "source", headerName: "מקור תרומה", width: 140 }
    ];

    const paginationModel = { page: 0, pageSize: 15 };

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
                
                <div style={{ padding: "16px" }}>
                    <Button variant="contained" component="label">
                        בחר  קובץ העברות
                        <input
                            type="file"
                            accept=".xls, .xlsx"
                            hidden
                            onChange={handleTransfersFileUpload}
                        />
                    </Button>
                </div >
                {uploadStatus === "success" && (
                    <Alert severity="success" style={{ marginTop: "16px" }}>
                        הקובץ הועלה בהצלחה ועובד בהצלחה!
                    </Alert>
                )}
                {uploadStatus === "empty" && (
                    <Alert severity="warning" style={{ marginTop: "16px" }}>
                        הקובץ ריק. אנא בדוק את תוכן הקובץ.
                    </Alert>
                )}
                {uploadStatus === "error" && (
                    <Alert severity="error" style={{ marginTop: "16px" }}>
                        אירעה שגיאה במהלך העלאת הקובץ. ודא שהקובץ בפורמט תקין ונסה שוב.
                    </Alert>
                )}
                <div
                    dir="rtl"
                    style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        padding: "0px",
                    }}
                >
                    <h1>
                        <ContactsRoundedIcon /> תרומות רגילות
                    </h1>

                    {/* שדה חיפוש שנה */}
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        marginBottom="10px"
                    >
                        <TextField
                            label="שנה"
                            variant="outlined"
                            type="number"
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            placeholder="הכנס שנה"
                        />
                        <h3>סכום תרומות לשנה: {totalDonations} ₪</h3>
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

export default DonationsList;
