import { makeObservable, runInAction, observable, computed, action } from "mobx";
import Swal from "sweetalert2";

// נתיב ה-API שלך
const baseServerURL = "http://kkbackend-production.up.railway.app";
const baseUrl = `${baseServerURL}/support/`;

// פונקציה לעיבוד המידע
const extractRawData = (proxyObject) => {
    if (proxyObject && proxyObject.data) {
        return proxyObject.data;
    } else {
        return proxyObject;
    }
};

class SupportedStore {
    supportedList = [];
    currentSupported = null;
    currentSupportedAllocations = [];
    needySupports = []
    isError = false;
    isLoading = false;
    errorMessage = "";

    constructor() {
        makeObservable(this, {
            supportedList: observable,
            isError: observable,
            isLoading: observable,
            errorMessage: observable,
            fetchSupportedList: action,
            getSupportedList: computed,
        });
        this.fetchSupportedList();
    }

    async fetchSupportedList() {
        this.isLoading = true;
        try {
            const res = await fetch(`${baseUrl}get-all-supports`);
            const data = await res.json();
            runInAction(() => {
                this.isLoading = false;
                this.supportedList = data;
            });
        } catch (error) {
            runInAction(() => {
                this.isError = true;
                this.isLoading = false;
                this.errorMessage = "Error fetching supported data!";
            });
            console.error("Failed to fetch supported list:", error);
            Swal.fire({
                icon: "error",
                title: "Oops, error fetching data...",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }

    async fetchSupportedNeedyList(needy_id) {
        console.log("in support",needy_id);
        this.isLoading = true;
        try {
            const res = await fetch(`${baseUrl}get-all-needy-supports/${needy_id}`);
            const data = await res.json();
            
            runInAction(() => {
                this.isLoading = false;
                this.needySupports = data;
            });
        } catch (error) {
            runInAction(() => {
                this.isError = true;
                this.isLoading = false;
                this.errorMessage = "Error fetching supported data!";
            });
            console.error("Failed to fetch supported list:", error);
            Swal.fire({
                icon: "error",
                title: "Oops, error fetching data...",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }



    get getSupportedList() {
        return this.supportedList;
    }
    // שליפת נתון לפי ID
    async getSupportedById(id) {
        this.isLoading = true;
        this.isError = false;
        try {
            const res = await fetch(`${baseUrl}get-supported-by-id/${id}`);
            const data = await res.json();// קריאה לפונקציה get_by_id ב-API
            this.currentSupported = data;
        } catch (error) {
            this.isError = true;
            this.errorMessage = error.message;
        } finally {
            this.isLoading = false;
        }
    }

    async fetchAllocationSupportedList(id) {
        
        this.isLoading = true;
        this.isError = false;
        try {
            const res1 = await fetch(`${baseUrl}get-allocation-supported/${id}`);
            const data1 = await res1.json();
            this.currentSupportedAllocations = data1;
        } catch (error) {
            this.isError = true;
            this.errorMessage = error.message;
        } finally {
            this.isLoading = false;
        }
    }

    async addSupported(new_supported) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        console.log("new_supported",new_supported);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(new_supported),
            redirect: "follow"
        };

        try {
            console.log(requestOptions);
            
            const response = await fetch(`${baseUrl}add-support`, requestOptions);

            if (!response.ok) {
                throw new Error(`שגיאה בהוספת התמיכה: ${response.statusText}`);
            }  
        } catch (error) {
            console.error("שגיאה בשמירה:", error);
            throw error
        }
    }

    async deleteSupported(supported_id) {
        console.log("in delete",supported_id.id);
        
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };

        fetch(`${baseUrl}delete-support/${supported_id.id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

    async updateSupported(update_supported) {
        
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(update_supported),
            redirect: "follow"
        };
        console.log(update_supported);
        
        fetch(`${baseUrl}update-supported/${update_supported.id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

}

const supportedStore = new SupportedStore();
export default supportedStore;
