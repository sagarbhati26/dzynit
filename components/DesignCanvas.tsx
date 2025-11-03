// "use client";

// import { useState, useRef, useEffect } from "react";

// interface DesignElement {
//   id: string;
//   type: string;
//   content: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   rotation: number;
//   view: string;
//   url?: string;
// }

// interface DesignCanvasProps {
//   productType?: string;
//   currentView?: string;
//   setProductType?: (type: string) => void;
//   setCurrentView?: (view: string) => void;
//   selectedColor?: string;
//   setSelectedColor?: (color: string) => void;
//   designElements?: DesignElement[];
//   setDesignElements?: (elements: DesignElement[]) => void;
//   setUnsavedChanges?: (value: boolean) => void;
// }

// export default function DesignCanvas({
//   productType = "tshirt",
//   currentView = "front",
//   setProductType = () => {},
//   setCurrentView = () => {},
//   selectedColor = "black",
//   setSelectedColor = () => {},
//   designElements = [],
//   setDesignElements = () => {},
//   setUnsavedChanges = () => {}
// }: DesignCanvasProps) {

 
//   const [zoom, setZoom] = useState(100);
//   const [isDragging, setIsDragging] = useState(false);
//   const [draggedElement, setDraggedElement] = useState<DesignElement | null>(null);
//   const [selectedElement, setSelectedElement] = useState<string | null>(null);
//   const [is3DView, setIs3DView] = useState(false);
//   const [rotation3D, setRotation3D] = useState({ x: 0, y: 0 });
//   const [isDragging3D, setIsDragging3D] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const canvasRef = useRef<HTMLDivElement>(null);
//   const model3DRef = useRef<HTMLDivElement>(null);
  
//   // Extended color palette
//   const colors = [
//     { name: "White", value: "white", hex: "#ffffff" },
//     { name: "Black", value: "black", hex: "#111111" },
//     { name: "Navy", value: "navy", hex: "#0a2463" },
//     { name: "Gray", value: "gray", hex: "#6b7280" },
//     { name: "Red", value: "red", hex: "#ef4444" },
//     { name: "Green", value: "green", hex: "#10b981" },
//     { name: "Blue", value: "blue", hex: "#3b82f6" },
//     { name: "Purple", value: "purple", hex: "#8b5cf6" },
//   ];

//   // Handle drop of elements onto canvas
//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
    
//     // Get drop position relative to canvas
//     if (!canvasRef.current) return;
    
//     const rect = canvasRef.current.getBoundingClientRect();
//     const x = (e.clientX - rect.left) / (zoom / 100);
//     const y = (e.clientY - rect.top) / (zoom / 100);
    
//     // Get data from drag event (prefer JSON, then plain text)
//     const raw = e.dataTransfer.getData("application/json") || e.dataTransfer.getData("text/plain");
    
//     if (!raw) {
//       console.warn("No drag data found on drop");
//       return;
//     }

//     let elementData: any;
//     try {
//       elementData = JSON.parse(raw);
//     } catch (err) {
//       console.error("Failed to parse dropped element data:", err, raw);
//       return;
//     }
    
//     // Create new element with safe defaults
//     const newElement: DesignElement = {
//       id: `element-${Date.now()}`,
//       type: elementData.type || (elementData.url ? 'image' : 'shape'),
//       content: elementData.content || elementData.name || '',
//       x,
//       y,
//       width: elementData.width ?? 100,
//       height: elementData.height ?? 100,
//       rotation: 0,
//       view: currentView,
//       url: elementData.url || ''
//     };
    
//     setDesignElements([...designElements, newElement]);
//     setUnsavedChanges(true);
//   };

//   // Handle drag over
//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//   };
  
//   // 3D model interaction handlers
//   const handle3DMouseDown = (e: React.MouseEvent) => {
//     if (!is3DView) return;
//     setIsDragging3D(true);
//     setDragStart({ x: e.clientX, y: e.clientY });
//   };
  
//   const handle3DMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging3D || !is3DView) return;
    
//     const deltaX = e.clientX - dragStart.x;
//     const deltaY = e.clientY - dragStart.y;
    
//     setRotation3D({
//       y: rotation3D.y + deltaX * 0.5,
//       x: Math.max(-30, Math.min(30, rotation3D.x + deltaY * 0.5))
//     });
    
