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
    const renderTaskRef = useRef(null); // Referência para cancelar renderizações anteriores
    const isRendering = useRef(false); // Referência para rastrear se uma renderização está em andamento

    useEffect(() => {
        const generateThumbnail = async () => {
            if (!file || !file.file || isRendering.current) return;

            isRendering.current = true; // Marque como em andamento
            const fileReader = new FileReader();

            // Quando o FileReader terminar de ler o arquivo:
            fileReader.onload = async () => {
                try {
                    const pdfData = new Uint8Array(fileReader.result); // Converta o arquivo para bytes
                    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise; // Carregue o PDF
                    const page = await pdf.getPage(1); // carrega a primeira págima

                    const viewport = page.getViewport({ scale: 0.5 }); // ajusta o tamanho
                    const canvas = canvasRef.current;
                    const context = canvas.getContext("2d");

                    // Certifique-se de cancelar qualquer renderização anterior
                    if (renderTaskRef.current) {
                        renderTaskRef.current.cancel();
                    }

                    // Certifique-se de limpar o canvas antes de cada renderização
                    context.clearRect(0, 0, canvas.width, canvas.height);

                    // Ajuste o tamanho do canvas de acordo com a página
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    // Renderize a página no canvas
                    const renderTask = page.render({ canvasContext: context, viewport });
                    renderTaskRef.current = renderTask;
                    await renderTask.promise;


                    // Converta o canvas para uma imagem e armazene no estado
                    setThumbnail(canvas.toDataURL()); // converte para imagem
                    console.log("Miniatura gerada com sucesso:", canvas.toDataURL()); // Log para confirmar
                } catch (error) {
                    console.error("Erro ao gerar a miniatura: ", error);
                } finally {
                    isRendering.current = false; // Marque como não em endamento
                }
            };

            fileReader.readAsArrayBuffer(file.file); // Leia o arquivo PDF como um ArrayBuffer
        };

        generateThumbnail();

        return () => {
            // Cancelar renderizações pendentes quando o componente for desmontado ou o arquivo mudar
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }
        };

    }, [file]);

    const [, ref] = useDrag({
        type: ItemType,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover: (draggedItem, monitor) => {
            if (!monitor.isOver()) return
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
                <p className="loading-preview">Loading preview...</p>
            )}
            {/* <p>{file.name}</p> */}
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>
    );
}

export default FileCard;