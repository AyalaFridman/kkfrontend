import {
  makeObservable,
  runInAction,
  observable,
  computed,
  action,
} from "mobx";
import Swal from "sweetalert2";

// נתיב ה-API שלך
const baseServerURL = "http://kkbackend-production.up.railway.app";
const baseUrl = `${baseServerURL}/donor/`;

// פונקציה לעיבוד המידע
const extractRawData = (proxyObject) => {
  if (proxyObject && proxyObject.data) {
    return proxyObject.data;
  } else {
    return proxyObject;
  }
};

class DonorStore {
  donorsList = [];
  donorKevaList = [];
  regDonationList = [];
  bankDonationList = [];
  currentDonor = null;
  currentDonorKeva = [];
  isError = false;
  isLoading = false;
  errorMessage = "";

  constructor() {
    makeObservable(this, {
      donorsList: observable,
      isError: observable,
      isLoading: observable,
      errorMessage: observable,
      fetchDonorsList: action,
      getDonorsList: computed,
    });
    this.fetchDonorsList();
  }

  async fetchDonorsList() {
    this.isLoading = true;
    try {
      const res = await fetch(`${baseUrl}get-all-donors`);
      const data = await res.json();
      runInAction(() => {
        this.donorsList = data;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isError = true;
        this.isLoading = false;
        this.errorMessage = "Error fetching Project data!";
      });
      console.error("Failed to fetch donors list:", error);
      Swal.fire({
        icon: "error",
        title: "Oops, error fetching data...",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  get getDonorsList() {
    return this.donorsList;
  }

  async fetchBankDonationList() {
    this.isLoading = true;
    try {
      const res = await fetch(`${baseUrl}get-bank-donation`);
      const data = await res.json();
      runInAction(() => {
        this.bankDonationList = data;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isError = true;
        this.isLoading = false;
        this.errorMessage = "Error fetching Project data!";
      });
      console.error("Failed to fetch donors list:", error);
      Swal.fire({
        icon: "error",
        title: "Oops, error fetching data...",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  async fetchDonorsKevaList() {
    this.isLoading = true;
    try {
      const res = await fetch(`${baseUrl}get-donors-keva`);
      const data = await res.json();
      runInAction(() => {
        this.donorKevaList = data;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isError = true;
        this.isLoading = false;
        this.errorMessage = "Error fetching Project data!";
      });
      console.error("Failed to fetch donors list:", error);
      Swal.fire({
        icon: "error",
        title: "Oops, error fetching data...",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  async fetchRegDonation() {
    this.isLoading = true;
    try {
      const res = await fetch(`${baseUrl}get-reg-donation`);
      const data = await res.json();
      runInAction(() => {
        this.regDonationList = data;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isError = true;
        this.isLoading = false;
        this.errorMessage = "Error fetching Project data!";
      });
      console.error("Failed to fetch reg donation:", error);
      Swal.fire({
        icon: "error",
        title: "Oops, error fetching data...",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  async fetchDonorsKevaDetails(donor_id) {
    this.isLoading = true;
    try {
      const res = await fetch(`${baseUrl}get-donor-keva-by-id/${donor_id}`);
      const data = await res.json();
      console.log(data);

      runInAction(() => {
        this.currentDonorKeva = data;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isError = true;
        this.isLoading = false;
        this.errorMessage = "Error fetching donor data!";
      });
      console.error("Failed to fetch donors list:", error);
      Swal.fire({
        icon: "error",
        title: "Oops, error fetching data...",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  async fetchDonorDetails(donor_id) {
    this.isLoading = true;
    try {
      const res = await fetch(`${baseUrl}get-donor-by-id/${donor_id}`);
      const data = await res.json();
      runInAction(() => {
        this.currentDonor = data;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isError = true;
        this.isLoading = false;
        this.errorMessage = "Error fetching donor data!";
      });
      console.error("Failed to fetch donors :", error);
      Swal.fire({
        icon: "error",
        title: "Oops, error fetching data...",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  async addDonor(new_donor) {  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(new_donor),
      redirect: "follow",
    };
    try {
      const response = await fetch(`${baseUrl}add-donor`, requestOptions);

      if (!response.ok) {
        console.log(response);
        
        throw new Error(`שגיאה בהוספת תרומה: ${response.detials}`);
      }
    } catch (error) {
      console.error("שגיאה בשמירה:", error);
      throw error;
    }
  }
  async IssuingAReceipt(receiptData) {
    console.log("receiptData",receiptData);
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(receiptData),
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${baseUrl}create-recepit`,
        requestOptions
      );
      if (response.ok) {
        const response_data = await response.json();
        return response_data["pdf_link_copy"];
      }
      if (!response.ok) {
        throw new Error(`שגיאה בהוספת תרומה: ${response.statusText}`);
      }
    } catch (error) {
      console.error("שגיאה בשמירה:", error);
      throw error;
    }
  }

  async addBankDonation(new_bank_donation) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(new_bank_donation),
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${baseUrl}add-bank-donation`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`שגיאה בהוספת תרומה: ${response.statusText}`);
      }
    } catch (error) {
      console.error("שגיאה בשמירה:", error);
      throw error;
    }
  }
}

const donorStore = new DonorStore();
export default donorStore;
