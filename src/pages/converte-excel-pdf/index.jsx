import React, { useState } from "react";
import { read, utils } from "xlsx";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";

const Converteexcelpdf = () => {
    const [file, setFile] = useState(null)
    const [excelPreview, setExcelPreview] = useState(null);
    const [progress, setProgress] = useState(0);
    const [converted, setConverted] = useState(false);

    // Função que lida com o upload do arquivo
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log(selectedFile);
        
        if (selectedFile && selectedFile.type.includes("excel")) {
            setFile(selectedFile);
            setExcelPreview(URL.createObjectURL(selectedFile));
        }
    };

    // Função que processa o arquivo Excel e converte para PDF
    const convertToPDF = () => {
        if (!file) return;

        const reader = new FileReader();
        console.log(reader);
        
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = utils.sheet_to_json(worksheet, {header: 1});

            const doc = new jsPDF();
            jsonData.forEach((row, index) => {
                doc.text(row.join(" "), 10, 10 + index * 10); // Adiciona o conteúdo Excel no PDF
            });

            setProgress(100); // Atualiza a barra de progresso para 100%
            setConverted(true);

            const pdfBlob = doc.output("blob");
            saveAs(pdfBlob, "converted_file.pdf"); // Faz o download do arquivo automaticamente
        };

        reader.readAsArrayBuffer(file);
        setProgress(50); // Atualiza a barra de progresso para 50% durante o processamento
    };

    // Função para baixar o PDF convertido manualmente
    const downloadPDF = () => {
        if (!file) {
            alert("Por favor, envie um arquivo primeiro.");
        } else if (!converted) {
            alert("Por favor, converta o arquivo primeiro.")
        }
    };

    return(
        <div>
            <h1>Conversor de Excel para PDF</h1>
            <div className="upload-section" style={{border: "2px dashed #ccc", padding: "20px", width: "300px"}}>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} style={{display: "none"}} id="fileInput" />
                <label htmlFor="fileInput" style={{cursor: "pointer"}}>
                    Arraste ou clique para anexar um arquivo Excel
                </label>
            </div>

            {excelPreview && (
                <div className="card" style={{marginTop: "20px"}}>
                    <h3>Arquivo Anexado:</h3>
                    <img src={excelPreview} alt="Excel preview" style={{width: "100px", height: "100px"}}/>
                </div>
            )}

            <button onClick={convertToPDF} style={{marginTop: "20px"}}>
                Converter para PDF
            </button>
            <div style={{marginTop: "20px", width: "300px", backgroundColor: "#f3f3f3", height: "20px", position: "relative"}}>
                <div style={{width: `${progress}%`, height: "100%", backgroundColor: "#4caf50", transition: "width 0.5s"}}/>
            </div>
            {converted && (
                <div style={{marginTop: "20px"}}>
                    <button onClick={downloadPDF}>Baixar PDF</button>
                </div>
            )}
        </div>        
    );
}

export default Converteexcelpdf;