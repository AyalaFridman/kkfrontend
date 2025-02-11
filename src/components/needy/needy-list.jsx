// import React, { useEffect, useState } from "react";
// import rtlPlugin from "stylis-plugin-rtl";
// import { prefixer } from "stylis";
// import { CacheProvider } from "@emotion/react";
// import createCache from "@emotion/cache";
// // MobX
// import { observer } from "mobx-react";
// import needyStore from "../../store/needy-store";
// // mui
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
// import InfoIcon from "@mui/icons-material/Info";
// import { DataGrid } from "@mui/x-data-grid";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Box, Popover, Button, Tooltip } from "@mui/material";
// //
// import localeText from "./localeText";
// import { Link, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import ranks from "../../ranks";

// const Needly_list = observer(() => {
//   const navigate = useNavigate();
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const handleOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? "color-ranges-popover" : undefined;

//   // Fetch data from MobX store
//   useEffect(() => {
//     needyStore.fetchNeedyList(); // שליפת נתונים מה-store
//   }, []);

//   // Handle loading or error
//   if (needyStore.isLoading) {
//     return <div>טוען...</div>;
//   }

//   if (needyStore.isError) {
//     return <div>שגיאה: {needyStore.errorMessage}</div>;
//   }

//   const columns = [
//     { field: "id", headerName: " ", width: 80, disableColumnMenu: true },
//     {
//       field: "Name",
//       headerName: "לקוח",
//       width: 140,
//       renderCell: (params) => (
//         <Link
//           to={`/NeedyProp/${params.row.id}`}
//           underline="hover"
//           color="inherit"
//         >
//           {`${params.row.last_name || ""} ${params.row.husband_name || ""} ${
//             params.row.wife_name || ""
//           }`}
//         </Link>
//       ),
//       valueGetter: (value, row) => {
//         return `${row.last_name || ""} ${row.husband_name || ""} ${
//           row.wife_name || ""
//         }`;
//       },
//     },
//     { field: "last_name", headerName: "שם משפחה", width: 105 },
//     { field: "husband_name", headerName: "שם בעל", width: 105 },
//     { field: "wife_name", headerName: "שם אישה", width: 105 },
//     { field: "phone", headerName: "טלפון", width: 140 },
//     // { field: "created-date", headerName: "תאריך יצירה", width: 140 },
//     {
//       field: "address",
//       headerName: "כתובת",
//       width: 140,
//       valueGetter: (value, row) => ` ${row.street}  ${row.building_number} `,
//     },
//     {
//       field: "level_of_need",
//       headerName: "דרגת נצרך",
//       width: 140,
//       renderCell: (params) => {
//         const color = ranks.filter((rank) => rank.label == params.value);
//         return (
//           <div
//             style={{
//               width: "40%",
//               height: "40%",
//               backgroundColor: color[0].color,
//               borderRadius: "10px",
//               margin: "10px",
//             }}
//           ></div>
//         );
//       },
//       valueGetter: (value, raw) => {
//         return ranks[raw.level_of_need - 1].label;
//       },
//     },
//   {field:"one_time_support",headerName:"תמיכה חד פעמית"}
//   ];

//   const paginationModel = { page: 0, pageSize: 5 };

//   const theme = createTheme({
//     direction: "rtl",
//   });

//   const cacheRtl = createCache({
//     key: "muirtl",
//     stylisPlugins: [prefixer, rtlPlugin],
//   });

//   const handleDelete = async () => {
//     Swal.fire({
//       title: "?האם אתה בטוח שאתה למחוק",
//       text: "!לא תוכל לשחזר את החומר",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "!כן, מחק",
//       cancelButtonText: "לא, בטל",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         const selectedIds = [...selectedRows];
//         const deletePromises = selectedIds.map((id) =>
//           needyStore.updateStatusNeedy(id, false)
//         );
  
//         Promise.all(deletePromises).then(() => {
//           Swal.fire({
//             title: "נמחק",
//             text: "הנתמכים נמחקו בהצלחה",
//             icon: "success",
//           }).then(() => {
//             navigate(0);
//           });
//         });
//       }
//     });
//   };
  

