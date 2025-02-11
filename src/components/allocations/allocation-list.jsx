import React, { useEffect, useState, useRef } from "react";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// MobX
import { observer } from "mobx-react";
import allocationStore from "../../store/allocation-store";
import projectStore from "../../store/project-store";
import fundStore from "../../store/fund-store";
// mui
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Popover, Button, Tooltip, Fab, Typography } from "@mui/material";
import localeText from "../needy/localeText";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import { useParams } from "react-router-dom";

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

const Allocation_list = observer(() => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const { project_id, fund_id } = useParams();

  const store = project_id
    ? projectStore
    : fund_id
    ? fundStore
    : allocationStore;
  const title = project_id
    ? " חלוקות תחת הפרויקט"
    : fund_id
    ? "חלוקות תחת הקרן"
    : "חלוקות";

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
    if (fund_id || project_id) {
      const _id = project_id ? project_id : fund_id;
      store.fetchAllocationList(_id);
    } else {
      store.fetchAllocationList();
    }
  }, []);

  // Handle loading or error
  if (store.isLoading) {
    return <div>טוען...</div>;
  }

  if (store.isError) {
    return <div>שגיאה: {store.errorMessage}</div>;
  }

  const columns = [
    { field: "id", headerName: " ", width: 80, sortable: true },
    {
      field: "allocation_type",
      headerName: "חלוקה",
      width: 140,
      renderCell: (params) => (
        <Link
          to={`/allocationsDetails/${params.row.id}/${params.row.project_id}`}
          underline="hover"
          color="inherit"
        >
          {`${params.row.allocation_type || ""}`}
        </Link>
      ),
      valueGetter: (value, row) => {
        return `${row.allocation_type || ""}`;
      },
    },

    {
      field: "allocation_method",
      headerName: "תיאור",
      width: 140,
      renderCell: (params) =>
        editingRow === params.row.id ? (
          <EditableCell
            value={editedData.description || params.row.description}
            onChange={(value) =>
              setEditedData({ ...editedData, description: value })
            }
          />
        ) : (
          params.row.description
        ),
    },
    { field: "amount_or_quantity", headerName: "כמות לחלוקה", width: 140 },
    { field: "distributed", headerName: "חולק", width: 140 },
    {
      field: "remainingToDistribute",
      headerName: "נותר לחלוקה",
      width: 140,
      renderCell: (params) => {
        return (
          (params.row.amount_or_quantity || 0) - (params.row.distributed || 0)
        );
      },
    },

    {
      field: "edit",
      headerName: "עריכה",
      minWidth: 150,
      flex: 1,
      renderCell: (params) =>
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
        ),
    },
  ];

  const handleEditClick = (allocation) => {
    setEditingRow(allocation.id);
    setEditedData({ ...allocation });
  };

  const handleSaveClick = () => {
    const existingAllocation = AllocationStore.allocationList.find(
      (allocation) => allocation.id === editingRow
    );
    const updatedAllocation = { ...existingAllocation, ...editedData };
    console.log(updatedAllocation);
    allocationStore.updateAllocation(updatedAllocation);
    allocationStore.updateAllocation(editedData);
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
        console.log("IDs to delete:", selectedIds);
        const deletePromises = selectedIds.map((id) =>
          allocationStore.deleteAllocation(id)
        );
        Promise.all(deletePromises).then(() => {
          Swal.fire({
            title: "נמחק",
            text: "הפרויקטים נמחקו בהצלחה",
            icon: "success",
          });
        }, navigate(0));
      }
    });
  };

  const rows = project_id
    ? projectStore.currentProjectAllocations
    : fund_id
    ? fundStore.currentFundAllocations
    : allocationStore.allocationList;
  console.log(rows);

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
              {title}
            </Typography>
          </div>
          <Tooltip title="פרוייקט חדש" arrow>
            <Button
              style={{
                width: "auto",
                alignSelf: "flex-start",
                marginBottom: "10px",
              }}
              onClick={() => {
                if (project_id) {
                  navigate(`/Add_allocation/p/${project_id}`);
                } else if (fund_id) {
                  navigate(`/Add_allocation/f/${fund_id}`);
                } else {
                  navigate("/Add_allocation");
                }
              }}
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
          {rows.length === 0 ? (
            <Typography
              variant="h6"
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              אין נתונים להצגה
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

export default Allocation_list;
