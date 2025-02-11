import React, { createContext, useContext, useState } from "react";

// יצירת Context
const SaveDataContext = createContext();

// Provider לניהול State מרכזי
export const FileProvider = ({ children }) => {
    const [savedData, setSavedData] = useState([]);

    // פונקציה לשמירת מידע
    const saveData = (data) => {
        setSavedData((prevData) => [...prevData, data]);
    };

    // פונקציה להחזרת כל המידע
    const getData = () => savedData;

    return (
        <SaveDataContext.Provider value={{ saveData, getData }}>
            {children}
        </SaveDataContext.Provider>
    );
};

// שימוש ב-Custom Hook כדי לגשת ל-Context
export const useSaveData = () => {
    return useContext(SaveDataContext);
};
