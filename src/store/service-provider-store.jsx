import {
    makeObservable,
    runInAction,
    observable,
    computed,
    action,
} from "mobx";
import Swal from "sweetalert2";

// נתיב ה-API שלך
const baseServerURL = "http://127.0.0.1:8000";
const baseUrl = `${baseServerURL}/serviceProvider/`;

// פונקציה לעיבוד המידע
const extractRawData = (proxyObject) => {
    if (proxyObject && proxyObject.data) {
        return proxyObject.data;
    } else {
        return proxyObject;
    }
};

class ServiceProviderStore {
    serviceProviderList = [];
    currentServiceProvider = null;
    isError = false;
    isLoading = false;
    errorMessage = "";

    constructor() {
        makeObservable(this, {
            serviceProviderList: observable,
            isError: observable,
            isLoading: observable,
            errorMessage: observable,
            fetchServiceProviderList: action,
            getServiceProviderList: computed,
        });
        this.fetchServiceProviderList();
    }

    async fetchServiceProviderList() {
        this.isLoading = true;
        try {
            const res = await fetch(`${baseUrl}get-all-service_providers`);
            const data = await res.json();
            runInAction(() => {
                this.serviceProviderList = data;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.isError = true;
                this.isLoading = false;
                this.errorMessage = "Error fetching service providers data!";
            });
            Swal.fire({
                icon: "error",
                title: "Oops, error fetching data...",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }

    get getServiceProviderList() {
        return this.serviceProviderList;
    }
    // שליפת נתון לפי ID
    async getServiceProviderById(id) {
        this.isLoading = true;
        this.isError = false;
        try {
            const res = await fetch(`${baseUrl}get-service_provider-by-id/${id}`);
            const data = await res.json();
            this.currentServiceProvider = data;
            // console.log("currentServiceProvider",data);
            
        } catch (error) {
            this.isError = true;
            this.errorMessage = error.message;
        } finally {
            this.isLoading = false;
        }
    }

    async createServiceProvider(new_service_provider) {
        console.log("@@@@", new_service_provider);
        
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(new_service_provider),
            redirect: "follow"
        };
        try {
            const response = await fetch(`${baseUrl}add-service_provider`, requestOptions);

            if (!response.ok) {
                throw new Error(`שגיאה בהוספת נותן השירות: ${response.statusText}`);
            }  
        } catch (error) {
            console.error("שגיאה בשמירה:", error);
            throw error
        }
    }
    async deleteServicProvider(ids) {
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };

        fetch(`${baseUrl}delete-service_provider/${ids}`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }
    // async updadeIncomesAndEepenses() { }
    // async updateNeedy(id, updatedData) {
    //     try {
    //         console.log("in update needy");
    //         const res = await fetch(`${baseUrl}put-needy/${id}`, {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(updatedData),
    //         });
    //         return res.status;
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    // async updateBankDetial(id, updatedData) {
    //     try {
    //         console.log("in store");

    //         const res = await fetch(`${baseServerURL}/account/update-account/${id}`, {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(updatedData),
    //         });
    //         return res.status;
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    // async add_child(new_child) {
    //     try {
    //         console.log("in store");

    //         const res = await fetch(`${baseServerURL}/child/post-child`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(new_child)
    //         })
    //         return res.status
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    // setNeedyList(newList) {
    //     this.needyList = newList;
    // }
}
const serviceProviderStore = new ServiceProviderStore();
export default serviceProviderStore;
