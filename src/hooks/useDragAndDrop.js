import { useState, useCallback } from "react";

export const useDragAndDrop = () => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = useCallback((e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    
    // Add drag preview styling
    setTimeout(() => {
      e.target.classList.add("dragging");
    }, 0);
  }, []);

  const handleDragEnd = useCallback((e) => {
    e.target.classList.remove("dragging");
    setDraggedItem(null);
    setDragOverColumn(null);
  }, []);

  const handleDragOver = useCallback((e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  }, []);

  const handleDragLeave = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    // Only clear if we're actually leaving the column area
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setDragOverColumn(null);
    }
  }, []);

  const handleDrop = useCallback((e, targetColumn, onDrop) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedItem && onDrop) {
      onDrop(draggedItem, targetColumn);
    }
  }, [draggedItem]);

  return {
    draggedItem,
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
};