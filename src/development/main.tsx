import React, { useState, useEffect, useCallback } from "react";

// Node 인터페이스 정의
interface Node {
    id: string;
    class: string;
    type: string;
    position: [number, number];
    contents: { [key: string]: string };
}

// 노드 클래스별 색상
const nodeColors:{[key:string]:string} = {
    "Resource": "bg-blue-500",
    "Creature": "bg-green-500",
    "Effect": "bg-yellow-500",
    "Item": "bg-red-500",
    "Projectile": "bg-purple-500",
    "Recipe": "bg-pink-500",
    "Region": "bg-indigo-500",
    "Structure": "bg-orange-500",
    "Vehicle": "bg-teal-500"
};

export default function Main() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [viewport, setViewport] = useState({ zoom: 1, position: [0, 0] });
    const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState<[number, number]>([0, 0]);
    const [isDragging, setIsDragging] = useState(false);
    const [clipboard, setClipboard] = useState<Node[]>([]);
    const [history, setHistory] = useState<Node[][]>([]);

    // 노드 생성 함수
    const createNode = (nodeClass: string) => {
        const newNode: Node = {
            id: generateUUID(),
            class: nodeClass,
            type: "",
            position: [0, 0],
            contents: {}
        };
        setNodes([...nodes, newNode]);
    };

    // UUID 생성 함수 (간단한 예시)
    const generateUUID = () => {
        return Math.random().toString(36).substring(2, 15);
    };

    // 노드 렌더링
    const renderNodes = () => {
        return nodes.map((node) => (
            <div key={node.id} style={{ left: node.position[0], top: node.position[1]}}
                className={`absolute rounded-lg bg-gray-900 flex flex-col items-center justify-between gap-3 ${selectedNodes.includes(node) && "border-1 border-white select-none"}`}
                onMouseDown={e => selectNode(node.id)}>
                <div className={`${nodeColors[node.class]} p-1 rounded-tl-lg rounded-tr-lg font-semibold w-full`}>{node.class}</div>
                <input type="text" className="text-lg focus:outline-none p-1 w-full bg-transparent" placeholder="Type" value={node.type} onChange={e => updateNodeType(node.id, e.target.value)} />
                {Object.keys(node.contents).map((field) => (
                    <div key={field} className="flex justify-around items-center w-full">
                        <input type="text" className="text-lg focus:outline-none p-1 w-40 rounded-md bg-[#ffffff10]" value={node.contents[field]} onChange={e => updateNodeField(node.id, field, e.target.value)} />
                        <button className="text-xl w-10 bg-[#ffffff11] rounded-md" onClick={() => deleteNodeField(node.id, field)}>-</button>
                    </div>
                ))}
                <button className="text-xl w-10 bg-[#ffffff11] rounded-md" onClick={() => addNodeField(node.id, generateUUID())}>+</button>
            </div>
        ));
    };

    // 노드 field 추가
    const addNodeField = (id: string, field: string) => {
        setNodes(nodes.map(node => node.id === id ? { ...node, contents: { ...node.contents, [field]: "" } } : node));
    };

    // 노드 field 삭제
    const deleteNodeField = (id: string, field: string) => {
        let newContents = { ...nodes.find(node => node.id === id)!.contents };
        delete newContents[field];
        setNodes(nodes.map(node => node.id === id ? { ...node, contents: newContents } : node));
    };

    // 노드 field 업데이트
    const updateNodeField = (id: string, field: string, value: string) => {
        setNodes(nodes.map(node => node.id === id ? { ...node, contents: { ...node.contents, [field]: value } } : node));
    };

    // 노드 타입 업데이트
    const updateNodeType = (id: string, newType: string) => {
        setNodes(nodes.map(node => node.id === id ? { ...node, type: newType } : node));
    };

    // 노드 선택
    const selectNode = (id: string) => {
        setSelectedNodes([...selectedNodes, nodes.find(node => node.id === id)!]);
    };

    // 노드 선택 해제
    const deselectNode = (id: string) => {
        setSelectedNodes(selectedNodes.filter(node => node.id !== id));
    };

    // 노드 이동
    const moveNode = (id: string, position: [number, number]) => {
        setNodes(nodes.map(node => node.id === id ? { ...node, position: position } : node));
    };

    // 노드 삭제
    const deleteNode = (id: string) => {
        setNodes(nodes.filter(node => node.id !== id));
    };

    // 노드 선택 해제
    const deselectAllNodes = () => {
        setSelectedNodes([]);
    };

    // 노드 선택
    const selectAllNodes = () => {
        setSelectedNodes(nodes);
    };

    // 노드 복사
    const copyNodes = () => {
        setClipboard(selectedNodes);
    };

    // 노드 붙여넣기
    const pasteNodes = () => {
        setNodes([...nodes, ...clipboard.map(node => ({ ...node, id: generateUUID() }))]);
    };

    // 노드 잘라내기
    const cutNodes = () => {
        setClipboard(selectedNodes);
        setNodes(nodes.filter(node => !selectedNodes.includes(node)));
    };

    // 노드 undo
    const undo = () => {
        if (history.length > 0) {
            setNodes(history[history.length - 1]);
            setHistory(history.slice(0, history.length - 1));
        }
    };

    // 노드 redo
    const redo = () => {
        if (history.length > 0) {
            setNodes(history[history.length - 1]);
            setHistory(history.slice(0, history.length - 1));
        }
    };

    const handleContextMenu = (event:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        const position: [number, number] = [event.clientX, event.clientY];
        setContextMenuPosition(position);
        setIsContextMenuOpen(true);
    };

    const handleMousedown = (event:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.target === event.currentTarget) {
            setIsContextMenuOpen(false);
        }
        setIsDragging(true);
    }

    useEffect(() => {
        const handleKeydown = (event:KeyboardEvent) => {
            if (event.key === "Delete") {
                selectedNodes.forEach(node => deleteNode(node.id));
                deselectAllNodes();
            } else if (event.key === "Escape") {
                deselectAllNodes();
            } else if (event.key === "a" && event.ctrlKey) {
                selectAllNodes();
            } else if (event.key === "ArrowUp") {
                selectedNodes.forEach(node => moveNode(node.id, [node.position[0], node.position[1] - 10]));
            } else if (event.key === "ArrowDown") {
                selectedNodes.forEach(node => moveNode(node.id, [node.position[0], node.position[1] + 10]));
            } else if (event.key === "ArrowLeft") {
                selectedNodes.forEach(node => moveNode(node.id, [node.position[0] - 10, node.position[1]]));
            } else if (event.key === "ArrowRight") {
                selectedNodes.forEach(node => moveNode(node.id, [node.position[0] + 10, node.position[1]]));
            } else if (event.key === "c" && event.ctrlKey) {
                copyNodes();
            } else if (event.key === "v" && event.ctrlKey) {
                pasteNodes();
            } else if (event.key === "x" && event.ctrlKey) {
                cutNodes();
            } else if (event.key === "z" && event.ctrlKey) {
                undo();
            } else if (event.key === "y" && event.ctrlKey) {
                redo();
            }
        };
        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    }, [selectedNodes]);

    useEffect(() => {
        if (isDragging) {
            const handleMousemove = (event:MouseEvent) => {
                selectedNodes.forEach(node => moveNode(node.id, [node.position[0] + event.movementX, node.position[1] + event.movementY]));
            };
            const handleMouseup = () => {
                window.removeEventListener("mousemove", handleMousemove);
                window.removeEventListener("mouseup", handleMouseup);
                setIsDragging(false);
            };
            window.addEventListener("mousemove", handleMousemove);
            window.addEventListener("mouseup", handleMouseup);
        }
    }, [isDragging, selectedNodes]);

    return (
        <div className="w-full h-full bg-cover text-white bg-black bg-center flex flex-col justify-start items-center overflow-hidden"
            style={{ backgroundImage: `url(assets/dev.png)` }}
            onContextMenu={handleContextMenu}
            onMouseDown={handleMousedown}>
            {renderNodes()}
            {isContextMenuOpen && <div className="absolute rounded-md flex flex-col" style={{left:`${contextMenuPosition[0]}px`, top:`${contextMenuPosition[1]}px`}}>
                <button className="p-2 bg-gray-900 hover:bg-gray-700" onClick={() => createNode("Resource")}>Resource</button>
                <button className="p-2 bg-gray-900 hover:bg-gray-700" onClick={() => createNode("Creature")}>Creature</button>
                <button className="p-2 bg-gray-900 hover:bg-gray-700" onClick={() => createNode("Effect")}>Effect</button>
                <button className="p-2 bg-gray-900 hover:bg-gray-700" onClick={() => createNode("Item")}>Item</button>
                <button className="p-2 bg-gray-900 hover:bg-gray-700" onClick={() => createNode("Projectile")}>Projectile</button>
                <button className="p-2 bg-gray-900 hover:bg-gray-700" onClick={() => createNode("Recipe")}>Recipe</button>
                <button className="p-2 bg-gray-900 hover:bg-gray-700" onClick={() => createNode("Region")}>Region</button>
                <button className="p-2 bg-gray-900 hover:bg-gray-700" onClick={() => createNode("Structure")}>Structure</button>
                <button className="p-2 bg-gray-900 hover:bg-gray-700" onClick={() => createNode("Vehicle")}>Vehicle</button>
            </div>}
        </div>
    );
}
