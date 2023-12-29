import React, { useState, useEffect, useCallback } from "react";
import { useWindowSize } from "usehooks-ts";

// Node 인터페이스 정의
interface Node {
    id: string;
    class: string;
    type: string;
    position: [number, number];
    contents: { [key: string]: string };
    childIds: string[];
}

// 노드 클래스별 색상
const nodeColors:{[key:string]:string} = {
    "Resource": "bg-yellow-500",
    "Creature": "bg-green-500",
    "Effect": "bg-purple-500",
    "Item": "bg-blue-500",
    "Projectile": "bg-red-500",
    "Recipe": "bg-pink-500",
    "Region": "bg-indigo-500",
    "Structure": "bg-orange-500",
    "Vehicle": "bg-teal-500"
};
type Point = [number, number];

interface LineBetweenPointsProps {
  point1: Point;
  point2: Point;
}

const LineBetweenPoints: React.FC<LineBetweenPointsProps> = ({ point1, point2 }) => {
    const {width, height} = useWindowSize();
    const deltaX = point2[0] - point1[0];
    const deltaY = point2[1] - point1[1];
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    const lineStyle: React.CSSProperties = {
        width: `${length}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'left',
        position: 'absolute',
        left: `${width/2 + point1[0]}px`,
        top: `${height/2 + point1[1]}px`,
        height: '2px', // 선의 두께
        backgroundColor: 'white' // 선의 색상
    };

    return <div style={lineStyle} />;
};

export default function Main() {
    const {width, height} = useWindowSize();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [viewport, setViewport] = useState({ zoom: 1, position: [0, 0] });
    const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState<[number, number]>([0, 0]);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<[number, number]>([0, 0]);
    const [dragOffset, setDragOffset] = useState<[number, number]>([0, 0]);
    const [clipboard, setClipboard] = useState<Node[]>([]);
    const [history, setHistory] = useState<Node[][]>([]);
    const [undoIdx, setUndoIdx] = useState(0);
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);
    const [isAltPressed, setIsAltPressed] = useState(false);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [isMousedown, setIsMousedown] = useState(false);

    // 노드 생성 함수
    const createNode = (nodeClass: string) => {
        setIsContextMenuOpen(false);
        const newNode: Node = {
            id: generateUUID(),
            class: nodeClass,
            type: "",
            position: [(contextMenuPosition[0] - width/2 + viewport.position[0])/viewport.zoom, (contextMenuPosition[1] - height/2 + viewport.position[1])/viewport.zoom],
            contents: {},
            childIds: []
        };
        setNodes([...nodes, newNode]);
    };

    // UUID 생성 함수 (간단한 예시)
    const generateUUID = () => {
        return Math.random().toString(36).substring(2, 15);
    };

    // 노드 렌더링
    const renderNodes = () => {
        return nodes.map((node) => {
            let isSelected = selectedNodes.find(selectedNode => selectedNode.id === node.id);
            return <div key={node.id} style={{
                left: `${width/2 + ((node.position[0] + (isSelected ? dragOffset[0]/viewport.zoom : 0) - viewport.position[0]) * viewport.zoom)}px`,
                top: `${height/2 + ((node.position[1] + (isSelected ? dragOffset[1]/viewport.zoom : 0) - viewport.position[1]) * viewport.zoom)}px`,
                transform: `translate(-50%, -50%) scale(${viewport.zoom})`
            }}
                className={`absolute rounded-lg bg-gray-900 flex flex-col items-center justify-between gap-3 select-none pb-3 ${isSelected && "border-2 border-white"}`}>
                <div className={`${nodeColors[node.class]} p-2 rounded-tl-lg rounded-tr-lg font-semibold w-full`}
                onMouseDown={e => {
                    if(!isShiftPressed) {
                        if(!isAltPressed){
                            if(!isCtrlPressed) {
                                selectNode(node.id)
                            } else {
                                if(isSelected){
                                    deselectNode(node.id)
                                } else {
                                    selectNode(node.id)
                                }
                            }
                        } else {
                            linkTo(node.id)
                        }
                    } else {
                        removeChildren(node.id)
                    }
                }}>
                    {node.class}
                </div>
                <input type="text" className="text-lg focus:outline-none p-1 bg-transparent" style={{width:`90%`}} placeholder="Type" value={node.type} onChange={e => updateNodeType(node.id, e.target.value)} />
                {Object.keys(node.contents).map((field) => (
                    <div key={field} className="flex justify-around items-center w-full">
                        <input type="text" className="text-lg focus:outline-none p-1 w-40 rounded-md bg-[#ffffff10]" value={node.contents[field]} onChange={e => updateNodeField(node.id, field, e.target.value)} />
                        <button className="text-xl w-10 bg-[#ffffff11] rounded-md" onClick={() => deleteNodeField(node.id, field)}>-</button>
                    </div>
                ))}
                <button className="text-xl w-10 bg-[#ffffff11] rounded-md" onClick={() => addNodeField(node.id, generateUUID())}>+</button>
            </div>
        });
    };

    const linkTo = (id: string) => {
        setHistory([...history.slice(0, undoIdx + 1), nodes]);
        setUndoIdx(undoIdx + 1);
        let newNodes = [...nodes];
        selectedNodes.forEach(node => {
            if(node.id === id) return;
            let nodeIdx = nodes.findIndex(n => n.id === node.id);
            let curNode = nodes[nodeIdx];
            let childIds = curNode.childIds;
            if (!childIds.includes(id)) {
                newNodes[nodeIdx] = { ...curNode, childIds: [...childIds, id] };
            }
        })
        setNodes(newNodes);
    }

    // 노드 연결 렌더링
    const renderLink = () => {
        return nodes.map(curNode => {
            let childIds = curNode.childIds;
            return childIds.map(childId => {
                let childIdx = nodes.findIndex(n => n.id === childId);
                let childNode = nodes[childIdx];
                let isSelected = selectedNodes.find(selectedNode => selectedNode.id === curNode.id);
                let isChildSelected = selectedNodes.find(selectedNode => selectedNode.id === childNode.id);
                let pos1:Point = [(curNode.position[0] + (isSelected ? dragOffset[0]/viewport.zoom : 0) - viewport.position[0] + 110) * viewport.zoom, (curNode.position[1] + (isSelected ? dragOffset[1]/viewport.zoom : 0) - viewport.position[1]) * viewport.zoom]
                let pos2:Point = [(childNode.position[0] + (isChildSelected ? dragOffset[0]/viewport.zoom : 0) - viewport.position[0] - 110) * viewport.zoom, (childNode.position[1] + (isChildSelected ? dragOffset[1]/viewport.zoom : 0) - viewport.position[1]) * viewport.zoom]
                return <LineBetweenPoints key={`${curNode.id}-${childNode.id}`} point1={pos1} point2={pos2} />
            });
        });
    }

    // 노드 child 제거
    const removeChildren = (id:string) => {
        setHistory([...history.slice(0, undoIdx + 1), nodes]);
        setUndoIdx(undoIdx + 1);
        setNodes(nodes.map(node => node.id === id ? { ...node, childIds: [] } : node));
    }

    // 노드 field 추가
    const addNodeField = (id: string, field: string) => {
        setHistory([...history.slice(0, undoIdx + 1), nodes]);
        setUndoIdx(undoIdx + 1);
        setNodes(nodes.map(node => node.id === id ? { ...node, contents: { ...node.contents, [field]: "" } } : node));
    };

    // 노드 field 삭제
    const deleteNodeField = (id: string, field: string) => {
        setHistory([...history.slice(0, undoIdx + 1), nodes]);
        setUndoIdx(undoIdx + 1);
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
        if(!selectedNodes.find(node => node.id === id)) {
            let newSelectedNodes = [...selectedNodes];
            if (!isCtrlPressed) {
                newSelectedNodes = [];
            }
            newSelectedNodes.push(nodes.find(node => node.id === id)!);
            setSelectedNodes(newSelectedNodes);
        }
    };

    // 노드 선택 해제
    const deselectNode = (id: string) => {
        setSelectedNodes(selectedNodes.filter(node => node.id !== id));
    };

    // 노드 이동
    const moveNode = (id: string, position: [number, number]) => {
        setNodes(nodes.map(node => node.id === id ? { ...node, position: position } : node));
    };

    const moveNodes = (ids: string[], positions: [number, number][]) => {
        setNodes(nodes.map(node => {
            let nodeIdx = ids.findIndex(id => id === node.id);
            if (nodeIdx !== -1) {
                return { ...node, position: positions[nodeIdx] };
            } else {
                return node;
            }
        }));
    }

    // 노드 삭제
    const deleteNode = (id: string) => {
        setHistory([...history.slice(0, undoIdx + 1), nodes]);
        setUndoIdx(undoIdx + 1);
        setNodes(nodes.filter(node => node.id !== id));
    };

    const deleteNodes = (ids: string[]) => {
        setHistory([...history.slice(0, undoIdx + 1), nodes]);
        setUndoIdx(undoIdx + 1);
        let newNodes = nodes.filter(node => !ids.includes(node.id))
        newNodes = newNodes.map(node => {
            let newChildIds = node.childIds.filter(childId => !ids.includes(childId));
            return { ...node, childIds: newChildIds };
        });
        setNodes(newNodes);
    }

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
        setHistory([...history.slice(0, undoIdx + 1), nodes]);
        setUndoIdx(undoIdx + 1);
        setNodes([...nodes, ...clipboard.map(node => ({ ...node, id: generateUUID() }))]);
    };

    // 노드 잘라내기
    const cutNodes = () => {
        setHistory([...history.slice(0, undoIdx + 1), nodes]);
        setUndoIdx(undoIdx + 1);
        setClipboard(selectedNodes);
        setNodes(nodes.filter(node => !selectedNodes.includes(node)));
    };

    // 노드 undo
    const undo = () => {
        if (undoIdx > 0) {
            setUndoIdx(undoIdx - 1);
            setNodes(history[undoIdx - 1]);
        }
    };

    // 노드 redo
    const redo = () => {
        if (undoIdx < history.length - 1) {
            setUndoIdx(undoIdx + 1);
            setNodes(history[undoIdx + 1]);
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
            deselectAllNodes();
        }
        setIsDragging(true);
        setDragOffset([0, 0]);
        setDragStart([event.clientX, event.clientY]);
    }

    useEffect(() => {
        const handleKeydown = (event:KeyboardEvent) => {
            if (event.key === "Delete") {
                deleteNodes(selectedNodes.map(node => node.id));
                deselectAllNodes();
            } else if (event.key === "Escape") {
                deselectAllNodes();
            } else if (event.key === "a" && event.ctrlKey) {
                selectAllNodes();
            } else if (event.key === "ArrowUp") {
                selectedNodes.forEach(node => {
                    let nodeIdx = nodes.findIndex(n => n.id === node.id);
                    let curPosition = nodes[nodeIdx].position;
                    moveNode(node.id, [curPosition[0], curPosition[1] - 10])
                });
            } else if (event.key === "ArrowDown") {
                selectedNodes.forEach(node => {
                    let nodeIdx = nodes.findIndex(n => n.id === node.id);
                    let curPosition = nodes[nodeIdx].position;
                    moveNode(node.id, [curPosition[0], curPosition[1] + 10])
                });
            } else if (event.key === "ArrowLeft") {
                selectedNodes.forEach(node => {
                    let nodeIdx = nodes.findIndex(n => n.id === node.id);
                    let curPosition = nodes[nodeIdx].position;
                    moveNode(node.id, [curPosition[0] - 10, curPosition[1]])
                });
            } else if (event.key === "ArrowRight") {
                selectedNodes.forEach(node => {
                    let nodeIdx = nodes.findIndex(n => n.id === node.id);
                    let curPosition = nodes[nodeIdx].position;
                    moveNode(node.id, [curPosition[0] + 10, curPosition[1]])
                });
            } else if (event.key === "c" && event.ctrlKey) {
                copyNodes();
            } else if (event.key === "v" && event.ctrlKey) {
                pasteNodes();
            } else if (event.key === "x" && event.ctrlKey) {
                cutNodes();
            } else if (event.key === "z" && event.ctrlKey) {
                event.preventDefault();
                undo();
            } else if (event.key === "y" && event.ctrlKey) {
                event.preventDefault();
                redo();
            }
        };
        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    }, [selectedNodes, history, undoIdx, nodes]);

    useEffect(() => {
        if (isDragging) {
            const handleMousemove = (event:MouseEvent) => {
                setDragOffset([event.clientX - dragStart[0], event.clientY - dragStart[1]]);
                if(isCtrlPressed && isMousedown){
                    let newViewport = { ...viewport, position: [viewport.position[0] - event.movementX / viewport.zoom, viewport.position[1] - event.movementY / viewport.zoom] };
                    setViewport(newViewport);
                }
            };
            const handleMouseup = () => {
                window.removeEventListener("mousemove", handleMousemove);
                window.removeEventListener("mouseup", handleMouseup);
                if(dragOffset[0] === 0 && dragOffset[1] === 0) return;
                if(selectedNodes.length === 0) return;
                setHistory([...history.slice(0, undoIdx + 1), nodes]);
                setUndoIdx(undoIdx + 1);
                let ids:string[] = [];
                let positions:[number, number][] = []
                selectedNodes.forEach(node => {
                    let nodeIdx = nodes.findIndex(n => n.id === node.id);
                    let curPosition = nodes[nodeIdx].position;
                    ids.push(node.id);
                    positions.push([curPosition[0] + dragOffset[0] / viewport.zoom, curPosition[1] + dragOffset[1] / viewport.zoom]);
                });
                moveNodes(ids, positions);
                setIsDragging(false);
                setDragStart([0, 0]);
                setDragOffset([0, 0]);
            };
            window.addEventListener("mousemove", handleMousemove);
            window.addEventListener("mouseup", handleMouseup);
            return () => {
                window.removeEventListener("mousemove", handleMousemove);
                window.removeEventListener("mouseup", handleMouseup);
            }
        }
    }, [isDragging, selectedNodes, dragStart, dragOffset, nodes, selectedNodes, isCtrlPressed, isShiftPressed, viewport, isMousedown]);

    useEffect(() => {
        const handleKeydown = (event:KeyboardEvent) => {
            if (event.key === "Control") {
                setIsCtrlPressed(true);
            } else if (event.key === "Alt") {
                setIsAltPressed(true);
            } else if (event.key === "Shift") {
                setIsShiftPressed(true);
            }
        }
        const handleKeyup = (event:KeyboardEvent) => {
            if (event.key === "Control") {
                setIsCtrlPressed(false);
            } else if (event.key === "Alt") {
                setIsAltPressed(false);
            } else if (event.key === "Shift") {
                setIsShiftPressed(false);
            }
        }
        window.addEventListener("keydown", handleKeydown);
        window.addEventListener("keyup", handleKeyup);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("keyup", handleKeyup);
        }
    }, [isCtrlPressed, isAltPressed, isShiftPressed]);

    // wheel zoom
    useEffect(() => {
        const handleWheel = (event:WheelEvent) => {
            const newZoom = Math.max(0.1, Math.min(10, viewport.zoom - event.deltaY / 1000));
            const newViewport = { ...viewport, zoom: newZoom };
            setViewport(newViewport);
        };
        window.addEventListener("wheel", handleWheel);
        return () => window.removeEventListener("wheel", handleWheel);
    }, [viewport]);

    useEffect(() => {
        const focusOut = () => {
            setIsContextMenuOpen(false);
            setIsDragging(false);
            setIsAltPressed(false);
            setIsCtrlPressed(false);
            setIsShiftPressed(false);
        }
        window.addEventListener("blur", focusOut);
        return () => window.removeEventListener("blur", focusOut);
    }, []);

    useEffect(() => {
        const handleMousedown = () => {
            setIsMousedown(true);
        };
        const handleMouseup = () => {
            setIsMousedown(false);
        };
        window.addEventListener("mousedown", handleMousedown);
        window.addEventListener("mouseup", handleMouseup);
        return () => {
            window.removeEventListener("mousedown", handleMousedown);
            window.removeEventListener("mouseup", handleMouseup);
        }
    }, []);

    return (
        <div className="w-full h-full bg-cover text-white bg-black bg-center flex flex-col justify-start items-center overflow-hidden"
            style={{ backgroundImage: `url(assets/dev.png)` }}
            onContextMenu={handleContextMenu}
            onMouseDown={handleMousedown}>
            {renderLink()}
            {renderNodes()}
            {isContextMenuOpen && <div className="absolute rounded-md flex flex-col select-none" style={{left:`${contextMenuPosition[0]}px`, top:`${contextMenuPosition[1]}px`}}>
                {Object.keys(nodeColors).map((nodeClass, i:number) => (
                    <button
                        key={nodeClass}
                        className={`p-2 bg-gray-800 hover:bg-gray-700 ${i === Object.keys(nodeColors).length - 1 ? "rounded-bl-md rounded-br-md" : ""} ${i === 0 ? "rounded-tl-md rounded-tr-md" : ""}`}
                        onClick={e => createNode(nodeClass)}
                    >
                        {nodeClass}
                    </button>
                ))}
            </div>}
        </div>
    );
}
