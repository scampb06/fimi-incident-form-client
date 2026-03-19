/**
 * DOCX Header Tables Module
 * Handles creation of header tables for the Word document
 */

// Create Header Tables (Top and Bottom)
function createHeaderTables(formData, noBorders) {
    const headerTopTable = new docx.Table({
        width: { size: 100, type: docx.WidthType.PERCENTAGE },
        borders: noBorders,
        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        shading: { fill: "8EAADB" },
                        borders: noBorders,
                        columnSpan: 3,
                        width: { size: 30, type: docx.WidthType.PERCENTAGE },
                        margins: { top: 0, bottom: 0, left: 0, right: 0 },
                        children: [
                            new docx.Paragraph({
                                children: [
                                    new docx.TextRun({
                                        text: `CDN Incident Alert: ${formData.incidentNumber}`,
                                        bold: true,
                                        font: "Times New Roman",
                                        size: 22,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new docx.TableCell({
                        shading: { fill: "8EAADB" },
                        borders: noBorders,
                        columnSpan: 2,
                        margins: { top: 0, bottom: 0, left: 0, right: 0 },
                        children: [
                            new docx.Paragraph({
                                children: [
                                    new docx.TextRun({
                                        text: `${formData.tlpLevel}`, 
                                        bold: false,
                                        font: "Times New Roman",
                                        size: 22,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new docx.TableCell({
                        shading: { fill: "8EAADB" },
                        borders: noBorders,
                        margins: { top: 0, bottom: 0, left: 0, right: 0 },
                        columnSpan: 2,
                        width: { size: 15, type: docx.WidthType.PERCENTAGE },
                        children: [
                            new docx.Paragraph({
                                alignment: docx.AlignmentType.RIGHT,
                                children: [
                                    new docx.TextRun({
                                        text: "Date", 
                                        bold: false,
                                        font: "Times New Roman",
                                        size: 22,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });

    const blankPara = new docx.Paragraph({ text: "", spacing: { after: 0, before: 0 } });
    const blankRow = new docx.TableRow({
        children: [new docx.TableCell({ columnSpan: 8, children: [blankPara], borders: noBorders })],
    });

    const headerBottomTable = new docx.Table({
        width: { size: 100, type: docx.WidthType.PERCENTAGE },
        borders: noBorders,
        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        columnSpan: 1,
                        width: { size: 10, type: docx.WidthType.PERCENTAGE },
                        shading: { fill: "8EAADB" },
                        borders: noBorders,
                        margins: { top: 0, bottom: 0, left: 0, right: 0 },
                        verticalAlign: docx.VerticalAlign.BOTTOM,
                        children: [
                            new docx.Paragraph({
                                children: [
                                    new docx.TextRun({
                                        text: "Title",
                                        bold: true,
                                        font: "Times New Roman",
                                        size: 22,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new docx.TableCell({
                        columnSpan: 1,
                        width: { size: 10, type: docx.WidthType.PERCENTAGE },
                        borders: noBorders,
                        margins: { top: 0, bottom: 0, left: 0, right: 0 },
                        verticalAlign: docx.VerticalAlign.BOTTOM,
                        children: [
                            new docx.Paragraph({
                                children: [
                                    new docx.TextRun({
                                        text: " " + formData.country,
                                        bold: false,
                                        font: "Times New Roman",
                                        size: 22,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new docx.TableCell({
                        columnSpan: 3,
                        width: { size: 65, type: docx.WidthType.PERCENTAGE },
                        borders: noBorders,
                        margins: { top: 0, bottom: 0, left: 0, right: 0 },
                        verticalAlign: docx.VerticalAlign.BOTTOM,
                        children: [
                            new docx.Paragraph({
                                children: [
                                    new docx.TextRun({
                                        text: formData.title,
                                        bold: false,
                                        font: "Times New Roman",
                                        size: 22,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new docx.TableCell({
                        columnSpan: 3,
                        width: { size: 15, type: docx.WidthType.PERCENTAGE },
                        borders: noBorders,
                        margins: { top: 0, bottom: 0, left: 0, right: 0 },
                        verticalAlign: docx.VerticalAlign.BOTTOM,
                        children: [
                            new docx.Paragraph({
                                alignment: docx.AlignmentType.RIGHT,
                                children: [
                                    new docx.TextRun({
                                        text: formData.date,
                                        bold: false,
                                        font: "Times New Roman",
                                        size: 22,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            blankRow,
        ],
    });

    console.log("Header tables processed successfully.");
    return { headerTopTable, headerBottomTable, blankPara, blankRow };
}