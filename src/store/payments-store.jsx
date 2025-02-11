import { makeObservable, runInAction, observable, computed, action } from "mobx";
import Swal from "sweetalert2";

// נתיב ה-API שלך
const baseServerURL = "http://127.0.0.1:8000";
const baseUrl = `${baseServerURL}/payment/`;

// פונקציה לעיבוד המידע
const extractRawData = (proxyObject) => {
    if (proxyObject && proxyObject.data) {
        return proxyObject.data;
    } else {
        return proxyObject;
    }
};

class PaymentStore {

    isError = false;
    isLoading = false;
    errorMessage = "";

    constructor() {
        makeObservable(this, {
            isError: observable,
            isLoading: observable,
            errorMessage: observable,

        });
        
    }

    
    async addPayment(new_payment) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");


        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(new_payment),
            redirect: "follow"
        };

        try {
            const response = await fetch(`${baseUrl}add-payment`, requestOptions);

            if (!response.ok) {
                throw new Error(`שגיאה בהוספת תשלום: ${response.statusText}`);
            }  
        } catch (error) {
            console.error("שגיאה בשמירה:", error);
            throw error
        }
    }

    

}

const paymentStore = new PaymentStore();
export default paymentStore;