//     setDragStart({ x: e.clientX, y: e.clientY });
//   };
  
//   const handle3DMouseUp = () => {
//     setIsDragging3D(false);
//   };
  
//   // Reset 3D rotation
//   const reset3DRotation = () => {
//     setRotation3D({ x: 0, y: 0 });
//   };

//   // Render the appropriate product shape based on product type and view
//   const renderProductShape = () => {
//     const colorHex = colors.find(c => c.value === selectedColor)?.hex || "#111111";
//     const lightColorHex = selectedColor === 'white' ? '#f9fafb' : 
//                          selectedColor === 'black' ? '#1f1f1f' : 
//                          selectedColor === 'navy' ? '#0f3076' : 
//                          selectedColor === 'red' ? '#f87171' :
//                          selectedColor === 'green' ? '#34d399' :
//                          selectedColor === 'blue' ? '#60a5fa' :
//                          selectedColor === 'purple' ? '#a78bfa' :
//                          '#7c848e';
    
//     // T-shirt front view
//     if (productType === "tshirt" && currentView === "front") {
//       return (
//         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M140,50 C160,30 260,30 280,50 L310,10 L350,30 L330,90 L330,510 L90,510 L90,90 L70,30 L110,10 L140,50 Z" 
//             fill={colorHex} 
//             stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//             strokeWidth="1"
//           />
//           <path d="M140,50 C160,30 260,30 280,50 L280,150 L140,150 L140,50 Z" 
//             fill={lightColorHex} 
//             opacity="0.5"
//           />
//         </svg>
//       );
//     }
//   };
    
//   // Render 3D product mockup
//   const render3DProductShape = () => {
//     const colorHex = colors.find(c => c.value === selectedColor)?.hex || "#111111";
//     const lightColorHex = selectedColor === 'white' ? '#f9fafb' : 
//                          selectedColor === 'black' ? '#1f1f1f' : 
//                          selectedColor === 'navy' ? '#0f3076' : 
//                          selectedColor === 'red' ? '#f87171' :
//                          selectedColor === 'green' ? '#34d399' :
//                          selectedColor === 'blue' ? '#60a5fa' :
//                          selectedColor === 'purple' ? '#a78bfa' :
//                          '#7c848e';
    
//     // Apply 3D rotation transform
//     const transform = `rotateX(${rotation3D.x}deg) rotateY(${rotation3D.y}deg)`;
    
//     if (productType === "tshirt") {
//       return (
//         <div 
//           className="w-full h-full perspective-1000"
//           onMouseDown={handle3DMouseDown}
//           onMouseMove={handle3DMouseMove}
//           onMouseUp={handle3DMouseUp}
//           onMouseLeave={handle3DMouseUp}
//           ref={model3DRef}
//         >
//           <div 
//             className="w-full h-full relative transition-transform duration-100 preserve-3d"
//             style={{ transform }}
//           >
//             {/* Front face */}
//             <div className="absolute inset-0 backface-hidden preserve-3d" style={{ transform: 'translateZ(60px)' }}>
//               <svg className="w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M140,50 C160,30 260,30 280,50 L310,10 L350,30 L330,90 L330,510 L90,510 L90,90 L70,30 L110,10 L140,50 Z" 
//                   fill={colorHex} 
//                   stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//                   strokeWidth="1"
//                 />
//                 <path d="M140,50 C160,30 260,30 280,50 L280,150 L140,150 L140,50 Z" 
//                   fill={lightColorHex} 
//                   opacity="0.5"
//                 />
//               </svg>
//               {/* Front design elements */}
//               <div className="absolute inset-0">
//                 {designElements
//                   .filter(element => element.view === "front")
//                   .map(element => (
//                     <div
//                       key={element.id}
//                       className="absolute"
//                       style={{
//                         left: `${element.x}px`,
//                         top: `${element.y}px`,
//                         width: `${element.width}px`,
//                         height: `${element.height}px`,
//                         transform: `rotate(${element.rotation}deg)`,
//                       }}
//                     >
//                       {element.type === 'image' && (
//                         <img 
//                           src={element.content} 
//                           alt="Design element" 
//                           className="w-full h-full object-contain"
//                         />
//                       )}
//                       {element.type === 'text' && (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <span>{element.content}</span>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//               </div>
//             </div>
            
