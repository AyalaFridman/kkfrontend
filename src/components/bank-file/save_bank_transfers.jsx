import React from "react";
import { useSaveData } from "./file_context";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { Button } from "@mui/material";

const DownloadButton = () => {
    const { getData } = useSaveData();

    const handleDownload = () => {
        const savedData = getData();

        if (savedData.length === 0) {
            alert("No data to download!");
            return;
        }

        const createParagraph = (text, size = 28) =>
            new Paragraph({
                bidirectional: true,
                children: [
                    new TextRun({
                        text,
                        size,
                        spacing: { after: 300 },
                    }),
                ],
            });


        const doc = new Document({
            sections: [
                {
                    properties: {
                        page: {
                            rightToLeft: true, // מגדיר RTL לכל המסמך
                        },
                    },
                    children: [

                        createParagraph("לכבוד"),
                        createParagraph("הבנק הבינלאומי"),
                        createParagraph("סניף כרמיאל"),
                        createParagraph("שלום וברכה"),
                        createParagraph("הנידון: העברות מחשבון העמותה"),
                        ...savedData.map((data, index) => {
                            return new Paragraph({
                                bidirectional: true,
                                children: [
                                    new TextRun({
                                        text: `\u200F${index + 1}: ${data.account_owner_name} בנק :  ${data.bank_number} סניף : ${data.branch_number}  מספר חשבון: ${data.account_number} סכום : ${data.amount}`,
                                        size: 26,
                                    }
                                    ),

                                ],
                            });
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    alignment: AlignmentType.CENTER, // מרכז את הטקסט
                                    // bidirectional: true,
                                    spacing: { after: 300 },
                                    text: "בברכה",
                                    size: 28,
                                }),
                            ],
                        }),
                    ]
                },
            ],
        });


        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, "טופס לבנק.docx");
        });

        savedData.length = 0;
    };

    return (
        <Button
            variant="contained"
            color="#F0EFFF"
            style={{
                fontSize: "12px",
                padding: "4px 8px",
                cursor: "pointer",
            }}
            onClick={handleDownload}>
            הורד טופס לבנק
        </Button>
    );
};

export default DownloadButton;
