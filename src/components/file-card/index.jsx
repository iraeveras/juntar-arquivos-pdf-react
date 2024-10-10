import "pdfjs-dist/legacy/build/pdf.worker.mjs";
import React, { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import * as pdfjsLib from "pdfjs-dist";
import "./index.css";

// Configurar manualmente o worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Tipo de item para o drag-and-drop
const ItemType = "FILE";

// Componente FileCard
const FileCard = ({ file, index, moveFile }) => {
    const [thumbnail, setThumbnail] = useState(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const generateThumbnail = async () => {
            const fileReader = new FileReader();

            // Log para depuração - verificando o arquivo
            console.log("Lendo arquivo: ", file.file);

            // Quando o FileReader terminar de ler o arquivo:
            fileReader.onload = async () => {
                const pdfData = new Uint8Array(fileReader.result); // Converta o arquivo para bytes
                const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise; // Carregue o PDF
                const page = await pdf.getPage(1); // carrega a primeira págima

                const viewport = page.getViewport({ scale: 0.5 }); // ajusta o tamanho
                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");

                // Ajuste o tamanho do canvas de acordo com a página
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                // Renderize a página no canvas
                await page.render({ canvasContext: context, viewport }).promise;

                // Converta o canvas para uma imagem e armazene no estado
                setThumbnail(canvas.toDataURL()); // converte para imagem
            };

            fileReader.readAsArrayBuffer(file.file); // Leia o arquivo PDF como um ArrayBuffer
        };

        generateThumbnail();
    }, [file]);

    const [, ref] = useDrag({
        type: ItemType,
        item: { index },
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveFile(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div ref={(node) => ref(drop(node))} className="file-card">
            {thumbnail ? (
                <img src={thumbnail} alt="PDF thumbnail" style={{ width: "100%" }} />
            ) : (
                <p>Loading preview...</p>
            )}
            {/* <p>{file.name}</p> */}
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>
    );
}

export default FileCard;