//             {/* Back face */}
//             <div className="absolute inset-0 backface-hidden preserve-3d" style={{ transform: 'translateZ(-60px) rotateY(180deg)' }}>
//               <svg className="w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M140,50 C160,30 260,30 280,50 L310,10 L350,30 L330,90 L330,510 L90,510 L90,90 L70,30 L110,10 L140,50 Z" 
//                   fill={colorHex} 
//                   stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//                   strokeWidth="1"
//                 />
//                 <path d="M140,50 C160,30 260,30 280,50 L280,150 L140,150 L140,50 Z" 
//                   fill={lightColorHex} 
//                   opacity="0.5"
//                 />
//               </svg>
//               {/* Back design elements */}
//               <div className="absolute inset-0">
//                 {designElements
//                   .filter(element => element.view === "back")
//                   .map(element => (
//                     <div
//                       key={element.id}
//                       className="absolute"
//                       style={{
//                         left: `${element.x}px`,
//                         top: `${element.y}px`,
//                         width: `${element.width}px`,
//                         height: `${element.height}px`,
//                         transform: `rotate(${element.rotation}deg)`,
//                       }}
//                     >
//                       {element.type === 'image' && (
//                         <img 
//                           src={element.content} 
//                           alt="Design element" 
//                           className="w-full h-full object-contain"
//                         />
//                       )}
//                       {element.type === 'text' && (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <span>{element.content}</span>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//               </div>
//             </div>
            
//             {/* Left side */}
//             <div className="absolute inset-0 backface-hidden preserve-3d" style={{ transform: 'translateX(-60px) rotateY(-90deg)' }}>
//               <svg className="w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M160,50 L260,50 L260,510 L160,510 Z" 
//                   fill={colorHex} 
//                   stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//                   strokeWidth="1"
//                 />
//                 <path d="M160,50 L260,50 L260,150 L160,150 Z" 
//                   fill={lightColorHex} 
//                   opacity="0.5"
//                 />
//               </svg>
//               {/* Left design elements */}
//               <div className="absolute inset-0">
//                 {designElements
//                   .filter(element => element.view === "left")
//                   .map(element => (
//                     <div
//                       key={element.id}
//                       className="absolute"
//                       style={{
//                         left: `${element.x}px`,
//                         top: `${element.y}px`,
//                         width: `${element.width}px`,
//                         height: `${element.height}px`,
//                         transform: `rotate(${element.rotation}deg)`,
//                       }}
//                     >
//                       {element.type === 'image' && (
//                         <img 
//                           src={element.content} 
//                           alt="Design element" 
//                           className="w-full h-full object-contain"
//                         />
//                       )}
//                       {element.type === 'text' && (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <span>{element.content}</span>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//               </div>
//             </div>
            
//             {/* Right side */}
//             <div className="absolute inset-0 backface-hidden preserve-3d" style={{ transform: 'translateX(60px) rotateY(90deg)' }}>
//               <svg className="w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M160,50 L260,50 L260,510 L160,510 Z" 
//                   fill={colorHex} 
//                   stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//                   strokeWidth="1"
//                 />
//                 <path d="M160,50 L260,50 L260,150 L160,150 Z" 
//                   fill={lightColorHex} 
//                   opacity="0.5"
//                 />
//               </svg>
//               {/* Right design elements */}
//               <div className="absolute inset-0">
//                 {designElements
//                   .filter(element => element.view === "right")
//                   .map(element => (
//                     <div
//                       key={element.id}
//                       className="absolute"
//                       style={{
//                         left: `${element.x}px`,
//                         top: `${element.y}px`,
//                         width: `${element.width}px`,
//                         height: `${element.height}px`,
//                         transform: `rotate(${element.rotation}deg)`,
//                       }}
//                     >
//                       {element.type === 'image' && (
//                         <img 
//                           src={element.content} 
//                           alt="Design element" 
//                           className="w-full h-full object-contain"
//                         />
//                       )}
//                       {element.type === 'text' && (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <span>{element.content}</span>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       );
//     }
    
