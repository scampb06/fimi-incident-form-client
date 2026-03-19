/**
 * DOCX Summary Table Module
 * Handles creation of the summary table for the Word document
 */

// Helper function to create paragraphs with preserved line breaks
function createTextWithLineBreaks(text, fontSize = 22, bold = false) {
    if (!text) {
        return [new docx.Paragraph({
            children: [new docx.TextRun({ text: "", font: "Times New Roman", size: fontSize })]
        })];
    }
    
    // Split text by various line break patterns
    const lines = text.split(/\r?\n|\r/);
    const paragraphs = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Create a paragraph for each line (even if empty)
        paragraphs.push(new docx.Paragraph({
            children: [
                new docx.TextRun({
                    text: line,
                    font: "Times New Roman",
                    size: fontSize,
                    bold: bold
                })
            ]
        }));
    }
    
    return paragraphs;
}

// Create Summary Table
function createSummaryTable(formData, noBorders) {
    const table = new docx.Table({
        width: { size: 100, type: docx.WidthType.PERCENTAGE },
        borders: noBorders,
        rows: [
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        columnSpan: 8,
                        shading: { fill: "8EAADB" },
                        borders: noBorders,
                        margins: { top: 0, bottom: 0, left: 0, right: 0 },
                        children: [
                            new docx.Paragraph({
                                children: [
                                    new docx.TextRun({
                                        text: "Summary",
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
            new docx.TableRow({
                children: [
                    new docx.TableCell({
                        columnSpan: 8,
                        width: { size: 100, type: docx.WidthType.PERCENTAGE },
                        borders: noBorders,
                        margins: { top: 0, bottom: 0, left: 0, right: 0 },
                        verticalAlign: docx.VerticalAlign.BOTTOM,
                        children: createTextWithLineBreaks(formData.summary, 22, false),
                    }),
                ],
            }),              
        ],
    });

    console.log("Summary Table processed successfully.");
    return table;
}