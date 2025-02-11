import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Tabs, Tab, CircularProgress, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import donorStore from "../../store/donor-store";
import DonorsKevaList from "./donors-keva-list"; 
import DonationsList from "./reg-donation-list";
const useDonor = (id) => {
  const [donor, setDonor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  // const [kevaList,setKevaList]=useState(null)
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          setIsError(false);
          await donorStore.fetchDonorDetails(id);
          setDonor(donorStore.currentDonor[0]);
          // setKevaList(donorStore.currentDonor[0].donations_keva)          
        } catch (error) {
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  return { donor,isLoading, isError };
};

const DonorDetails = () => {
  const { id } = useParams(); // קבלת ID מה-URL
  const { donor,isLoading, isError} = useDonor(id);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  console.log(donor);
  const tabContent = [
    { label: "הוראות קבע", component: <DonorsKevaList donorId={id} donor={donor}/> },
    { label: "תשלום רגיל", component: <DonationsList donorId={id} donor={donor}/> },
    { label: "תשלומים", component: <p>כאן יוצגו כל התשלומים הקודמים של התורם.</p> },
];

  const handleChange = (event, newValue) => setValue(newValue);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          טוען נתונים...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography variant="h6">שגיאה בטעינת התורם</Typography>
        <button onClick={() => window.location.reload()}>נסה שוב</button>
      </Box>
    );
  }

  if (!donor) {
    return (
      <Box sx={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h6">התורם לא נמצא</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        פרטי תורם: {`${donor.name}`|| "שם לא זמין"}
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="tabs for donor details"
        >
          {tabContent.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
        <Box
          sx={{
            marginTop: 2,
            alignItems: "right",
            maxHeight: "60vh",
            overflow: "auto",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {tabContent[value]?.component}
        </Box>
      </Box>
    </Box>
  );
};

export default DonorDetails;