//     // Hoodie 3D view
//     if (productType === "hoodie") {
//       // Similar structure as t-shirt but with hoodie SVGs
//       return (
//         <div 
//           className="w-full h-full perspective-1000"
//           onMouseDown={handle3DMouseDown}
//           onMouseMove={handle3DMouseMove}
//           onMouseUp={handle3DMouseUp}
//           onMouseLeave={handle3DMouseUp}
//           ref={model3DRef}
//         >
//           <div 
//             className="w-full h-full relative transition-transform duration-100 preserve-3d"
//             style={{ transform }}
//           >
//             {/* Front face */}
//             <div className="absolute inset-0 backface-hidden preserve-3d" style={{ transform: 'translateZ(60px)' }}>
//               <svg className="w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M140,80 C160,60 260,60 280,80 L310,40 L350,60 L330,120 L330,510 L90,510 L90,120 L70,60 L110,40 L140,80 Z" 
//                   fill={colorHex} 
//                   stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//                   strokeWidth="1"
//                 />
//                 {/* Hood */}
//                 <path d="M160,60 C160,30 260,30 260,60 L260,120 L160,120 Z" 
//                   fill={lightColorHex} 
//                   stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//                   strokeWidth="1"
//                 />
//                 {/* Pocket */}
//                 <path d="M150,300 L270,300 L270,380 L150,380 Z" 
//                   fill={lightColorHex} 
//                   stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//                   strokeWidth="1"
//                   opacity="0.5"
//                 />
//               </svg>
//               {/* Front design elements */}
//               <div className="absolute inset-0">
//                 {designElements
//                   .filter(element => element.view === "front")
//                   .map(element => (
//                     <div
//                       key={element.id}
//                       className="absolute"
//                       style={{
//                         left: `${element.x}px`,
//                         top: `${element.y}px`,
//                         width: `${element.width}px`,
//                         height: `${element.height}px`,
//                         transform: `rotate(${element.rotation}deg)`,
//                       }}
//                     >
//                       {element.type === 'image' && (
//                         <img 
//                           src={element.content} 
//                           alt="Design element" 
//                           className="w-full h-full object-contain"
//                         />
//                       )}
//                       {element.type === 'text' && (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <span>{element.content}</span>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//               </div>
//             </div>
            
//             {/* Other sides similar to t-shirt but with hoodie SVGs */}
//             {/* Back, left, right sides would be implemented similarly */}
//           </div>
//         </div>
//       );
//     }
    
//     return null;
//   };
  
//   // Helper function to get light color hex
//   const getLightColorHex = (color: string): string => {
//     return color === 'white' ? '#f9fafb' : 
//            color === 'black' ? '#1f1f1f' : 
//            color === 'navy' ? '#0f3076' : 
//            color === 'red' ? '#f87171' :
//            color === 'green' ? '#34d399' :
//            color === 'blue' ? '#60a5fa' :
//            color === 'purple' ? '#a78bfa' :
//            '#7c848e';
//   };
  
//   // Continue with product shape rendering
//   // Using the renderProductShape function defined earlier
    
//     // Define color variables for all product shapes
//     const colorHex = colors.find(c => c.value === selectedColor)?.hex || "#111111";
//     const lightColorHex = getLightColorHex(selectedColor);
    
//     // T-shirt front view
//     if (productType === "tshirt" && currentView === "front") {
//       return (
//         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M140,50 C160,30 260,30 280,50 L310,10 L350,30 L330,90 L330,510 L90,510 L90,90 L70,30 L110,10 L140,50 Z" 
//             fill={colors.find(c => c.value === selectedColor)?.hex || "#111111"} 
//             stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//             strokeWidth="1"
//           />
//           <path d="M140,50 C160,30 260,30 280,50 L280,150 L140,150 L140,50 Z" 
//             fill={colors.find(c => c.value === selectedColor)?.hex || "#111111"} 
//             opacity="0.5"
//           />
//         </svg>
//       );
//     }
    
//     // T-shirt back view
//     if (productType === "tshirt" && currentView === "back") {
//       return (
//         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M140,50 C160,30 260,30 280,50 L310,10 L350,30 L330,90 L330,510 L90,510 L90,90 L70,30 L110,10 L140,50 Z" 
//             fill={colors.find(c => c.value === selectedColor)?.hex || "#111111"}
//             stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//             strokeWidth="1"
//           />
//           <path d="M140,50 C160,30 260,30 280,50 L280,150 L140,150 L140,50 Z" 
//             fill={lightColorHex} 
//             opacity="0.5"
//           />
//         </svg>
//       );
//     }
    
