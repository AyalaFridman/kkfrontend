import React, { useEffect, useState, useRef } from "react";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// MobX
import { observer } from "mobx-react";
import supportedStore from "../../store/supported-store";
import { useSaveData } from "../bank-file/file_context";
import projectStore from "../../store/project-store";
import fundStore from "../../store/fund-store";
// mui
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Popover, Button, Tooltip, Fab, Typography , TextField} from "@mui/material";
import localeText from "../needy/localeText";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import { useParams } from "react-router-dom";
import specialSupportedStore from "../../store/specisl-support-store";
import Add_supported from "./add-supported";
import Add_special_supported from "./add-special-support";
import Upload_csv from "./upload_csv";
import ExportButton from "../export_button";


const EditableCell = ({ value, onChange }) => {
  const inputRef = useRef(null);

  const handleKeyPress = (event) => {
    if (event.key === " " && inputRef.current) {
      event.preventDefault();
      const newValue = value + " ";
      onChange(newValue);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyPress}
    />
  );
};

const Supported_list = observer(({ needy_id, needy_account, allocation_id, project_id }) => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { saveData } = useSaveData();
  const [amount, setAmount] = useState("");


  const handleOpenAmountPopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAmountPopup = () => {
    setAnchorEl(null);
  };

  const handleSaveAmount = () => {
    if (amount.trim() !== "") {
      addBankTransfer(amount);
    }
    handleCloseAmountPopup();
  };

  const addBankTransfer = (amount) => {
    needy_account.amount = amount
    saveData(needy_account)  
  };

  const handleOpenDialog = (dialog_name) => {
    setOpenDialog(dialog_name);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate();
  };
  // const [rows, setRows] = useState([]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Fetch data from MobX store
  useEffect(() => {
    if (needy_id) {
      specialSupportedStore.fetchSpecialSupportedNeedyList(needy_id);
      specialSupportedStore.needySpecialSupports;
      supportedStore.fetchSupportedNeedyList(needy_id);
      supportedStore.needySupports;
    } else if (allocation_id) {
      supportedStore.fetchAllocationSupportedList(allocation_id[0]);
      supportedStore.currentSupportedAllocations;
    } else {
      supportedStore.fetchSupportedList();
      specialSupportedStore.fetchSpecialSupportedList();
      supportedStore.supportedList;
    }
  }, [needy_id]);

  const rows = needy_id
    ? [
      ...supportedStore.needySupports,
      ...specialSupportedStore.needySpecialSupports,
    ].map((row, index) => ({
      ...row,
      id: index + 1,
      orginalId: row.id,
      // source: rows.includes(row) ? "rows" : "rows1"
    }))
    : allocation_id
      ? supportedStore.currentSupportedAllocations
      : [
        ...supportedStore.supportedList,
        ...specialSupportedStore.specialSupportedList,
      ].map((row, index) => ({
        ...row,
        id: index + 1,
        orginalId: row.id,
        // source: rows.includes(row) ? "rows" : "rows1"
      }));

  if (supportedStore.isLoading) {
    return <div>טוען...</div>;
  }

  if (supportedStore.isError) {
    return <div>שגיאה: {supportedStore.errorMessage}</div>;
  }
  const columns = [
    { field: "id", headerName: " ", width: 80, sortable: true },
    { field: "date", headerName: "תאריך", width: 140 },
    {
      field: "name",
      headerName: "שם נתמך",
      width: 140,
      renderCell: (params) =>
        `${params.row.needy.last_name || ""} ${params.row.needy.husband_name || ""
        } ${params.row.needy.wife_name || ""}`,
      valueGetter: (value, row) => {
        return `${row.needy.last_name || ""} ${row.needy.husband_name || ""} ${row.needy.wife_name || ""
          }`;
      },
    },
    {
      field: "notes",
      headerName: "הערות",
      width: 140,
    },
    { field: "amount", headerName: "כמות", width: 140 },
    {
      field: "type",
      headerName: "סוג",
      width: 140,
      hide: allocation_id,
      renderCell: (params) =>
        params.row.hasOwnProperty("service_provider") ? "תמיכה מיוחדת" : "",
    },
  ];

  const handleEditClick = (supported) => {
    setEditingRow(supported.id);
    setEditedData({ ...supported });
  };

  const handleSaveClick = () => {
    const existingSupported = supportedStore.supportedList.find(
      (supported) => supported.id === editingRow
    );
    const updatedSupported = { ...existingSupported, ...editedData };
    console.log(updatedSupported);
    supportedStore.updateSupported(updatedSupported);
    supportedStore.updateSupported(editedData);
    setEditingRow(null);
    navigate(0);
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
        
        const deletePromises = selectedIds.map(selectId => 
          supportedStore.deleteSupported(supportedStore.supportedList[selectId])
        );
        
        Promise.all(deletePromises)
          .then(() => {
            Swal.fire({
              title: "נמחק",
              text: "התמיכות נמחקו בהצלחה", 
              icon: "success",
            });
            navigate(0);
          })
          .catch(() => {
            Swal.fire({
              title: "error",
              text: "ערתה בעיה העת מחיקת התמיכות",
              icon: "error",
            });
          });
      }
    });
  };



  // if (!allocation_id) {
  //   console.log("------");
  // } else {
  //   console.log("allocation_id", allocation_id);
  // }
  // console.log(rows);

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
          <div
            style={{
              backgroundColor: "#d1d2efaa",
              textAlign: "right",
              padding: "1px 10px",
              margin: "10px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              תמיכות שניתנו
            </Typography>
          </div>
          <Box
  style={{
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "5px",
  }}
>
  <Button
    variant="outlined"
    style={{
      fontSize: "12px",
      padding: "4px 8px",
      cursor: "pointer",
    }}
    onClick={() => handleOpenDialog("add_support")}
  >
    הוספת תמיכה
  </Button>
  
  {!allocation_id && (
    <Button
      variant="outlined"
      style={{
        fontSize: "12px",
        padding: "4px 8px",
        cursor: "pointer",
      }}
      onClick={() => handleOpenDialog("add_special_support")}
    >
      הוספת תמיכה מיוחדת
    </Button>
  )}

  {(allocation_id || !needy_id) && (
    <Button
      variant="outlined"
      startIcon={<UploadFileIcon />}
      style={{
        fontSize: "12px",
        padding: "4px 8px",
        cursor: "pointer",
      }}
      onClick={() => handleOpenDialog("upload_csv")}
    >
      העלאת קובץ CSV
    </Button>
  )}

  {needy_account && (
    <Button 
      variant="outlined"
      style={{
        fontSize: "12px",
        padding: "4px 8px",
        cursor: "pointer",
      }}
      onClick={handleOpenAmountPopup}
    >
      הוסף העברה בנקאית
    </Button>
  )}
</Box>
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
              <Button variant="contained" onClick={handleSaveAmount}>
                שמור
              </Button>
            </div>
          </Popover>
          <Add_supported
            open={openDialog === "add_support"}
            needy_id={needy_id}
            allocations_id={allocation_id}
            project_id={project_id}
            onClose={(isAdded) => {
              setOpenDialog(false);
              if (isAdded) {
                if (needy_id) {
                  supportedStore
                    .fetchSupportedNeedyList(needy_id[0])
                    .then(() => setRefreshTrigger(refreshTrigger + 1));
                  specialSupportedStore
                    .fetchSpecialSupportedNeedyList(needy_id[0])
                    .then(() => setRefreshTrigger(refreshTrigger + 1));
                } else {
                  supportedStore
                    .fetchSupportedList()
                    .then(() => setRefreshTrigger(refreshTrigger + 1));
                }
                // else {
                //     specialSupportedStore.fetchSpecialSupportedList();
                // }
              }
            }}
          />
          <Add_special_supported
            open={openDialog === "add_special_support"}
            needy_id={needy_id}
            onClose={(isAdded) => {
              setOpenDialog(false);
              if (isAdded) {
                if (needy_id) {
                  supportedStore
                    .fetchSupportedNeedyList(needy_id[0])
                    .then(() => setRefreshTrigger(refreshTrigger + 1));
                  specialSupportedStore
                    .fetchSpecialSupportedNeedyList(needy_id[0])
                    .then(() => setRefreshTrigger(refreshTrigger + 1));
                } else {
                  supportedStore
                    .fetchSupportedList()
                    .then(() => setRefreshTrigger(refreshTrigger + 1));
                }
                // else {
                //     specialSupportedStore.fetchSpecialSupportedList();
                // }
              }
            }}
          />
          <Upload_csv
            open={openDialog === "upload_csv"}
            allocations_id={allocation_id}
            project_id={project_id}
            onClose={(isAdded) => {
              setOpenDialog(false);
              if (isAdded) {
                if (needy_id) {
                  supportedStore
                    .fetchSupportedNeedyList(needy_id[0])
                    .then(() => setRefreshTrigger(refreshTrigger + 1));
                  specialSupportedStore
                    .fetchSpecialSupportedNeedyList(needy_id[0])
                    .then(() => setRefreshTrigger(refreshTrigger + 1));
                } else {
                  supportedStore
                    .fetchSupportedList()
                    .then(() => setRefreshTrigger(refreshTrigger + 1));
                }
                // else {
                //     specialSupportedStore.fetchSpecialSupportedList();
                // }
              }
            }}
          />

          <div style={{ display: "flex", gap: "10px", alignSelf: "flex-end" }}>
            <Tooltip title="מחיקת תמיכות" arrow>
              <Button style={{ width: "auto" }} onClick={handleDelete}>
                <DeleteIcon />
              </Button>
            </Tooltip>
          </div>
          {rows.length === 0 ? (
            <Typography
              variant="h6"
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              אין תמיכות רגילות להצגה
            </Typography>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              checkboxSelection
              onRowSelectionModelChange={(newSelection) => {
                setSelectedRows(newSelection);
              }}
              sx={{ border: 0 }}
              localeText={{
                ...localeText,
                noRowsLabel: "אין נתונים להצגה",
              }}
            />
          )}
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
});
export default Supported_list;
