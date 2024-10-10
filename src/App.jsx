import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { useDropzone } from "react-dropzone";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FileCard from './components/file-card';
import ProgressBar from './components/progress-bar';

import "./App.css";

function App() {

  const [pdfFiles, setPdfFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);

  // Função para lidar com o upload (drag-and-dreop ou clicar)
  const { getRootProps, getInputProps } = useDropzone({
    accept: ".pdf",
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file, index) => ({
        file,
        id: `${file.name}-${index}`,
        name: file.name,
      }));
      setPdfFiles((prev) => [...prev, ...newFiles]);
    },
  });

  // Função para ordenar os arquivos no drag-and-drop
  const moveFile = (dragIndex, hoverIndex) => {
    const updatedFiles = [...pdfFiles];
    const [draggedFile] = updatedFiles.splice(dragIndex, 1);
    updatedFiles.splice(hoverIndex, 0, draggedFile);
    setPdfFiles(updatedFiles);
  };

  // Função para juntar os PDFs
  const mergePdfs = async () => {
    setIsMerging(true);
    setProgress(10);

    const mergedPdf = await PDFDocument.create();
    for (let i = 0; i < pdfFiles.length; i++) {
      const file = pdfFiles[i].file;
      const fileBytes = await file.arrayBuffer();
      const pdfToMerge = await PDFDocument.load(fileBytes);
      const copiedPages = await mergedPdf.copyPages(pdfToMerge, pdfToMerge.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));

      setProgress((prev) => prev + (90 / pdfFiles.length));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const downloadUrl = URL.createObjectURL(blob);
    setMergedPdfUrl(downloadUrl);
    saveAs(blob, "combined.pdf");
    setIsMerging(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='container'>
        <div className='content'>
        <h1>Combinar PDF</h1>

        {/* Área de Drag-and-Drop */}
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Arraste e solte ou clique para selecionar arquivos PDF</p>
        </div>

        

        {/* Barra de Progresso */}
        {isMerging && <ProgressBar progress={progress} />}

        {/* Botão para juntar PDFs */}
        <button className='btn-juntar' onClick={mergePdfs} disabled={pdfFiles.length === 0 || isMerging}>
          Juntar PDFs
        </button>

        {/* Botão de Download adicional */}
        {mergedPdfUrl && (
          <a className='download-pdf-link' href={mergedPdfUrl} download="combined.pdf">
            Download PDF
          </a>
        )}
        </div>
        {/* Mostrar os arquivos PDFs em cards */}
        <div className='file-list'>
          <h3>Arquivos selecionados</h3>
          {pdfFiles.map((file, index) => (
            <FileCard
              key={file.id}
              index={index}
              file={file}
              moveFile={moveFile}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  )
}

export default App;
