import { makeObservable, runInAction, observable, computed, action } from "mobx";
import Swal from "sweetalert2";

// נתיב ה-API שלך
const baseServerURL = "http://127.0.0.1:8000";
const baseUrl = `${baseServerURL}/project/`;

// פונקציה לעיבוד המידע
const extractRawData = (proxyObject) => {
    if (proxyObject && proxyObject.data) {
        return proxyObject.data;
    } else {
        return proxyObject;
    }
};

class ProjectStore {
    projectList = [];
    currentProject = null;
    currentProjectAllocations = [];
    isError = false;
    isLoading = false;
    errorMessage = "";

    constructor() {
        makeObservable(this, {
            projectList: observable,
            isError: observable,
            isLoading: observable,
            errorMessage: observable,
            fetchProjectList: action,
            getProjectList: computed,
        });
        this.fetchProjectList();
    }

    async fetchProjectList() {
        this.isLoading = true;
        try {
            const res = await fetch(`${baseUrl}get-all-projects`);
            const data = await res.json();
            runInAction(() => {
                this.projectList = data;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.isError = true;
                this.isLoading = false;
                this.errorMessage = "Error fetching Project data!";
            });
            console.error("Failed to fetch Project list:", error);
            Swal.fire({
                icon: "error",
                title: "Oops, error fetching data...",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }



    get getProjectList() {
        return this.projectList;
    }
    // שליפת נתון לפי ID
    async getProjectById(id) {
        this.isLoading = true;
        this.isError = false;
        try {
            const res = await fetch(`${baseUrl}get-project-by-id/${id}`);
            const data = await res.json();// קריאה לפונקציה get_by_id ב-API
            this.currentProject = data;
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
            const res = await fetch(`${baseUrl}get-project-by-id/${id}`);
            const data = await res.json();
            this.currentProject = data;
            const res1 = await fetch(`${baseUrl}get-project-allocation/${id}`);
            const data1 = await res1.json();
            this.currentProjectAllocations = data1;
        } catch (error) {
            this.isError = true;
            this.errorMessage = error.message;
        } finally {
            this.isLoading = false;
        }
    }

    async addProject(new_project) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");


        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(new_project),
            redirect: "follow"
        };

        try {
            const response = await fetch(`${baseUrl}add-project`, requestOptions);

            if (!response.ok) {
                throw new Error(`שגיאה בהוספת הפרויקט: ${response.statusText}`);
            }  
        } catch (error) {
            console.error("שגיאה בשמירה:", error);
            throw error
        }
    }

    async deleteProject(project_id) {
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };

        fetch(`${baseUrl}delete-project/${project_id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

    async updateProject(update_project) {
        
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(update_project),
            redirect: "follow"
        };
        console.log(update_project);
        
        fetch(`${baseUrl}update-project/${update_project.id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }

}

const projectStore = new ProjectStore();
export default projectStore;