//     // T-shirt left view
//     if (productType === "tshirt" && currentView === "left") {
//       return (
//         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M160,50 L260,50 L260,510 L160,510 Z" 
//             fill={colors.find(c => c.value === selectedColor)?.hex || "#111111"} 
//             stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//             strokeWidth="1"
//           />
//           <path d="M160,50 L260,50 L260,150 L160,150 Z" 
//             fill={selectedColor === 'white' ? '#f9fafb' : 
//             selectedColor === 'black' ? '#1f1f1f' : 
//             selectedColor === 'navy' ? '#0f3076' : 
//             selectedColor === 'red' ? '#f87171' :
//             selectedColor === 'green' ? '#34d399' :
//             selectedColor === 'blue' ? '#60a5fa' :
//             selectedColor === 'purple' ? '#a78bfa' :
//             '#7c848e'} 
//             opacity="0.5"
//           />
//         </svg>
//       );
//     }
    
//     // T-shirt right view
//     if (productType === "tshirt" && currentView === "right") {
//       return (
//         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M160,50 L260,50 L260,510 L160,510 Z" 
//             fill={colors.find(c => c.value === selectedColor)?.hex || "#111111"}
//             stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//             strokeWidth="1"
//           />
//           <path d="M160,50 L260,50 L260,150 L160,150 Z" 
//             fill={lightColorHex} 
//             opacity="0.5"
//           />
//         </svg>
//       );
//     }
    
//     // Hoodie front view
//     if (productType === "hoodie" && currentView === "front") {
//       return (
//         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M140,80 C160,60 260,60 280,80 L310,40 L350,60 L330,120 L330,510 L90,510 L90,120 L70,60 L110,40 L140,80 Z" 
//            fill={colors.find(c => c.value === selectedColor)?.hex || "#111111"}
//             stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//             strokeWidth="1"
//           />
//           {/* Hood */}
//           <path d="M160,60 C160,30 260,30 260,60 L260,120 L160,120 Z" 
//             fill={lightColorHex} 
//             stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//             strokeWidth="1"
//           />
//           {/* Pocket */}
//           <path d="M150,300 L270,300 L270,380 L150,380 Z" 
//             fill={lightColorHex} 
//             stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//             strokeWidth="1"
//             opacity="0.5"
//           />
//         </svg>
//       );
//     }
    
//     // Hoodie back view
//     if (productType === "hoodie" && currentView === "back") {
//       return (
//         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M140,80 C160,60 260,60 280,80 L310,40 L350,60 L330,120 L330,510 L90,510 L90,120 L70,60 L110,40 L140,80 Z" 
//            fill={colors.find(c => c.value === selectedColor)?.hex || "#111111"}
//             stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//             strokeWidth="1"
//           />
//           {/* Hood from back */}
//           <path d="M160,60 C180,40 240,40 260,60 L260,120 L160,120 Z" 
//             fill={lightColorHex} 
//             stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//             strokeWidth="1"
//           />
//         </svg>
//       );
//     }
    
//     // Hoodie left/right views
//     if (productType === "hoodie" && (currentView === "left" || currentView === "right")) {
//       return (
//         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <path d="M160,80 L260,80 L260,510 L160,510 Z" 
//           fill={colors.find(c => c.value === selectedColor)?.hex || "#111111"}
//             stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//             strokeWidth="1"
//           />
//           {/* Side hood */}
//           <path d="M160,80 L260,80 L260,150 L160,150 Z" 
//             fill={lightColorHex} 
//             opacity="0.5"
//           />
//           {/* Sleeve */}
//           <path d="M260,150 L320,180 L320,280 L260,250 Z" 
//            fill={colors.find(c => c.value === selectedColor)?.hex || "#111111"}
//             stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
//             strokeWidth="1"
//           />
//         </svg>
//       );
//     }
    
//     // Default fallback
//     return (
//       <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <rect x="120" y="50" width="180" height="450" fill={colors.find(c => c.value === selectedColor)?.hex || "#111111"}/>
//       </svg>
//     );
//   };

