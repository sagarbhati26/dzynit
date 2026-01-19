import React, { useState, useEffect, useRef } from "react";

interface DesignElement {
    id: string;
    type: string;
    content: string; // text content or image url
    position?: { x: number; y: number } | null; // Changed to 2D coordinates {x, y} (percentage or pixels)
    rotation?: number; // 2D rotation in degrees
    scale?: number; // Scale factor (1 = 100%)
    color?: string;
    fontFamily?: string;
    fontWeight?: string;
    align?: CanvasTextAlign;
    strokeColor?: string;
    strokeWidth?: number;
    width?: number; // pixel width (base)
    height?: number; // pixel height
    shadowColor?: string;
    shadowBlur?: number;
}

interface DraggableDecalProps {
    element: DesignElement;
    isSelected?: boolean;
    onSelect: () => void;
    onUpdate: (updatedElement: DesignElement) => void;
    onDelete?: () => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function DraggableDecal({
    element,
    isSelected,
    onSelect,
    onUpdate,
    onDelete,
    containerRef
}: DraggableDecalProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const elementRef = useRef<HTMLDivElement>(null);

    // Position is stored as percentage of container (0-100)
    const left = element.position?.x ?? 50;
    const top = element.position?.y ?? 30;
    const rotation = element.rotation ?? 0;
    const currWidth = element.width ?? 150;

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect();

        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            // Calculate offset from the element's center/top-left to the mouse
            // We are positioning using %. 
            // But for dragging, let's track mouse movement delta.
            setIsDragging(true);
            setDragOffset({
                x: e.clientX,
                y: e.clientY
            });
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();

            const dx = e.clientX - dragOffset.x;
            const dy = e.clientY - dragOffset.y;

            // Convert pixel delta to percentage
            const dPercentX = (dx / containerRect.width) * 100;
            const dPercentY = (dy / containerRect.height) * 100;

            onUpdate({
                ...element,
                position: {
                    x: left + dPercentX,
                    y: top + dPercentY
                }
            });

            setDragOffset({ x: e.clientX, y: e.clientY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, dragOffset, left, top, element, onUpdate, containerRef]);

    // Render Content
    const renderContent = () => {
        if (element.type === 'image') {
            return (
                <img
                    src={element.content}
                    alt="decal"
                    className="w-full h-full object-contain pointer-events-none select-none"
                    draggable={false}
                />
            );
        }

        return (
            <div
                style={{
                    color: element.color || '#fff',
                    fontFamily: element.fontFamily || 'Inter',
                    fontWeight: (element.fontWeight as any) || 'normal',
                    fontSize: `${currWidth / 3}px`, // Approximate font size relative to container width
                    textAlign: element.align || 'center',
                    whiteSpace: 'nowrap',
                    textShadow: element.shadowColor ? `2px 2px ${element.shadowBlur}px ${element.shadowColor}` : 'none',
                    WebkitTextStroke: element.strokeWidth ? `${element.strokeWidth}px ${element.strokeColor}` : 'none',
                }}
                className="w-full h-full flex items-center justify-center select-none"
            >
                {element.content}
            </div>
        );
    };

    return (
        <div
            ref={elementRef}
            onMouseDown={handleMouseDown}
            className={`absolute cursor-move group ${isSelected ? 'z-50' : 'z-10'}`}
            style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${currWidth}px`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                // height: element.type === 'text' ? 'auto' : `${element.width}px` // Square for images?
            }}
        >
            <div className={`relative w-full h-full ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent' : 'hover:ring-1 hover:ring-white/30'}`}>
                {renderContent()}

                {/* Resize Handle (Simple implementation) */}
                {isSelected && (
                    <>
                        <div
                            className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-full border border-blue-500 cursor-nwse-resize shadow-md"
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                // Implement resize logic if needed (simplified for now)
                                // Ideally similar to drag but affecting width
                                const startX = e.clientX;
                                const startWidth = currWidth;

                                const handleResize = (moveEvent: MouseEvent) => {
                                    const currentX = moveEvent.clientX;
                                    const newWidth = Math.max(20, startWidth + (currentX - startX));
                                    onUpdate({ ...element, width: newWidth });
                                };

                                const stopResize = () => {
                                    window.removeEventListener('mousemove', handleResize);
                                    window.removeEventListener('mouseup', stopResize);
                                };
                                window.addEventListener('mousemove', handleResize);
                                window.addEventListener('mouseup', stopResize);
                            }}
                        />

                        {/* Rotate Handle */}
                        <div
                            className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border border-blue-500 cursor-grab shadow-md flex items-center justify-center"
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                const rect = elementRef.current?.getBoundingClientRect();
                                if (!rect) return;
                                const centerX = rect.left + rect.width / 2;
                                const centerY = rect.top + rect.height / 2;

                                const handleRotate = (moveEvent: MouseEvent) => {
                                    const dx = moveEvent.clientX - centerX;
                                    const dy = moveEvent.clientY - centerY;
                                    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
                                    onUpdate({ ...element, rotation: angle });
                                };

                                const stopRotate = () => {
                                    window.removeEventListener('mousemove', handleRotate);
                                    window.removeEventListener('mouseup', stopRotate);
                                };
                                window.addEventListener('mousemove', handleRotate);
                                window.addEventListener('mouseup', stopRotate);
                            }}
                        >
                            <div className="w-0.5 h-2 bg-blue-500 transform rotate-45" />
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                            className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600"
                        >
                            ×
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

