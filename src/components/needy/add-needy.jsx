import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import NeedyDetails from "./needy-details";
import IncomeAndExpenses from "./IncomeAndExpenses";
import BankDetails from "./bank-details";
import needyStore from "../../store/needy-store";
import Swal from "sweetalert2";

const steps = ["פרטים אישיים", "הכנסות והוצאות", "פירטי חשבון"];

function Add_needy() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState(new Set());
  const [newNeedy,setNewNeedy]=React.useState(null)
  const [newIncome,setNewIncome]=React.useState(null)
  const [newBankDetial,setnewBankDetial]=React.useState(null)
  const isStepCompleted = (step) => completedSteps.has(step);


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
    setCompletedSteps(new Set());
  };
  const handleSave=()=>{
    handleNext()
    needyStore.add_needy(newNeedy).then((res) => {
            if (res == 200 || res == 201) {
              Swal.fire({
                title: "הוספה",
                text: "איש הקשר נוסף בהצלחה",
                icon: "success",
                timer: 2000,
              });
              setTimeout(() => {
                navigate('./needyList');
              }, 1000); // ניווט אחרי שנייה
             
            } else {
              Swal.fire({
                title: "תקלה",
                text: "תקלה בעת עדכון הנתונים",
                icon: "error",
                timer: 2000,
              });
            }
          });
    
  }
  const handleStepCompletion = (step,updatedData) => {
    console.log("in handleStepCompletion");
    console.log(updatedData);
    switch(step){
      case 0:
        setNewNeedy(updatedData)
        break;
      case 1:
        newNeedy.income=updatedData
        break;
      case 2:
        newNeedy.account=updatedData
        break;     
    }
    
    setCompletedSteps((prevCompleted) => new Set(prevCompleted).add(step));
  };
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <NeedyDetails onSave={(updatedData) => handleStepCompletion(step,updatedData)} needy={newNeedy} newNeedy={true}/>;
      case 1:
        return <IncomeAndExpenses onSave={(updatedData) => handleStepCompletion(step,updatedData)} newNeedy={true} incomes={newNeedy.income}/>;
      case 2:
        return <BankDetails onSave={(updatedData) => handleStepCompletion(step,updatedData)} newNeedy={true}/>;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            כל השלבים הושלמו, הנתמך נכנס למערכת
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            {renderStepContent(activeStep)}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              ➡️
            </Button>
            {activeStep === steps.length - 1 ? <Button onClick={handleSave} disabled={!isStepCompleted(activeStep)}> סיום</Button> :
            <Button onClick={handleNext} disabled={!isStepCompleted(activeStep)}>
               ⬅️
            </Button>}
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
export default Add_needy;