//   // Render design elements for the current view
//   // Moved inside the component to access component scope
//   function renderDesignElements() {
//     // Explicitly use the variables from component scope
//     const elements = designElements;
//     const view = currentView;
//     const selected = selectedElement;
//     const setSelected = setSelectedElement;
    
//     return elements
//       .filter((element: DesignElement) => element.view === view)
//       .map((element: DesignElement) => (
//         <div
//           key={element.id}
//           className={`absolute cursor-move ${selected === element.id ? 'ring-2 ring-primary' : ''}`}
//           style={{
//             left: `${element.x}px`,
//             top: `${element.y}px`,
//             width: `${element.width}px`,
//             height: `${element.height}px`,
//             transform: `rotate(${element.rotation}deg)`,
//           }}
//           onClick={(e) => {
//             e.stopPropagation();
//             setSelected(element.id);
//           }}
//         >
//           {element.type === 'text' && (
//             <div className="w-full h-full flex items-center justify-center">
//               <span>{element.content}</span>
//             </div>
//           )}
//           {element.type === 'image' && (
//             <img 
//               src={element.content} 
//               alt="Design element" 
//               className="w-full h-full object-contain"
//             />
//           )}
//           {element.type === 'shape' && (
//             <div 
//               className="w-full h-full" 
//               style={{ backgroundColor: element.content }}
//             ></div>
//           )}
//         </div>
//       ));
//   };

//   // Clear selection when clicking on canvas
//   const handleCanvasClick = () => {
//     setSelectedElement(null);
//   };

//   // Delete selected element with Delete key
//   useEffect(() => {
//     function handleKeyDown(e: KeyboardEvent) {
//       if (e.key === 'Delete' && selectedElement) {
//         setDesignElements(designElements.filter((el: DesignElement) => el.id !== selectedElement));
//         setSelectedElement(null);
//         setUnsavedChanges(true);
//       }
//     }
    
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [selectedElement, designElements, setDesignElements, setUnsavedChanges]);

//   return (
    
//       <div className="flex flex-col gap-6">
//         <div className="flex items-center justify-between flex-wrap gap-4">
//           <div>
//           <div className="text-sm text-muted">Product</div>
//           <div className="font-medium flex items-center gap-2">
//             {productType === "tshirt" ? "Classic Tee" : "Premium Hoodie"} — <span className="capitalize">{selectedColor}</span>
//             <div 
//               className="w-4 h-4 rounded-full border border-border" 
//               style={{ 
//                 backgroundColor: colors.find(c => c.value === selectedColor)?.hex || "#111111"
//               }}
//             ></div>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-4">
//           {/* 2D/3D View Toggle */}
//           <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-border">
//             <button 
//               onClick={() => setIs3DView(false)}
//               className={`text-sm px-3 py-1 rounded-md transition-colors ${!is3DView ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
//             >
//               2D
//             </button>
//             <button 
//               onClick={() => setIs3DView(true)}
//               className={`text-sm px-3 py-1 rounded-md transition-colors ${is3DView ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
//             >
//               3D
//             </button>
//           </div>
          
//           <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-border">
//             <button 
//               onClick={() => setZoom(Math.max(50, zoom - 10))}
//               className="text-muted hover:text-primary transition-colors w-6 h-6 flex items-center justify-center"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M5 12h14"></path>
//               </svg>
//             </button>
//             <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
//             <button 
//               onClick={() => setZoom(Math.min(150, zoom + 10))}
//               className="text-muted hover:text-primary transition-colors w-6 h-6 flex items-center justify-center"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M12 5v14"></path>
//                 <path d="M5 12h14"></path>
//               </svg>
//             </button>
//           </div>
//           <div className="text-sm text-muted">Canvas: 3000×3600</div>
//         </div>
//       </div>

//       <div 
//         className="relative h-[620px] rounded-2xl card-glass soft-shadow flex items-center justify-center overflow-hidden"
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         onClick={handleCanvasClick}
//         ref={canvasRef}
//       >
//         {/* Background grid pattern */}
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UyZThlYyIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
        
