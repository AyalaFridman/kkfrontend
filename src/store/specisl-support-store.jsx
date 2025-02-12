import { makeObservable, runInAction, observable, computed, action } from "mobx";
import Swal from "sweetalert2";

// נתיב ה-API שלך
const baseServerURL = "http://kkbackend-production.up.railway.app";
const baseUrl = `${baseServerURL}/specialSupport/`;

// פונקציה לעיבוד המידע
const extractRawData = (proxyObject) => {
    if (proxyObject && proxyObject.data) {
        return proxyObject.data;
    } else {
        return proxyObject;
    }
};

class SpecialSupportedStore {
    specialSupportedList = [];
    currentSpecialSupported = null;
    needySpecialSupports = []
    isError = false;
    isLoading = false;
    errorMessage = "";

    constructor() {
        makeObservable(this, {
            specialSupportedList: observable,
            isError: observable,
            isLoading: observable,
            errorMessage: observable,
            fetchSpecialSupportedList: action,
            getSpecialSupportedList: computed,
        });
        this.fetchSpecialSupportedList();
    }

    async fetchSpecialSupportedList() {
        this.isLoading = true;
        try {
            const res = await fetch(`${baseUrl}get-all-special_supports`);
            const data = await res.json();
            runInAction(() => {
                this.isLoading = false;
                this.specialSupportedList = data;
            });
        } catch (error) {
            runInAction(() => {
                this.isError = true;
                this.isLoading = false;
                this.errorMessage = "Error fetching special supported data!";
            });
            console.error("Failed to fetch special supported list:", error);
            Swal.fire({
                icon: "error",
                title: "Oops, error fetching data...",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }

    async fetchSpecialSupportedNeedyList(needy_id) {
        console.log("in special");
        
        this.isLoading = true;
        try {
            const res = await fetch(`${baseUrl}get-all-needy-speciel-supports/${needy_id}`);
            const data = await res.json();
            
            runInAction(() => {
                this.isLoading = false;
                this.needySpecialSupports = data;
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



    get getSpecialSupportedList() {
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

    
    async addSpecialSupported(new_special_supported) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        console.log(new_special_supported);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(new_special_supported),
            redirect: "follow"
        };

        try {
            const response = await fetch(`${baseUrl}add-special_support`, requestOptions);

            if (!response.ok) {
                throw new Error(`שגיאה בהוספת הפרויקט: ${response.statusText}`);
            }  
        } catch (error) {
            console.error("שגיאה בשמירה:", error);
            throw error
        }
    }

    async deleteSupported(supported_id) {
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };

        fetch(`${baseUrl}delete-supported/${supported_id}`, requestOptions)
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

const specialSupportedStore = new SpecialSupportedStore();
export default specialSupportedStore;