//   return (
//     <CacheProvider value={cacheRtl}>
//       <ThemeProvider theme={theme}>
//         <div
//           dir="rtl"
//           style={{
//             height: "100%",
//             width: "100%",
//             display: "flex",
//             flexDirection: "column",
//             padding: "0px",
//           }}
//         >
//           <h1>
//             <ContactsRoundedIcon /> אנשי קשר
//           </h1>
//           <Tooltip title="איש קשר חדש" arrow>
//             <Button
//               style={{
//                 width: "auto",
//                 alignSelf: "flex-start",
//                 marginBottom: "10px",
//               }}
//               onClick={() => navigate("/newNeedy")}
//             >
//               <PersonAddIcon />
//             </Button>
//           </Tooltip>
//           <div style={{ display: "flex", gap: "10px", alignSelf: "flex-end" }}>
//             <Tooltip title="מחיקת אנשי קשר" arrow>
//               <Button style={{ width: "auto" }} onClick={handleDelete}>
//                 <DeleteIcon />
//               </Button>
//             </Tooltip>
//             <Tooltip title="טווחי צבעים" arrow>
//               <Button
//                 style={{
//                   alignSelf: "flex-start",
//                   marginBottom: "10px",
//                 }}
//                 aria-describedby={id}
//                 onClick={handleOpen}
//               >
//                 <InfoIcon />
//               </Button>
//             </Tooltip>
//           </div>
//           <Popover
//             id={id}
//             open={open}
//             anchorEl={anchorEl}
//             onClose={handleClose}
//             anchorOrigin={{
//               vertical: "bottom",
//               horizontal: "center",
//             }}
//             transformOrigin={{
//               vertical: "top",
//               horizontal: "center",
//             }}
//           >
//             <Box
//               sx={{
//                 padding: "10px",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "flex-start",
//               }}
//             >
//               {ranks.map((rank) => (
//                 <div
//                   key={rank.label}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "5px",
//                     width: "100%",
//                   }}
//                 >
//                   <span>{rank.label}:</span>
//                   <div
//                     style={{
//                       width: "20px",
//                       height: "20px",
//                       backgroundColor: rank.color,
//                       marginRight: "10px",
//                       borderRadius: "50%",
//                     }}
//                   ></div>
                  
//                 </div>
//               ))}
//             </Box>
//           </Popover>
//           <DataGrid
//             rows={needyStore.needyList.filter((needy) => needy.status == true)}
//             columns={columns}
//             initialState={{ pagination: { paginationModel } }}
//             checkboxSelection
//             onRowSelectionModelChange={(newSelection) => {
//               setSelectedRows(newSelection);
//             }}
//             sx={{ border: 0 }}
//             localeText={localeText}
//           />
//         </div>
//       </ThemeProvider>
//     </CacheProvider>
//   );
// });

// export default Needly_list;
import React, { useEffect, useState } from "react";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// MobX
import { observer } from "mobx-react";
import needyStore from "../../store/needy-store";
// mui
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import InfoIcon from "@mui/icons-material/Info";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Popover, Button, Tooltip, Checkbox, FormControlLabel } from "@mui/material";
//
import localeText from "./localeText";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ranks from "../../ranks";