//         {/* Product mockup with dynamic color */}
//         <div 
//           className="transition-all duration-300 ease-out"
//           style={{ 
//             width: `${420 * zoom/100}px`, 
//             height: `${520 * zoom/100}px`,
//             transform: `scale(${zoom/100})` 
//           }}
//         >
//           {!is3DView ? (
//             <div 
//               className="relative w-full h-full rounded-lg soft-shadow flex items-center justify-center overflow-hidden"
//               style={{ 
//                 backgroundColor: colors.find(c => c.value === selectedColor)?.hex || "#111111"
//               }}
//             >
//               {/* Product shape overlay */}
//               {renderProductShape()}
              
//               {/* Design area */}
//               <div className="relative z-10 w-[200px] h-[200px] rounded-md flex items-center justify-center">
//                 {designElements.filter(el => el.view === currentView).length === 0 && (
//                   <div className="text-muted text-sm flex flex-col items-center gap-2">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M12 5v14"></path>
//                       <path d="M5 12h14"></path>
//                     </svg>
//                     Drag elements here
//                   </div>
//                 )}
                
//                 {/* Render design elements */}
//                 {renderDesignElements()}
//               </div>
//             </div>
//           ) : (
//             <div className="relative w-full h-full rounded-lg soft-shadow overflow-hidden">
//               {/* 3D Product View */}
//               {render3DProductShape()}
              
//               {/* 3D View Instructions */}
//               <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-border text-xs text-center">
//                 Click and drag to rotate the model
//               </div>
//             </div>
//           )}
//         </div>
        
//         {/* Color selector */}
//         <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-xl border border-border">
//           {colors.map((color) => (
//             <button
//               key={color.value}
//               onClick={() => {
//                 setSelectedColor(color.value);
//                 setUnsavedChanges(true);
//               }}
//               className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedColor === color.value ? 'ring-2 ring-primary ring-offset-2' : ''}`}
//             >
//               <div 
//                 className="w-6 h-6 rounded-full border border-border"
//                 style={{ backgroundColor: color.hex }}
//               ></div>
//             </button>
//           ))}
//         </div>
        
//         {/* Tools */}
//         <div className="absolute top-6 right-6 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-xl border border-border">
//           {is3DView ? (
//             <>
//               <button 
//                 className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-colors"
//                 title="Reset View"
//                 onClick={reset3DRotation}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M3 2v6h6"></path>
//                   <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
//                   <path d="M21 22v-6h-6"></path>
//                   <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
//                 </svg>
//               </button>
//               <div className="w-px h-6 bg-border"></div>
//               <button 
//                 className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-colors"
//                 title="Rotate Left"
//                 onClick={() => setRotation3D({ ...rotation3D, y: rotation3D.y - 45 })}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M3 12h6"></path>
//                   <path d="M9 6l-6 6 6 6"></path>
//                   <path d="M21 12a9 9 0 0 1-9 9"></path>
//                   <path d="M21 12a9 9 0 0 0-9-9"></path>
//                 </svg>
//               </button>
//               <button 
//                 className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-colors"
//                 title="Rotate Right"
//                 onClick={() => setRotation3D({ ...rotation3D, y: rotation3D.y + 45 })}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M15 12h6"></path>
//                   <path d="M21 6l-6 6 6 6"></path>
//                   <path d="M3 12a9 9 0 0 0 9 9"></path>
//                   <path d="M3 12a9 9 0 0 1 9-9"></path>
//                 </svg>
//               </button>
//             </>
//           ) : (
//             <>
//               <button 
//                 className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-colors"
//                 title="Undo"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M3 7v6h6"></path>
//                   <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
//                 </svg>
//               </button>
//               <button 
//                 className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-colors"
//                 title="Redo"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M21 7v6h-6"></path>
//                   <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path>
//                 </svg>
//               </button>
//               <div className="w-px h-6 bg-border"></div>
//               <button 
//                 className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-colors"
//                 title="Download"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//                   <polyline points="7 10 12 15 17 10"></polyline>
//                   <line x1="12" y1="15" x2="12" y2="3"></line>
//                 </svg>
//               </button>
//               <button 
//                 className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-colors"
//                 title="Reset"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M3 2v6h6"></path>
//                   <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
//                   <path d="M21 22v-6h-6"></path>
//                   <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
//                 </svg>
//               </button>
//             </>
//           )}
//         </div>
        
