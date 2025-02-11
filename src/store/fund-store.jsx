import { makeObservable, runInAction, observable, computed, action } from "mobx";
import Swal from "sweetalert2";

// נתיב ה-API שלך
const baseServerURL = "http://127.0.0.1:8000";
const baseUrl = `${baseServerURL}/fund/`;

// פונקציה לעיבוד המידע
const extractRawData = (proxyObject) => {
    if (proxyObject && proxyObject.data) {
        return proxyObject.data;
    } else {
        return proxyObject;
    }
};

class FundStore {
    fundList = [];
    directFamilyFunds = [];
    currentFundAllocations = [];
    currentfund = null;
    isError = false;
    isLoading = false;
    errorMessage = "";

    constructor() {
        makeObservable(this, {
            fundList: observable,
            isError: observable,
            isLoading: observable,
            errorMessage: observable,
            fetchFundList: action,
            getfundList: computed,
        });
        this.fetchFundList();
    }

    async fetchFundList() {
        this.isLoading = true;
        try {
            const res = await fetch(`${baseUrl}get-all-funds`);
            const data = await res.json();
            runInAction(() => {
                this.fundList = data;
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

    async fetchDirectFamilyFundList() {
        this.isLoading = true;
        try {
            const res = await fetch(`${baseUrl}get-all-direct-family-funds`);
            const data = await res.json();
            runInAction(() => {
                this.directFamilyFunds = data;
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

    get getfundList() {
        return this.fundList;
    }
    // שליפת נתון לפי ID
    async getFundById(id) {
        this.isLoading = true;
        this.isError = false;
        try {
            const res = await fetch(`${baseUrl}get-fund-by-id/${id}`);
            const data = await res.json();// קריאה לפונקציה get_by_id ב-API
            this.currentfund = data;
        } catch (error) {
            this.isError = true;
            this.errorMessage = error.message;
        } finally {
            this.isLoading = false;
        }
    }

    async fetchAllocationList(id) {

        this.isLoading = true;
        this.isError = false;
        try {
            const res = await fetch(`${baseUrl}get-fund-by-id/${id}`);
            const data = await res.json();
            this.currentProject = data;
            const res1 = await fetch(`${baseUrl}get-fund-allocation/${id}`);
            const data1 = await res1.json();
            this.currentFundAllocations = data1;
        } catch (error) {
            this.isError = true;
            this.errorMessage = error.message;
        } finally {
            this.isLoading = false;
        }
    }

    async addFund(new_fund) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        console.log(new_fund);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(new_fund),
            redirect: "follow"
        };

        try {
            const response = await fetch(`${baseUrl}add-fund`, requestOptions);

            if (!response.ok) {
                throw new Error(`שגיאה בהוספת הפרויקט: ${response.statusText}`);
            }
        } catch (error) {
            console.error("שגיאה בשמירה:", error);
            throw error
        }
    }

    async deleteFund(fund_id) {
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };

        fetch(`${baseUrl}delete-fund/${fund_id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

    async updateFund(update_fund) {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(update_fund),
            redirect: "follow"
        };
        console.log(update_fund);

        fetch(`${baseUrl}update-fund/${update_fund.id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

}

const fundStore = new FundStore();
export default fundStore;
