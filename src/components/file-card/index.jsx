import React from "react";
import { useDrag, useDrop } from "react-dnd";

// Tipo de item para o drag-and-drop
const ItemType = "FILE";

// Componente FileCard
const FileCard = ({ file, index, moveFile }) => {
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
            <p>{file.name}</p>
        </div>
    );
}

export default FileCard;