import { makeObservable, runInAction, observable, computed, action } from "mobx";
import Swal from "sweetalert2";

const baseServerURL = "http://kkbackend-production.up.railway.app";
const baseUrl = `${baseServerURL}/expense/`;

const extractRawData = (proxyObject) => {
    if (proxyObject && proxyObject.data) {
        return proxyObject.data;
    } else {
        return proxyObject;
    }
};

class ExpensesStore {
    expensesList = [];
    currentExpenses = null;
    isError = false;
    isLoading = false;
    errorMessage = "";

    constructor() {
        makeObservable(this, {
            expensesList: observable,
            isError: observable,
            isLoading: observable,
            errorMessage: observable,
            fetchExpensesList: action,
            getExpensesList: computed,
        });
        this.fetchExpensesList();
    }

    async fetchExpensesList() {
        this.isLoading = true;
        try {
            const res = await fetch(`${baseServerURL}/fund/get-all-funds`);
            const data = await res.json();
            runInAction(() => {
                this.expensesList = data;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.isError = true;
                this.isLoading = false;
                this.errorMessage = "Error fetching fund data!";
            });
            console.error("Failed to fetch fund list:", error);
            Swal.fire({
                icon: "error",
                title: "Oops, error fetching data...",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }



    get getExpensesList() {
        return this.fundList;
    }
    async addExpense(new_expense) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");


        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(new_expense),
            redirect: "follow"
        };

        try {
            const response = await fetch(`${baseUrl}add-expense`, requestOptions);

            if (!response.ok) {
                throw new Error(`שגיאה בהוספת הכנסה: ${response.statusText}`);
            }
        } catch (error) {
            console.error("שגיאה בשמירה:", error);
            throw error
        }
    }

    async deleteExpense(expense_id) {
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };

        fetch(`${baseUrl}delete-expense/${expense_id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

    async updateExpense(update_expense) {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(update_expense),
            redirect: "follow"
        };

        fetch(`${baseUrl}update-expense`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

}

const expenseStore = new ExpensesStore();
export default expenseStore;
