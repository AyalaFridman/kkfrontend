import React from "react";
import { useSaveData } from "./bank-file/file_context";
import { Button } from "@mui/material";

const ExportButton = ({ data }) => {
    const { saveData } = useSaveData();

    return (
        <Button variant="outlined"
            style={{
                fontSize: "12px",
                padding: "4px 8px",
                cursor: "pointer",
            }}
            onClick={() => saveData(data)}>הוסף העברה בנקאית</Button>
    );
};

export default ExportButton;
