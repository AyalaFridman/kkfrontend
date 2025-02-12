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
const baseUrl = `${baseServerURL}/needy/`;

// פונקציה לעיבוד המידע
const extractRawData = (proxyObject) => {
  if (proxyObject && proxyObject.data) {
    return proxyObject.data;
  } else {
    return proxyObject;
  }
};

class NeedyStore {
  needyList = [];
  currentNeedy = null;
  isError = false;
  isLoading = false;
  errorMessage = "";

  constructor() {
    makeObservable(this, {
      needyList: observable,
      isError: observable,
      isLoading: observable,
      errorMessage: observable,
      fetchNeedyList: action,
      getNeedyList: computed,
    });
    this.fetchNeedyList();
  }

  async fetchNeedyList() {
    this.isLoading = true;
    try {
      console.log(`${baseUrl}get-all-needy`);

      const res = await fetch(`${baseUrl}get-all-needy`);
      const data = await res.json();

      runInAction(() => {
        this.needyList = data;
        this.isLoading = false;
      });
      console.log(this.needyList);
    } catch (error) {
      runInAction(() => {
        this.isError = true;
        this.isLoading = false;
        this.errorMessage = "Error fetching needy data!";
      });
      console.error("Failed to fetch needy list:", error);
      Swal.fire({
        icon: "error",
        title: "Oops, error fetching data...",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  get getNeedyList() {
    return this.needyList;
  }
  // שליפת נתון לפי ID
  async getNeedyById(id) {
    console.log("in getbyid");

    this.isLoading = true;
    this.isError = false;
    try {
      const res = await fetch(`${baseUrl}get-needy-by-id/${id}`);
      const data = await res.json(); // קריאה לפונקציה get_by_id ב-API

      this.currentNeedy = data;
    } catch (error) {
      this.isError = true;
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }
  async getNeedyByTz(tz) {
    this.isLoading = true;
    this.isError = false;
    try {
      const res = await fetch(`${baseUrl}get-needy-by-tz/${tz}`);
      const data = await res.json();
      return data;
    } catch (error) {
      this.isError = true;
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }
  async deleteNeedies(ids) {
    try {
      const res = await fetch(`${baseUrl}delete-needy/${ids[0]}`, {
        method: "DELETE",
      });
      return res.status;
    } catch (error) {
      console.error(error);
    }
  }
  async updateStatusNeedy(id,status){
    const idNeedy=this.needyList.find((needy)=>needy.id==id).id
    console.log(status);
    
    try{
      const res = await fetch(`${baseUrl}put-needy-status/${idNeedy}?status=${status}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        }
      });
      return res.status;
    }catch (error) {
      console.error(error);
    }
  }
  async updadeIncomesAndEepenses() {}
  async updateNeedy(id, updatedData) {
    try {
      console.log("in update needy");
      const res = await fetch(`${baseUrl}put-needy/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      return res.status;
    } catch (error) {
      console.error(error);
    }
  }
  async updateBankDetial(id, updatedData) {
    try {
      console.log("in store");

      const res = await fetch(`${baseServerURL}/account/update-account/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      return res.status;
    } catch (error) {
      console.error(error);
    }
  }
  async add_child(new_child) {
    try {
      console.log("in store");
      console.log(new_child);

      const res = await fetch(`${baseServerURL}/child/post-child`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new_child),
      });
      return res.status;
    } catch (error) {
      console.error(error);
    }
  }
  async add_needy(new_needy) {
    try {
      console.log("in store");
      console.log(new_needy);
      const res = await fetch(`${baseServerURL}/needy/post-needy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new_needy),
      });
      return res.status;
    } catch (error) {
      console.error(error);
    }
  }

  setNeedyList(newList) {
    this.needyList = newList;
  }
}
const needyStore = new NeedyStore();
export default needyStore;
