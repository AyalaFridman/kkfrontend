import { makeObservable, runInAction, observable, computed, action } from "mobx";
import Swal from "sweetalert2";

const baseServerURL = "http://kkbackend-production.up.railway.app";
const baseUrl = `${baseServerURL}/income/`;

const extractRawData = (proxyObject) => {
    if (proxyObject && proxyObject.data) {
        return proxyObject.data;
    } else {
        return proxyObject;
    }
};

class IncomesStore {
    incomesList = [];
    currentIncomes = null;
    isError = false;
    isLoading = false;
    errorMessage = "";

    constructor() {
        makeObservable(this, {
            incomesList: observable,
            isError: observable,
            isLoading: observable,
            errorMessage: observable,
            fetchIncomesList: action,
            getIncomesList: computed,
        });
        this.fetchIncomesList();
    }

    async fetchIncomesList() {
        this.isLoading = true;
        try {
            const res = await fetch(`${baseServerURL}/fund/get-all-funds`);
            const data = await res.json();
            runInAction(() => {
                this.incomesList = data;
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



    get getIncomesList() {
        return this.fundList;
    }
    async addIncome(new_income) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");


        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(new_income),
            redirect: "follow"
        };

        try {
            const response = await fetch(`${baseUrl}add-income`, requestOptions);

            if (!response.ok) {
                throw new Error(`שגיאה בהוספת הכנסה: ${response.statusText}`);
            }
        } catch (error) {
            console.error("שגיאה בשמירה:", error);
            throw error
        }
    }

    async deleteIncome(income_id) {
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };

        fetch(`${baseUrl}delete-income/${income_id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

    async updateIncome(update_income) {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(update_income),
            redirect: "follow"
        };

        fetch(`${baseUrl}update-income`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

}

const incomeStore = new IncomesStore();
export default incomeStore;
