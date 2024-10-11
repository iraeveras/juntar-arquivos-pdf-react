import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import Container from "../../components/container";
import Content from "../../components/content";
import Title from "../../components/title";

const Converteexcelpdf = () => {
    const [files, setFiles] = useState([]); // Armazena os arquivos Excel carregados
    const [progress, setProgress] = useState(0); // Controle da barra de progresso
    const [converting, setConverting] = useState(false); // Indica se está convertendo

    // Função chamada quando o arquivo é arrastado ou anexado
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files); // Pega arquivos carregados
        setFiles(selectedFiles);
    };

    // Função que converte o Excel para PDF
    const handleConvertToPDF = () => {
        if (files.length === 0) return;

        setConverting(true);
        setProgress(0); // Reinicia a barra de progresso

        const doc = new jsPDF(); // Cria um novo PDF

        files.forEach((file, index) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" }); // Lê o Excel

                workbook.SheetNames.forEach((sheetName) => {
                    const worksheet = workbook.Sheets[sheetName];
                    const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    // Adiciona os dados do Excel ao PDF
                    sheetData.forEach((row, rowIndex) => {
                        doc.text(row.join(" "), 10, 10 + rowIndex * 10);
                    });

                    // Cria nova página se houver mais de um arquivo
                    if (index < files.length - 1) {
                        doc.addPage();
                    }
                });

                // Atualiza a barra de progresso conforme converte
                setProgress((prev) => Math.min(prev + (100 / files.length), 100));

                // Quando chegar ao último arquivo, faz o download do PDF
                if (index === files.length - 1) {
                    const pdfBlob = doc.output("blob");
                    saveAs(pdfBlob, "converted.pdf");
                    setConverting(false); // Conversão concluída
                }
            };

            reader.readAsArrayBuffer(file);
        });
    };

    return (
        <Container>
            <Content>
                <Title title="Conversor de Excel para PDF" />

                {/* Área de Drag-and-Drop ou Clique para Carregar Arquivo */}
                <div
                    style={{
                        border: "2px dashed #ccc",
                        padding: "20px",
                        textAlign: "center",
                        marginBottom: "20px",
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleFileChange(e);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        id="fileInput"
                    />
                    <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                        Arraste ou clique aqui para carregar arquivos Excel
                    </label>
                </div>

                {/* Cards de Pré-Visualização */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {files.map((file, index) => (
                        <div key={index} style={{ border: "1px solid #ccc", padding: "10px" }}>
                            <p>{file.name}</p>
                            <p>Tamanho: {(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                    ))}
                </div>

                {/* Botão para Converter */}
                <button
                    onClick={handleConvertToPDF}
                    disabled={converting}
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: converting ? "#ccc" : "#28a745",
                        color: "#fff",
                        border: "none",
                        cursor: converting ? "not-allowed" : "pointer",
                    }}
                >
                    {converting ? "Convertendo..." : "Converter para PDF"}
                </button>

                {/* Barra de Progresso */}
                {converting && (
                    <div style={{ marginTop: "20px" }}>
                        <progress value={progress} max="100" style={{ width: "100%" }}></progress>
                        <p>{Math.round(progress)}% Concluído</p>
                    </div>
                )}


            </Content>
        </Container>
    );
}

export default Converteexcelpdf;