const Needly_list = observer(() => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showConvertsOnly, setShowConvertsOnly] = useState(false); // מצב הסינון
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
    needyStore.fetchNeedyList(); // שליפת נתונים מה-store
  }, []);

  // Handle loading or error
  if (needyStore.isLoading) {
    return <div>טוען...</div>;
  }

  if (needyStore.isError) {
    return <div>שגיאה: {needyStore.errorMessage}</div>;
  }

  const columns = [
    // { field: "id", headerName: " ", width: 80, disableColumnMenu: true },
    {
      field: "Name",
      headerName: "לקוח",
      width: 140,
      renderCell: (params) => (
        <Link
          to={`/NeedyProp/${params.row.id}`}
          underline="hover"
          color="inherit"
        >
          {`${params.row.last_name || ""} ${params.row.husband_name || ""} ${
            params.row.wife_name || ""
          }`}
        </Link>
      ),
      valueGetter: (value, row) => {
        return `${row.last_name || ""} ${row.husband_name || ""} ${
          row.wife_name || ""
        }`;
      },
    },
    { field: "last_name", headerName: "שם משפחה", width: 105 },
    { field: "husband_name", headerName: "שם בעל", width: 105 },
    { field: "wife_name", headerName: "שם אישה", width: 105 },
    { field: "phone", headerName: "טלפון", width: 140 ,  valueGetter: (value, row) => row.phone?`${row.phone}`:row.husband_phone,},
    {
      field: "address",
      headerName: "כתובת",
      width: 140,
      valueGetter: (value, row) => ` ${row.street}  ${row.building_number} `,
    },
    {
      field: "level_of_need",
      headerName: "דרגת נצרך",
      width: 140,
      renderCell: (params) => {
        const color = ranks.filter((rank) => rank.label === params.value);
        return (
          <div
            style={{
              width: "40%",
              height: "40%",
              backgroundColor: color[0].color,
              borderRadius: "10px",
              margin: "10px",
            }}
          ></div>
        );
      },
      valueGetter: (value, raw) => {
        return ranks[raw.level_of_need - 1].label;
      },
    },
    {
      field: "one_time_support",
      headerName: "הוצאה חריגה",
      width: 180,
      renderCell: (params) => (
        <Tooltip title={params.row.reason_for_expense || "לא צוינה סיבה"}>
          <span>{params.value ? `${params.row.reason_for_expense} : ${params.value} ₪` : ""}</span>
        </Tooltip>
      ),
    }
    
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
        const deletePromises = selectedIds.map((id) =>
          needyStore.updateStatusNeedy(id, false)
        );
  
        Promise.all(deletePromises).then(() => {
          Swal.fire({
            title: "נמחק",
            text: "הנתמכים נמחקו בהצלחה",
            icon: "success",
          }).then(() => {
            navigate(0);
          });
        });
      }
    });
  };

  const filteredNeedyList = showConvertsOnly
    ? needyStore.needyList.filter(
        (needy) => needy.status === true && needy.gerim === true
      )
    : needyStore.needyList.filter((needy) => needy.status === true);

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
            <ContactsRoundedIcon /> אנשי קשר
          </h1>
          <Tooltip title="איש קשר חדש" arrow>
            <Button
              style={{
                width: "auto",
                alignSelf: "flex-start",
              }}
              onClick={() => navigate("/newNeedy")}
            >
              <PersonAddIcon />
            </Button>
          </Tooltip>
          <FormControlLabel
            control={
              <Checkbox
                checked={showConvertsOnly}
                onChange={(e) => setShowConvertsOnly(e.target.checked)}
              />
            }
            label="הצג גרי צדק"
            style={{ alignSelf: "flex-start", marginRight: "10px" }}
          />
          <div style={{ display: "flex", gap: "10px", alignSelf: "flex-end" }}>

            <Tooltip title="מחיקת אנשי קשר" arrow>
              <Button style={{ width: "auto" }} onClick={handleDelete}>
                <DeleteIcon />
              </Button>
            </Tooltip>
            <Tooltip title="טווחי צבעים" arrow>
              <Button
                style={{
                  alignSelf: "flex-start",
                  marginBottom: "10px",
                }}
                aria-describedby={id}
                onClick={handleOpen}
              >
                <InfoIcon />
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
            >
              {ranks.map((rank) => (
                <div
                  key={rank.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                    width: "100%",
                  }}
                >
                  <span>{rank.label}:</span>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: rank.color,
                      marginRight: "10px",
                      borderRadius: "50%",
                    }}
                  ></div>
                </div>
              ))}
            </Box>
          </Popover>
          <DataGrid
            rows={filteredNeedyList}
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

export default Needly_list;
