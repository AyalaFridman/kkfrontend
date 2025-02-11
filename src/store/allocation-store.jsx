import { makeObservable, runInAction, observable, computed, action } from "mobx";
import Swal from "sweetalert2";

// נתיב ה-API שלך
const baseServerURL = "http://127.0.0.1:8000";
const baseUrl = `${baseServerURL}/allocation/`;

// פונקציה לעיבוד המידע
const extractRawData = (proxyObject) => {
    if (proxyObject && proxyObject.data) {
        return proxyObject.data;
    } else {
        return proxyObject;
    }
};

class AllocationStore {
    allocationList = [];
    currentallocation = null;
    isError = false;
    isLoading = false;
    errorMessage = "";

    constructor() {
        makeObservable(this, {
            allocationList: observable,
            isError: observable,
            isLoading: observable,
            errorMessage: observable,
            fetchAllocationList: action,
            getallocationList: computed,
        });
        this.fetchAllocationList();
    }

    async fetchAllocationList() {
        this.isLoading = true;
        try {
            const res = await fetch(`${baseUrl}get-all-allocations`);
            const data = await res.json();
            runInAction(() => {
                this.allocationList = data;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.isError = true;
                this.isLoading = false;
                this.errorMessage = "Error fetching allocation data!";
            });
            console.error("Failed to fetch allocation list:", error);
            Swal.fire({
                icon: "error",
                title: "Oops, error fetching data...",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }



    get getallocationList() {
        return this.allocationList;
    }
    // שליפת נתון לפי ID
    async getAllocationById(id) {
        this.isLoading = true;
        this.isError = false;
        try {
            const res = await fetch(`${baseUrl}get-allocation-by-id/${id}`);
            const data = await res.json();// קריאה לפונקציה get_by_id ב-API
            this.currentallocation = data;
        } catch (error) {
            this.isError = true;
            this.errorMessage = error.message;
        } finally {
            this.isLoading = false;
        }
    }
    async addAllocation(new_allocation) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        console.log(new_allocation);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(new_allocation),
            redirect: "follow"
        };

        try {
            const response = await fetch(`${baseUrl}add-allocation`, requestOptions);

            if (!response.ok) {
                throw new Error(`שגיאה בהוספת הפרויקט: ${response.statusText}`);
            }  
        } catch (error) {
            console.error("שגיאה בשמירה:", error);
            throw error
        }
    }

    async deleteAllocation(allocation_id) {
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };

        fetch(`${baseUrl}delete-allocation/${allocation_id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

    async updateAllocation(update_allocation) {
        
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(update_allocation),
            redirect: "follow"
        };
        console.log(update_allocation);
        
        fetch(`${baseUrl}update-allocation/${update_allocation.id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

}

const allocationStore = new AllocationStore();
export default allocationStore;
