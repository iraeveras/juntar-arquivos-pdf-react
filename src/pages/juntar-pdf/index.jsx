import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { useDropzone } from "react-dropzone";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FileCard from "../../components/file-card"
import ProgressBar from '../../components/progress-bar';
import Container from '../../components/container';
import Content from '../../components/content';
import Title from '../../components/title';
import "./index.css";

const Juntarpdf = () => {

    const [pdfFiles, setPdfFiles] = useState([]);
    const [isMerging, setIsMerging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false); // Estado para verificar se está arrastando

    // Função para lidar com o upload (drag-and-dreop ou clicar)
    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        onDrop: (acceptedFiles) => {
            const newFiles = acceptedFiles.map((file, index) => ({
                file,
                id: `${file.name}-${index}`,
                name: file.name,
            }));
            setPdfFiles((prev) => [...prev, ...newFiles]);
        },

        onDragEnter: () => setIsDragging(true), // Definir estado ao entrar na área de drop
        onDragLeave: () => setIsDragging(false), // Definir estado ao sair da área de drop
        onDropAccepted: () => setIsDragging(false), // Definir estado após drop
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
        setPdfFiles([]);
        setProgress(0);
        setMergedPdfUrl(null);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Container>
                <Content>
                    <Title title="Juntar PDF" />

                    {/* Área de Drag-and-Drop */}
                    <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <p>Arraste e solte ou clique para selecionar arquivos PDF</p>
                    </div>

                    {/* Barra de Progresso */}
                    {isMerging && <ProgressBar progress={progress} />}

                    <div className='box-btns-juntar-download'>
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
                </Content>
                {/* Mostrar os arquivos PDFs em cards */}
                <div className='file-list'>
                    <h3 className='file-list-title'>Arquivos selecionados</h3>
                    <div className='content-arquivos-selecionados'>
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
            </Container>
        </DndProvider>
    )
}

export default Juntarpdf;