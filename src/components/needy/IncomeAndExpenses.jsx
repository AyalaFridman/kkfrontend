import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Fab,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import incomeStore from "../../store/income-store";
import expenseStore from "../../store/expense-store";
import needyStore from "../../store/needy-store";
import Swal from "sweetalert2";

const theme = createTheme({
  direction: "rtl",
});

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
function IncomeAndExpenses({
  onSave,
  needy_id,
  incomes,
  expenses,
  newNeedy
}) {
  const [formData, setFormData] = useState({
    husbandIncome: [],
    wifeIncome: [],
    additionalIncomesAndBenefits: [],
    support: [],
    housingExpenses: [],
    healthExpense: [],
    educationExpenses: [],
    totalDebt: [],
    debtMonthlyRepayment: [],
    specialExpenses: "",
  });
  const [updatesIncomes, setUpdatesIncomes] = useState([]);
  const [addIncomes, setAddIncomes] = useState([]);
  const [deleteIncomes, setDeleteIncomes] = useState([]);
  const [updatesExpenses, setUpdatesExpenses] = useState([]);
  const [addExpenses, setAddExpenses] = useState([]);
  const [deleteExpenses, setDeleteExpenses] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState(0);

  useEffect(() => {
    const parseDescription = (description) => {
      return description.split(",").map((item) => {
        const [name, amount] = item.trim().split(":");
        return { name, amount };
      });
    };
    const processIncomes = (incomes) => {
      return incomes.reduce(
        (acc, income) => {
          switch (income.income_type) {
            case "עיסוק הבעל":
              acc.husbandIncome = [
                ...(acc.husbandIncome || []),
                {
                  id: income.id,
                  income_type: income.income_type,
                  description: income.description,
                  amount: income.amount,
                },
              ];
              break;
            case "עיסוק האישה":
              acc.wifeIncome = [
                ...(acc.wifeIncome || []),
                {
                  id: income.id,
                  income_type: income.income_type,
                  description: income.description,
                  amount: income.amount,
                },
              ];
              break;
            case "הכנסות וקצבאות נוספות":
              acc.additionalIncomesAndBenefits = [
                ...(acc.additionalIncomesAndBenefits || []),
                {
                  id: income.id,
                  income_type: income.income_type,
                  description: income.description,
                  amount: income.amount,
                },
              ];
              break;
            case "תמיכות":
              acc.support = [
                ...(acc.support || []),
                {
                  id: income.id,
                  income_type: income.income_type,
                  description: income.description,
                  amount: income.amount,
                },
              ];
              break;
            default:
              break;
          }
          return acc;
        },

        {}
      );
    };

    const processExpenses = (expenses) => {
      return expenses.reduce((acc, expense) => {
        switch (expense.expense_type) {
          // case "הוצאות חינוך":
          //   acc.educationExpenses = [
          //     ...(acc.educationExpenses || []),
          //     { id: expense.id, expense_type: expense.expense_type, description: expense.description, amount: expense.amount }
          //   ];
          //   break;
          case "הוצאות דיור":
            acc.housingExpenses = [
              ...(acc.housingExpenses || []),
              {
                id: expense.id,
                expense_type: expense.expense_type,
                description: expense.description,
                amount: expense.amount,
              },
            ];
            break;
          case "חובות":
            if (expense.description === "סך החובות הכללי") {
              acc.totalDebt = [
                ...(acc.totalDebt || []),
                {
                  id: expense.id,
                  expense_type: expense.expense_type,
                  description: expense.description,
                  amount: expense.amount,
                },
              ];
            } else if (expense.description === "החזר חובות חודשי") {
              acc.debtMonthlyRepayment = [
                ...(acc.debtMonthlyRepayment || []),
                {
                  id: expense.id,
                  expense_type: expense.expense_type,
                  description: expense.description,
                  amount: expense.amount,
                },
              ];
            }
            break;
          case "הוצאות בריאות":
            acc.healthExpense = [
              ...(acc.healthExpense || []),
              {
                id: expense.id,
                expense_type: expense.expense_type,
                description: expense.description,
                amount: expense.amount,
              },
            ];
          case "הוצאות מיוחדות":
            acc.specialExpenses = expense.amount || "";
            break;
          default:
            break;
        }

        return acc;
      }, {});
    };

    if (incomes) {
      const updatedIncomeData = processIncomes(incomes);
      setFormData((prev) => ({
        ...prev,
        ...updatedIncomeData,
      }));
      const incomeSum = incomes.reduce(
        (sum, item) => sum + parseFloat(item.amount || 0),
        0
      );

      setMonthlyIncome(incomeSum);
      setTotalMonthlyIncome(monthlyIncome - monthlyExpenses);
    }

    if (expenses) {
      const updatedExpenseData = processExpenses(expenses);
      setFormData((prev) => ({
        ...prev,
        ...updatedExpenseData,
      }));
      const expenseSum = expenses.reduce(
        (sum, item) => sum + parseFloat(item.amount || 0),
        0
      );

      setMonthlyExpenses(expenseSum);
      setTotalMonthlyIncome(monthlyIncome - monthlyExpenses);
    }
  }, [incomes, expenses]);

  useEffect(() => {
    const calculateTotalIncome = () => {
      const husbandSum = formData.husbandIncome.reduce(
        (sum, income) => sum + parseFloat(income.amount || 0),
        0
      );
      const wifeSum = formData.wifeIncome.reduce(
        (sum, income) => sum + parseFloat(income.amount || 0),
        0
      );
      const additionalSum = formData.additionalIncomesAndBenefits.reduce(
        (sum, income) => sum + parseFloat(income.amount || 0),
        0
      );
      const supportSum = formData.support.reduce(
        (sum, income) => sum + parseFloat(income.amount || 0),
        0
      );
      return husbandSum + wifeSum + additionalSum + supportSum;
    };

    const calculateTotalExpenses = () => {
      const housingSum = formData.housingExpenses.reduce(
        (sum, expense) => sum + parseFloat(expense.amount || 0),
        0
      );
      const healthExpenseSum = formData.healthExpense.reduce(
        (sum, expense) => sum + parseFloat(expense.amount || 0),
        0
      );
      const debts = formData.debtMonthlyRepayment.reduce(
        (sum, expense) => sum + parseFloat(expense.amount || 0),
        0
      );
      return housingSum + healthExpenseSum + debts;
    };

    setMonthlyIncome(calculateTotalIncome());
    setMonthlyExpenses(calculateTotalExpenses());
    setTotalMonthlyIncome(calculateTotalIncome() - calculateTotalExpenses());
  }, [formData]);

  const handleSave = () => {
    console.log(updatesIncomes);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleDeleteIncome = (index, source_type) => {
    const incomeToDelete = formData[source_type].find(
      (income, idx) => idx === index
    );

    const updatedItems = formData[source_type].filter(
      (income, idx) => idx !== index
    );

    setFormData((prev) => ({
      ...prev,
      [source_type]: updatedItems,
    }));

    if (incomeToDelete.id === null) {
      setAddIncomes((prev) => {
        const updatedNewIncomes = prev.filter(
          (income) => income.tempId !== incomeToDelete.tempId
        );
        return updatedNewIncomes;
      });
    } else {
      setDeleteIncomes((prev) => [...prev, incomeToDelete.id]);
    }
  };

  const handleDeleteExpense = (index, source_type) => {
    const expenseToDelete = formData[source_type].find(
      (expense, idx) => idx === index
    );

    const updatedItems = formData[source_type].filter(
      (expense, idx) => idx !== index
    );

    setFormData((prev) => ({
      ...prev,
      [source_type]: updatedItems,
    }));

    if (expenseToDelete.id === null) {
      setAddExpenses((prev) => {
        const updatedNewExpense = prev.filter(
          (expense) => expense.tempId !== expenseToDelete.tempId
        );
        return updatedNewExpense;
      });
    } else {
      setDeleteExpenses((prev) => [...prev, expenseToDelete.id]);
    }
  };

  const addArrayItem = (new_type, source) => {
    const incomeTypes = {
      additionalIncomes: {
        key: "additionalIncomesAndBenefits",
        incomeType: "הכנסות וקצבאות נוספות",
      },
      husband: {
        key: "husbandIncome",
        incomeType: "עיסוק הבעל",
      },
      wife: {
        key: "wifeIncome",
        incomeType: "עיסוק האישה",
      },
      support: {
        key: "support",
        incomeType: "תמיכות",
      },
      housing: {
        key: "housingExpenses",
        incomeType: "הוצאות דיור",
      },
      health: {
        key: "healthExpense",
        incomeType: "הוצאות בריאות",
      },
      totalDebt: {
        key: "totalDebt",
        incomeType: "סך החובות הכללי",
      },
      debtMonthlyRepayment: {
        key: "debtMonthlyRepayment",
        incomeType: "החזר חובות חודשי",
      },
    };

    const config = incomeTypes[new_type];

    if (!config) {
      console.error(`Unknown type: ${new_type}`);
      return;
    }

    if (source === "income") {
      const newIncome = {
        id: null,
        income_type: config.incomeType,
        description: "",
        amount: 0,
        tempId: Date.now(),
      };

      setFormData((prev) => ({
        ...prev,
        [config.key]: [...prev[config.key], newIncome],
      }));

      setAddIncomes((prev) => [...prev, newIncome]);
    } else {
      const newexpense = {
        id: null,
        expense_type: config.incomeType,
        description: "",
        amount: 0,
        tempId: Math.floor(Math.random() * 100000),
      };

      if (new_type === "totalDebt" || new_type === "debtMonthlyRepayment") {
        newexpense.expense_type = "חובות";
        newexpense.description = config.incomeType;
      }
      setFormData((prev) => ({
        ...prev,
        [config.key]: [...prev[config.key], newexpense],
      }));
      setAddExpenses((prev) => [...prev, newexpense]);
    }
  };

  const handleArrayChange = (id, field, value, source_type) => {
    let updatedArray = [];

    updatedArray = formData[source_type].map((income) =>
      income.id === id ? { ...income, [field]: value } : income
    );

    setFormData((prev) => ({
      ...prev,
      [source_type]: updatedArray,
    }));

    const updatedIncome = updatedArray.find((income) => income.id === id);

    if (updatedIncome && updatedIncome.id !== null) {
      setUpdatesIncomes((prev) => {
        const exists = prev.some((income) => income.id === id);
        return exists
          ? prev.map((income) =>
              income.id === id ? { ...income, [field]: value } : income
            )
          : [...prev, updatedIncome];
      });
    } else if (updatedIncome && updatedIncome.tempId) {
      setAddIncomes((prev) => {
        const exists = prev.some(
          (income) => income.tempId === updatedIncome.tempId
        );
        return exists
          ? prev.map((income) =>
              income.tempId === updatedIncome.tempId
                ? { ...income, [field]: value }
                : income
            )
          : [...prev, { ...updatedIncome }];
      });
    }
  };

  const handleExpenseChange = (id, field, value, source_type) => {
    let updatedArray = [];

    updatedArray = formData[source_type].map((expense) =>
      expense.id === id ? { ...expense, [field]: value } : expense
    );

    setFormData((prev) => ({
      ...prev,
      [source_type]: updatedArray,
    }));

    const updatedExpense = updatedArray.find((expense) => expense.id === id);

    if (updatedExpense && updatedExpense.id !== null) {
      setUpdatesExpenses((prev) => {
        const exists = prev.some((expense) => expense.id === id);
        return exists
          ? prev.map((expense) =>
              expense.id === id ? { ...expense, [field]: value } : expense
            )
          : [...prev, updatedExpense];
      });
    } else if (updatedExpense && updatedExpense.tempId) {
      setAddExpenses((prev) => {
        const exists = prev.some(
          (expense) => expense.tempId === updatedExpense.tempId
        );
        return exists
          ? prev.map((expense) =>
              expense.tempId === updatedExpense.tempId
                ? { ...expense, [field]: value }
                : expense
            )
          : [...prev, { ...updatedExpense }];
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(newNeedy);
    
    try {
      if (newNeedy) {
        incomes = [];
        addIncomes.forEach((income_to_add) => {
          const json_data = {
            income_type: income_to_add.income_type,
            description: income_to_add.description,
            amount: income_to_add.amount,
            needy_id: needy_id,
          };
          incomes.push(json_data);
        });
        onSave(incomes);

      } else {
        for (const income_to_add of addIncomes) {
          const json_data = {
            income_type: income_to_add.income_type,
            description: income_to_add.description,
            amount: income_to_add.amount,
            needy_id: needy_id,
          };
          
          const res = await incomeStore.addIncome(json_data);
          if (res !== 200) {
            throw new Error('תקלה בהוספת הכנסה');
          }
        }
  
        // עדכון הכנסות
        for (const income_to_update of updatesIncomes) {
          const res = await incomeStore.updateIncome(income_to_update);
          if (res !== 200) {
            throw new Error('תקלה בעדכון הכנסה');
          }
        }
  
        // מחיקת הכנסות
        for (const income_to_delete of deleteIncomes) {
          const res = await incomeStore.deleteIncome(income_to_delete);
          if (res !== 200) {
            throw new Error('תקלה במחיקת הכנסה');
          }
        }
  
        // הוספת הוצאות
        for (const new_expense of addExpenses) {
          const json_data = {
            expense_type: new_expense.expense_type,
            description: new_expense.description,
            amount: new_expense.amount,
            needy_id: needy_id,
          };
          
          const res = await expenseStore.addExpense(json_data);
          if (res !== 200) {
            throw new Error('תקלה בהוספת הוצאה');
          }
        }
  
        // עדכון הוצאות
        for (const expense_to_update of updatesExpenses) {
          const res = await expenseStore.updateExpense(expense_to_update);
          if (res !== 200) {
            throw new Error('תקלה בעדכון הוצאה');
          }
        }
  
        // מחיקת הוצאות
        for (const expense_to_delete of deleteExpenses) {
          const res = await expenseStore.deleteExpense(expense_to_delete);
          if (res !== 200) {
            throw new Error('תקלה במחיקת הוצאה');
          }
        }  
        console.log("Submitted Data:", formData);

        Swal.fire({
          title: "עידכון",
          text: "פרטי הנצרך עודכנו בהצלחה",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error occurred:", error);
      Swal.fire({
        title: "תקלה",
        text: error.message || "תקלה בעת עדכון הנתונים",
        icon: "error",
        timer: 4000,
      });
    }
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "row",
            margin: "0 auto",
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
            boxShadow: 1,
            gap: 1,
            width: "100%",
          }}
        >
          <div>
            {" "}
            <Typography variant="h6" sx={{ mb: 1 }}>
              הכנסות
            </Typography>
            <Divider sx={{ my: 1 }} />
            {formData.husbandIncome.length === 0 && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => addArrayItem("husband", "income")}
              >
                הוסף הכנסת בעל
              </Button>
            )}
            {formData.husbandIncome.map((item, index) => (
              <Box
                key={`husband-${index}`}
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 1,
                }}
              >
                <TextField
                  label="הכנסת בעל"
                  value={item.description}
                  onChange={(e) =>
                    handleArrayChange(
                      item.id,
                      "description",
                      e.target.value,
                      "husbandIncome"
                    )
                  }
                  required
                  sx={{ mb: 1, width: "45%" }}
                  inputProps={{ min: 0 }}
                />
                <TextField
                  label="שכר חודשי"
                  value={item.amount}
                  type="number"
                  required
                  onChange={(e) =>
                    handleArrayChange(
                      item.id,
                      "amount",
                      e.target.value,
                      "husbandIncome"
                    )
                  }
                  sx={{ width: "45%" }}
                />
                <Button onClick={() => addArrayItem("husband", "income")}>
                  הוסף
                </Button>
                <Button
                  color="error"
                  onClick={() => handleDeleteIncome(index, "husbandIncome")}
                >
                  הסר
                </Button>
              </Box>
            ))}
            {formData.wifeIncome.length === 0 && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => addArrayItem("wife", "income")}
              >
                הוסף הכנסת אישה
              </Button>
            )}
            {formData.wifeIncome.map((item, index) => (
              <Box
                key={`wife-${index}`}
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 1,
                }}
              >
                <TextField
                  label="הכנסת אישה"
                  value={item.description}
                  onChange={(e) =>
                    handleArrayChange(
                      item.id,
                      "description",
                      e.target.value,
                      "wifeIncome"
                    )
                  }
                  // required
                  sx={{ mb: 1, width: "45%" }}
                />
                <TextField
                  label="שכר חודשי"
                  value={item.amount}
                  type="number"
                  // required
                  onChange={(e) =>
                    handleArrayChange(
                      item.id,
                      "amount",
                      e.target.value,
                      "wifeIncome"
                    )
                  }
                  sx={{ width: "45%" }}
                />
                <Button onClick={() => addArrayItem("wife", "income")}>
                  הוסף
                </Button>
                <Button
                  color="error"
                  onClick={() => handleDeleteIncome(index, "wifeIncome")}
                >
                  הסר
                </Button>
              </Box>
            ))}
            <Box>
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                הכנסות וקצבאות נוספות
              </Typography>
              {formData.additionalIncomesAndBenefits.map((item, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    label="תיאור"
                    value={item.description}
                    onChange={(e) =>
                      handleArrayChange(
                        item.id,
                        "description",
                        e.target.value,
                        "additionalIncomesAndBenefits"
                      )
                    }
                  />
                  <TextField
                    label="סכום"
                    type="number"
                    value={item.amount}
                    onChange={(e) =>
                      handleArrayChange(
                        item.id,
                        "amount",
                        e.target.value,
                        "additionalIncomesAndBenefits"
                      )
                    }
                  />
                  <Button
                    color="error"
                    onClick={() =>
                      handleDeleteIncome(index, "additionalIncomesAndBenefits")
                    }
                  >
                    הסר
                  </Button>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => addArrayItem("additionalIncomes", "income")}
              >
                הוסף הכנסה או קצבה
              </Button>
            </Box>
            <Typography variant="h6" sx={{ mt: 3 }}>
              תמיכות
            </Typography>
            {formData.support.map((support, index) => (
              <Box
                key={`support-${index}`}
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  // flexDirection: "row-reverse",
                }}
              >
                <TextField
                  label="שם תמיכה"
                  value={support.description}
                  onChange={(e) =>
                    handleArrayChange(
                      support.id,
                      "description",
                      e.target.value,
                      "support"
                    )
                  }
                />
                <TextField
                  label="סכום תמיכה"
                  value={support.amount}
                  type="number"
                  onChange={(e) =>
                    handleArrayChange(
                      support.id,
                      "amount",
                      e.target.value,
                      "support"
                    )
                  }
                />
              </Box>
            ))}
            <Button
              onClick={() => addArrayItem("support", "income")}
              variant="outlined"
            >
              הוסף תמיכה
            </Button>
            <Typography variant="h6" sx={{ mt: 3 }}>
              סה"כ הכנסה חודשית: {monthlyIncome || 0}
            </Typography>
          </div>

          <div>
            <Typography variant="h6" sx={{ mb: 1 }}>
              הוצאות
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Box>
              {formData.housingExpenses.length === 0 && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => addArrayItem("housing", "expense")}
                >
                  הוסף הוצאות דיור
                </Button>
              )}
            </Box>
            {formData.housingExpenses.map((item, index) => (
              <Box
                key={`housing-${index}`}
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 1,
                }}
              >
                <TextField
                  label="הוצאות דיור"
                  value={item.description}
                  onChange={(e) =>
                    handleExpenseChange(
                      item.id,
                      "description",
                      e.target.value,
                      "housingExpenses"
                    )
                  }
                  // required
                  sx={{ mb: 1, width: "45%" }}
                />
                <TextField
                  label="שכר חודשי"
                  value={item.amount}
                  type="number"
                  // required
                  onChange={(e) =>
                    handleExpenseChange(
                      item.id,
                      "amount",
                      e.target.value,
                      "housingExpenses"
                    )
                  }
                  sx={{ width: "45%" }}
                />
                <Button onClick={() => addArrayItem("housing", "expense")}>
                  הוסף
                </Button>
                <Button
                  color="error"
                  onClick={() => handleDeleteExpense(index, "housingExpenses")}
                >
                  הסר
                </Button>
              </Box>
            ))}
            <Box>
              {formData.healthExpense.length === 0 && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => addArrayItem("health", "expense")}
                >
                  הוסף הוצאות רפואה
                </Button>
              )}
            </Box>
            {formData.healthExpense.map((item, index) => (
              <Box
                key={`health-${index}`}
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 1,
                }}
              >
                <TextField
                  label="הוצאות רפואה"
                  value={item.description}
                  onChange={(e) =>
                    handleExpenseChange(
                      item.id,
                      "description",
                      e.target.value,
                      "healthExpense"
                    )
                  }
                  // required
                  sx={{ mb: 1, width: "45%" }}
                />
                <TextField
                  label="שכר חודשי"
                  value={item.amount}
                  type="number"
                  // required
                  onChange={(e) =>
                    handleExpenseChange(
                      item.id,
                      "amount",
                      e.target.value,
                      "healthExpense"
                    )
                  }
                  sx={{ width: "45%" }}
                />
                <Button onClick={() => addArrayItem("health", "expense")}>
                  הוסף
                </Button>
                <Button
                  color="error"
                  onClick={() => handleDeleteExpense(index, "healthExpense")}
                >
                  הסר
                </Button>
              </Box>
            ))}

            <Box>
              {formData.totalDebt.map((item, index) => (
                <Box
                  key={`totalDebt-${index}`}
                  sx={{
                    display: "flex",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <TextField
                    label="סך חובות"
                    value={item.description}
                    onChange={(e) =>
                      handleExpenseChange(
                        item.id,
                        "description",
                        e.target.value,
                        "totalDebt"
                      )
                    }
                    required
                    sx={{ mb: 1, width: "45%" }}
                  />
                  <TextField
                    label="סך החובות"
                    value={item.amount}
                    type="number"
                    onChange={(e) =>
                      handleExpenseChange(
                        item.id,
                        "amount",
                        e.target.value,
                        "totalDebt"
                      )
                    }
                    sx={{ width: "45%" }}
                  />
                  <Button
                    color="error"
                    onClick={() => handleDeleteExpense(item.id, "totalDebt")}
                  >
                    הסר
                  </Button>
                </Box>
              ))}

              {formData.debtMonthlyRepayment.map((item, index) => (
                <Box
                  key={`debtMonthlyRepayment-${index}`}
                  sx={{
                    display: "flex",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <TextField
                    label="החזר חובות חודשי"
                    value={item.description}
                    onChange={(e) =>
                      handleExpenseChange(
                        item.id,
                        "description",
                        e.target.value,
                        "debtMonthlyRepayment"
                      )
                    }
                    required
                    sx={{ mb: 1, width: "45%" }}
                  />
                  <TextField
                    label="החזר חובות חודשי"
                    value={item.amount}
                    type="number"
                    onChange={(e) =>
                      handleExpenseChange(
                        item.id,
                        "amount",
                        e.target.value,
                        "debtMonthlyRepayment"
                      )
                    }
                    sx={{ width: "45%" }}
                  />
                  <Button
                    color="error"
                    onClick={() =>
                      handleDeleteExpense(item.id, "debtMonthlyRepayment")
                    }
                  >
                    הסר
                  </Button>
                </Box>
              ))}

              {!formData.totalDebt.length === 0 && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    addArrayItem("totalDebt", "expense");
                    addArrayItem("debtMonthlyRepayment", "expense");
                  }}
                >
                  הוסף החזר חובות
                </Button>
              )}
            </Box>

            <Typography variant="h6" sx={{ mt: 3 }}>
              סה"כ הוצאה חודשית: {monthlyExpenses || 0}
            </Typography>
            <Typography variant="h5" sx={{ mt: 3 }} color="primary">
              סה"כ מאזן משפחתי:{totalMonthlyIncome || 0}
            </Typography>
          </div>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            type="submit"
            onClick={handleSubmit}
          >
            שמור מאזן חודשי
          </Button>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default IncomeAndExpenses;
