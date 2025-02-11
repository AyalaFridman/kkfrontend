import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import needyStore from "../../store/needy-store";
import {
  Box,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  useMediaQuery,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import BankDetails from "./bank-details";
import IncomeAndExpenses from "./IncomeAndExpenses";
import NeedyDetails from "./needy-details";
import Supported_list from "../supported/supported-list";
import ranks from "../../ranks";

const useNeedy = (id) => {
  const [needy, setNeedy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          setIsError(false);
          await needyStore.getNeedyById(id);
          setNeedy(needyStore.currentNeedy[0] || null);
        } catch (error) {
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  return { needy, isLoading, isError };
};

const NeedyProps = () => {
  const { id } = useParams();
  const { needy, isLoading, isError } = useNeedy(id);
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const tabContent = [
    { label: "פרטי נתמך", component: <NeedyDetails needy={needy} /> },
    {
      label: "פרטי מצב כלכלי",
      component: <IncomeAndExpenses needy_id = {id} incomes={needy?.income} expenses={needy?.expenses} />,

    },
    {
      label: "פרטי חשבון",
      component: (
        <BankDetails
          account={needy?.account}
          onUpdate={(updatedAccount) => (needy.account[0] = updatedAccount)}
        />
      ),
    },
    {
      label: "תמיכות",
      component: <Supported_list needy_id={id} needy_account={needy?.account?.[0]}/>,
    },
  ];

  const getColor = (level) => ranks[level - 1]?.color || "#5f5f5f";

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
        <Typography variant="h6">שגיאה בטעינת הנתמך</Typography>
        <button onClick={() => window.location.reload()}>נסה שוב</button>
      </Box>
    );
  }

  if (!needy) {
    return (
      <Box sx={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h6">הנתמך לא נמצא</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#d1d2efaa",
          textAlign: "right",
          padding: "1px 10px",
          margin: "0px",
        }}
      >
        <Typography variant="h6" sx={{ fontFamily: "Tahoma, sans-serif" }}>
          נתמך:{" "}
          {`${needy.last_name || ""} ${needy.husband_name || ""} ${
            needy.wife_name || ""
          }`}
        </Typography>
        <Typography
          variant="h6"
          style={{
            color: `${getColor(needy.level_of_need)}`,
            fontFamily: "Tahoma, sans-serif",
          }}
        >
          {`/${ranks[needy.level_of_need - 1]?.label} `}
          {needy.gerim&& ` - גרי צדק`}
        </Typography>
      </div>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="tabs for needy details"
        >
          {tabContent.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
        <Box
          sx={{
            marginTop: 2,
            alignItems: "right",
            maxHeight: "120vh",
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

export default NeedyProps;
