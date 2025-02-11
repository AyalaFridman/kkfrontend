import React, { useEffect, useState } from "react";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// MobX
import { observer } from "mobx-react";
import serviceProviderStore from "../../store/service-provider-store";
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
import AddServiceProvider from "./add-service-provider"
const ServiceProvider_list = observer(() => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (added, newData) => {
    setOpenDialog(false);
    if (added) {
      serviceProviderStore.fetchServiceProviderList(); // רענון הרשימה
    }
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
    serviceProviderStore.fetchServiceProviderList(); // שליפת נתונים מה-store
  }, []);

  // Handle loading or error
  if (serviceProviderStore.isLoading) {
    return <div>טוען...</div>;
  }

  if (serviceProviderStore.isError) {
    return <div>שגיאה: {serviceProviderStore.errorMessage}</div>;
  }

  const providerTypeMapping = {
    needy: "נתמך",
    kupa: "קופה",
  };
  const columns = [
    { field: "id", headerName: " ", width: 80, disableColumnMenu: true },
    {
      field: "Name",
      headerName: "לקוח",
      width: 140,
      renderCell: (params) => (
        <Link
          to={`/ServiceProviderDetails/${params.row.id}`}
          underline="hover"
          color="inherit"
        >
          {`${params.row.name || ""} `}
        </Link>
      ),
    },
    { field: "name", headerName: "שם ", width: 140 },
    { field: "phone", headerName: "טלפון", width: 140 },

    { field: "email", headerName: " מייל", width: 140 },
    { field: "type_of_service", headerName: " סוג שירות", width: 140 },
    {
      field: "provider_type",
      headerName: "מקבל השירות",
      width: 140,
      renderCell: (params) => providerTypeMapping[params.value] || params.value,
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

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
        const deletePromises = selectedIds.map((id) =>
          serviceProviderStore.deleteServicProvider(id)
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
            <ContactsRoundedIcon /> נותני שירות
          </h1>
          <Tooltip title="נותן שירות חדש" arrow>
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
          <AddServiceProvider open={openDialog} onClose={handleCloseDialog} />
          <div style={{ display: "flex", gap: "10px", alignSelf: "flex-end" }}>
            <Tooltip title="מחיקת נותני שירות" arrow>
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
          ></Popover>
          <DataGrid
            rows={serviceProviderStore.serviceProviderList}
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

export default ServiceProvider_list;
