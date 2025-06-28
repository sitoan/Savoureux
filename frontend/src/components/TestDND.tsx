// TestDND.tsx
import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";

const textTemplates = [
  { id: "1", content: "Xin chào," },
  { id: "2", content: "Tôi tên là..." },
  { id: "3", content: "Rất vui được gặp bạn!" },
];

// Component kéo được
function DraggableText({ id, content }: { id: string; content: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { content }, // truyền data khi kéo
  });

  const style: React.CSSProperties = {
    padding: "8px",
    marginBottom: "8px",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "grab",
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {content}
    </div>
  );
}

// Vùng thả là textarea
function DroppableTextarea({
  text,
  onDrop,
  onChange,
}: {
  text: string;
  onDrop: (content: string) => void;
  onChange: (value: string) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: "textarea",
  });

  return (
    <textarea
      ref={setNodeRef}
      value={text}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Kéo văn bản vào đây..."
      style={{
        width: "100%",
        height: "200px",
        fontSize: "16px",
        padding: "10px",
      }}
    />
  );
}

// Component chính
export default function TestDND() {
  const [text, setText] = useState("");

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (over?.id === "textarea" && active.data?.current?.content) {
      const content = active.data.current.content;
      setText((prev) => (prev ? prev + "\n" + content : content));
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Danh sách text mẫu */}
        <div
          style={{
            width: 200,
            padding: 10,
            border: "1px solid gray",
            borderRadius: 4,
            background: "#f5f5f5",
          }}
        >
          <h4>Text mẫu</h4>
          {textTemplates.map((item) => (
            <DraggableText key={item.id} id={item.id} content={item.content} />
          ))}
        </div>

        {/* Vùng textarea nhận drop */}
        <div style={{ flex: 1 }}>
          <DroppableTextarea
            text={text}
            onDrop={(content) => setText((prev) => prev + "\n" + content)}
            onChange={(value) => setText(value)}
          />
        </div>
      </div>
    </DndContext>
  );
}
