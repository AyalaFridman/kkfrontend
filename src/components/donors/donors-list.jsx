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
import { Box, Popover, Button, Tooltip } from "@mui/material";
//
import localeText from "../needy/localeText";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddDonor from "./add_donor"
const Donors_list = observer(() => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (added, newData) => {
    setOpenDialog(false);
      donorStore.fetchDonorsList();
  };

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
    donorStore.fetchDonorsList(); // שליפת נתונים מה-store
  }, []);

  // Handle loading or error
  if (donorStore.isLoading) {
    return <div>טוען...</div>;
  }

  if (donorStore.isError) {
    return <div>שגיאה: {donorStore.errorMessage}</div>;
  }

  const columns = [
    { field: "id", headerName: " ", width: 80, sortable: false },
    {
      field: "Name",
      headerName: "תורם",
      width: 140,
      renderCell: (params) => (
        <Link
          to={`/DonorDetails/${params.row.id}`}
          underline="hover"
          color="inherit"
        >
          {`${params.row.name || ""}`}
        </Link>
      ),
      valueGetter: (value, row) => {
        return `${row.name || ""} `;
      },
    },

    { field: "phone", headerName: "טלפון", width: 140 },
    {
      field: `city`,
      headerName: "עיר",
      width: 140,
      valueGetter: (value, row) => {
        return row.city != "nan" ? row.city : "";
      },
    },
    {
      field: `address`,
      headerName: "כתובת",
      width: 140,
      valueGetter: (value, row) => {
        return row.address != "nan" ? row.address : "";
      },
    },
    { field: "mail", headerName: "מייל", width: 140 },

    // { field: "amount", headerName: "כמות", with: 140 }
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
            <ContactsRoundedIcon /> תורמים
          </h1>
          <Tooltip title="תורם חדש" arrow>
            <Button
              style={{
                width: "auto",
                alignSelf: "flex-start",
                marginBottom: "10px",
              }}
              onClick={handleOpenDialog}
            >
              <PersonAddIcon />
            </Button>
          </Tooltip>
          <AddDonor open={openDialog} onClose={handleCloseDialog} />
          <div style={{ display: "flex", gap: "10px", alignSelf: "flex-end" }}>
            <Tooltip title="מחיקת תורמים" arrow>
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
            <Box
              sx={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            ></Box>
          </Popover>
          <DataGrid
            rows={donorStore.donorsList}
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

export default Donors_list;
