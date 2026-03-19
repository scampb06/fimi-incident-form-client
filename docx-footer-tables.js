/**
 * DOCX Footer Tables Module
 * Handles creation of objectives table and footer table for the Word document
 */

// Create Objectives and Footer Tables
function createObjectivesAndFooterTables(formData, noBorders, evidenceRows, imagelogo) {
    // Key Objectives table
    const objectivesTable = new docx.Table({
        width: { size: 100, type: docx.WidthType.PERCENTAGE },
        borders: noBorders,
        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        columnSpan: 3,
                        shading: { fill: "8EAADB" },
                        borders: noBorders,
                        margins: { top: 0, bottom: 0, left: 0, right: 0 },
                        children: [
                            new docx.Paragraph({
                                children: [
                                    new docx.TextRun({
                                        text: "Key Objectives and Behaviours",
                                        bold: true,
                                        font: "Times New Roman",
                                        size: 22,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            ...objectivesList.map(obj => new docx.TableRow({
                children: [
                    new docx.TableCell({
                        columnSpan: 3,
                        borders: noBorders,
                        margins: { top: 0, bottom: 0, left: 0, right: 0 },
                        children: [
                            new docx.Paragraph({
                                children: [
                                    new docx.TextRun({
                                        text: obj,
                                        font: "Times New Roman",
                                        size: 22,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            })),
            ...ttpsList.map(ttp => new docx.TableRow({
                children: [
                    new docx.TableCell({
                        columnSpan: 3,
                        borders: noBorders,
                        margins: { top: 0, bottom: 0, left: 0, right: 0 },
                        children: [
                            new docx.Paragraph({
                                children: [
                                    new docx.TextRun({
                                        text: ttp,
                                        font: "Times New Roman",
                                        size: 22,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            })),
        ],
    });

    console.log("Key Objectives Table processed successfully.");

    // Build the footerTable rows
    const footerTableRows = [
        new docx.TableRow({
            children: [
                new docx.TableCell({ 
                    width: { size: 16.6, type: docx.WidthType.PERCENTAGE }, 
                    shading: { fill: "8EAADB" }, 
                    borders: noBorders, 
                    margins: { top: 0, bottom: 0, left: 0, right: 0 }, 
                    children: [
                        new docx.Paragraph({ 
                            alignment: docx.AlignmentType.LEFT, 
                            children: [
                                new docx.TextRun({ 
                                    text: "Report", 
                                    bold: true, 
                                    font: "Times New Roman", 
                                    size: 22 
                                })
                            ] 
                        })
                    ] 
                }),
                new docx.TableCell({ 
                    width: { size: 16.6, type: docx.WidthType.PERCENTAGE }, 
                    shading: { fill: "8EAADB" }, 
                    borders: noBorders, 
                    margins: { top: 0, bottom: 0, left: 0, right: 0 }, 
                    children: [
                        new docx.Paragraph({ 
                            alignment: docx.AlignmentType.LEFT, 
                            children: [
                                new docx.TextRun({ 
                                    text: "Threat Actor", 
                                    bold: true, 
                                    font: "Times New Roman", 
                                    size: 22 
                                })
                            ] 
                        })
                    ] 
                }),
                new docx.TableCell({ 
                    width: { size: 16.7, type: docx.WidthType.PERCENTAGE }, 
                    shading: { fill: "8EAADB" }, 
                    borders: noBorders, 
                    margins: { top: 0, bottom: 0, left: 0, right: 0 }, 
                    children: [
                        new docx.Paragraph({ 
                            alignment: docx.AlignmentType.LEFT, 
                            children: [
                                new docx.TextRun({ 
                                    text: "Evidence", 
                                    bold: true, 
                                    font: "Times New Roman", 
                                    size: 22 
                                })
                            ] 
                        })
                    ] 
                }),
                new docx.TableCell({ 
                    width: { size: 16.7, type: docx.WidthType.PERCENTAGE }, 
                    shading: { fill: "8EAADB" }, 
                    borders: noBorders, 
                    margins: { top: 0, bottom: 0, left: 0, right: 0 }, 
                    children: [
                        new docx.Paragraph({ 
                            alignment: docx.AlignmentType.LEFT, 
                            children: [
                                new docx.TextRun({ 
                                    text: "Authors", 
                                    bold: true, 
                                    font: "Times New Roman", 
                                    size: 22 
                                })
                            ] 
                        })
                    ] 
                }),
                new docx.TableCell({ 
                    width: { size: 16.7, type: docx.WidthType.PERCENTAGE }, 
                    shading: { fill: "8EAADB" }, 
                    borders: noBorders, 
                    margins: { top: 0, bottom: 0, left: 0, right: 0 }, 
                    children: [
                        new docx.Paragraph({ 
                            alignment: docx.AlignmentType.LEFT, 
                            children: [
                                new docx.TextRun({ 
                                    text: "Platforms", 
                                    bold: true, 
                                    font: "Times New Roman", 
                                    size: 22 
                                })
                            ] 
                        })
                    ] 
                }),
                new docx.TableCell({ 
                    width: { size: 16.7, type: docx.WidthType.PERCENTAGE }, 
                    shading: { fill: "8EAADB" }, 
                    borders: noBorders, 
                    margins: { top: 0, bottom: 0, left: 0, right: 0 }, 
                    children: [
                        new docx.Paragraph({ 
                            alignment: docx.AlignmentType.LEFT, 
                            children: [
                                new docx.TextRun({ 
                                    text: "Logo", 
                                    bold: true, 
                                    font: "Times New Roman", 
                                    size: 22 
                                })
                            ] 
                        })
                    ] 
                })
            ]
        }),
        ...evidenceRows.map(ev => new docx.TableRow({
            children: [
                new docx.TableCell({ 
                    width: { size: 16.6, type: docx.WidthType.PERCENTAGE }, 
                    borders: noBorders, 
                    margins: { top: 0, bottom: 0, left: 0, right: 0 }, 
                    children: [
                        new docx.Paragraph({ 
                            alignment: docx.AlignmentType.LEFT, 
                            children: [
                                new docx.TextRun({ 
                                    text: ev.report, 
                                    font: "Times New Roman", 
                                    size: 22 
                                })
                            ] 
                        })
                    ] 
                }),
                new docx.TableCell({ 
                    width: { size: 16.6, type: docx.WidthType.PERCENTAGE }, 
                    borders: noBorders, 
                    margins: { top: 0, bottom: 0, left: 0, right: 0 }, 
                    children: [
                        new docx.Paragraph({ 
                            alignment: docx.AlignmentType.LEFT, 
                            children: [
                                new docx.TextRun({ 
                                    text: ev.threat, 
                                    font: "Times New Roman", 
                                    size: 22 
                                })
                            ] 
                        })
                    ] 
                }),
                new docx.TableCell({ 
                    width: { size: 16.7, type: docx.WidthType.PERCENTAGE }, 
                    borders: noBorders, 
                    margins: { top: 0, bottom: 0, left: 0, right: 0 }, 
                    children: [
                        new docx.Paragraph({ 
                            alignment: docx.AlignmentType.LEFT, 
                            children: [
                                new docx.TextRun({ 
                                    text: ev.evidence, 
                                    font: "Times New Roman", 
                                    size: 22 
                                })
                            ] 
                        })
                    ] 
                }),
                new docx.TableCell({ 
                    width: { size: 16.7, type: docx.WidthType.PERCENTAGE }, 
                    borders: noBorders, 
                    margins: { top: 0, bottom: 0, left: 0, right: 0 }, 
                    children: [
                        new docx.Paragraph({ 
                            alignment: docx.AlignmentType.LEFT, 
                            children: [
                                new docx.TextRun({ 
                                    text: ev.authors, 
                                    font: "Times New Roman", 
                                    size: 22 
                                })
                            ] 
                        })
                    ] 
                }),
                new docx.TableCell({ 
                    width: { size: 16.7, type: docx.WidthType.PERCENTAGE }, 
                    borders: noBorders, 
                    margins: { top: 0, bottom: 0, left: 0, right: 0 }, 
                    children: [
                        new docx.Paragraph({ 
                            alignment: docx.AlignmentType.LEFT, 
                            children: [
                                new docx.TextRun({ 
                                    text: ev.platforms, 
                                    font: "Times New Roman", 
                                    size: 22 
                                })
                            ] 
                        })
                    ] 
                }),
                new docx.TableCell({ 
                    width: { size: 16.7, type: docx.WidthType.PERCENTAGE }, 
                    borders: noBorders, 
                    margins: { top: 0, bottom: 0, left: 0, right: 0 }, 
                    children: [
                        new docx.Paragraph({ 
                            alignment: docx.AlignmentType.LEFT, 
                            children: imagelogo ? [imagelogo] : [] 
                        })
                    ] 
                })
            ]
        }))
    ];
    
    const footerTable = new docx.Table({
        width: { size: 100, type: docx.WidthType.PERCENTAGE },
        borders: noBorders,
        rows: footerTableRows
    });

    console.log("Footer Table processed successfully.");

    return { objectivesTable, footerTable };
}