//         {/* Element controls - only shown when an element is selected and not in 3D view */}
//         {selectedElement && !is3DView && (
//           <div className="absolute top-6 left-6 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-xl border border-border">
//             <button 
//               className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-colors"
//               title="Bring Forward"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="2" y="7" width="14" height="14" rx="2" ry="2"></rect>
//                 <path d="M16 3h4a2 2 0 0 1 2 2v4"></path>
//                 <path d="M21 13v1"></path>
//               </svg>
//             </button>
//             <button 
//               className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-colors"
//               title="Send Backward"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="8" y="3" width="14" height="14" rx="2" ry="2"></rect>
//                 <path d="M8 17H4a2 2 0 0 1-2-2V4"></path>
//               </svg>
//             </button>
//             <div className="w-px h-6 bg-border"></div>
//             <button 
//               className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-colors"
//               title="Duplicate"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="8" y="8" width="12" height="12" rx="2" ry="2"></rect>
//                 <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>
//               </svg>
//             </button>
//             <button 
//               className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted hover:text-red-500 transition-colors"
//               title="Delete"
//               onClick={() => {
//                 if (selectedElement) {
//                   setDesignElements(designElements.filter(el => el.id !== selectedElement));
//                   setSelectedElement(null);
//                   setUnsavedChanges(true);
//                 }
//               }}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M3 6h18"></path>
//                 <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
//                 <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
//                 <line x1="10" y1="11" x2="10" y2="17"></line>
//                 <line x1="14" y1="11" x2="14" y2="17"></line>
//               </svg>
//             </button>
//           </div>
//         )}
        
//         {/* View selector - only shown in 2D mode */}
//         {!is3DView && (
//           <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-xl border border-border">
//             <button
//               onClick={() => {
//                 setCurrentView("front");
//                 setUnsavedChanges(true);
//               }}
//               className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentView === "front" ? 'bg-primary text-white' : 'text-muted hover:bg-primary/10 hover:text-primary'} transition-colors`}
//               title="Front View"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="4" y="5" width="16" height="16" rx="2"></rect>
//               </svg>
//             </button>
//             <button
//               onClick={() => {
//                 setCurrentView("back");
//                 setUnsavedChanges(true);
//               }}
//               className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentView === "back" ? 'bg-primary text-white' : 'text-muted hover:bg-primary/10 hover:text-primary'} transition-colors`}
//               title="Back View"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="4" y="5" width="16" height="16" rx="2"></rect>
//                 <line x1="12" y1="9" x2="12" y2="15"></line>
//                 <line x1="9" y1="12" x2="15" y2="12"></line>
//               </svg>
//             </button>
//             <button
//               onClick={() => {
//                 setCurrentView("left");
//                 setUnsavedChanges(true);
//               }}
//               className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentView === "left" ? 'bg-primary text-white' : 'text-muted hover:bg-primary/10 hover:text-primary'} transition-colors`}
//               title="Left View"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M15 3h6v18h-6"></path>
//                 <path d="M10 15l-5-3 5-3z"></path>
//               </svg>
//             </button>
//             <button
//               onClick={() => {
//                 setCurrentView("right");
//                 setUnsavedChanges(true);
//               }}
//               className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentView === "right" ? 'bg-primary text-white' : 'text-muted hover:bg-primary/10 hover:text-primary'} transition-colors`}
//               title="Right View"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M9 3h6v18H9"></path>
//                 <path d="M14 15l5-3-5-3z"></path>
//               </svg>
//             </button>
//           </div>
//         )}
//       </div>
      
//       {/* Quick actions */}
//       <div className="flex justify-end gap-3">
//         <button 
//           className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-background/80 transition-colors"
//           onClick={() => {
//             // Save draft functionality would be implemented here
//             console.log("Save draft");
//           }}
//         >
//           Save Draft
//         </button>
//         <button 
//           className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
//           onClick={() => {
         
//             console.log("Preview design");
//           }}
//         >
//           Preview Design
//         </button>
//       </div>
//     </div>
    

//   )


import React from 'react'

function DesignCanvas() {
  return (
    <div>DesignCanvas</div>
  )
}

export default DesignCanvas