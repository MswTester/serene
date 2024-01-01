import { CSSProperties, FC, useEffect, useRef, useState } from "react"
import { Node } from "./node"
import { useWindowSize } from "usehooks-ts"
import { generateRandomString } from "../utils"

const defaultColorMap:[string, string][] = [
    ['Resource', '#FFCC00'],
    ['Creature', '#33DD33'],
    ['Item', '#0099FF'],
    ['Projectile', '#CC00FF'],
    ['Effect', '#FF0066'],
    ['Structure', '#3333CC'],
    ['Vehicle', '#FF9933'],
    ['Recipe', '#00DDDD'],
    ['Region', '#9933FF']
]

const nodeLinkerSize = 15;

export default function Main(){
    const [colorMap, setColorMap] = useState<[string, string][]>(defaultColorMap)
    const {width, height} = useWindowSize()
    const [viewport, setViewport] = useState<[number, number, number]>([0, 0, 1])
    const [contextMenuPosition, setContextMenuPosition] = useState<[number, number]>([0, 0])
    const [contextMenuVisible, setContextMenuVisible] = useState(false)
    const [nodes, setNodes] = useState<Node[]>([])
    const [isMousedown, setIsMousedown] = useState<boolean>(false)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [dragStart, setDragStart] = useState<[number, number]>([0, 0])
    const [dragOffset, setDragOffset] = useState<[number, number]>([0, 0])
    const [selectedNodes, setSelectedNodes] = useState<string[]>([])
    const [mouseDraggingTarget, setMouseDraggingTarget] = useState<string>('')
    const [keymap, setKeymap] = useState<string[]>([])
    const [panning, setPanning] = useState<boolean>(false)
    const [clipboard, setClipboard] = useState<Node[]>([])
    const [navbarVisible, setNavbarVisible] = useState<boolean>(false)
    const [targetNode, setTargetNode] = useState<[string, number]>(['', -1])
    const [history, setHistory] = useState<Node[][]>([[]])
    const [historyIndex, setHistoryIndex] = useState<number>(0)

    const createNode = (classer: string) => {
        let x = (contextMenuPosition[0] - (width / 2))/viewport[2] + viewport[0]
        let y = (contextMenuPosition[1] - (height / 2))/viewport[2] + viewport[1]
        setNodes([...nodes, new Node(classer, '', [x, y])])
        saveHistory()
    }

    const selectNode = (id: string, shift:boolean) => {
        setSelectedNodes(shift ? [...selectedNodes, id] : [id])
    }

    const deselectNode = (id: string, shift:boolean) => {
        if(selectedNodes.length > 1){
            setSelectedNodes(shift ? selectedNodes.filter(v => v !== id) : [id])
        } else {
            setSelectedNodes([])
        }
    }

    const addField = (id: string) => {
        setNodes(nodes.map(vv => {
            if(vv.id === id){
                return new Node(vv.classer, vv.type, vv.position, vv.id, [...vv.fields, {key:'', value:''}], vv.children, vv.thumbnail)
            } else {
                return vv
            }
        }))
        saveHistory()
    }

    const changeFieldKey = (id: string, index: number, value: string) => {
        setNodes(nodes.map(vv => {
            if(vv.id === id){
                return new Node(vv.classer, vv.type, vv.position, vv.id, vv.fields.map((vvv, iii) => {
                    if(iii === index){
                        return {key:value, value:vvv.value}
                    } else {
                        return vvv
                    }
                }), vv.children, vv.thumbnail)
            } else {
                return vv
            }
        }))
        saveHistory()
    }

    const changeFieldValue = (id: string, index: number, value: string) => {
        setNodes(nodes.map(vv => {
            if(vv.id === id){
                return new Node(vv.classer, vv.type, vv.position, vv.id, vv.fields.map((vvv, iii) => {
                    if(iii === index){
                        return {key:vvv.key, value:value}
                    } else {
                        return vvv
                    }
                }), vv.children, vv.thumbnail)
            } else {
                return vv
            }
        }))
        saveHistory()
    }

    const changeNodeType = (id: string, value: string) => {
        setNodes(nodes.map(vv => {
            if(vv.id === id){
                return new Node(vv.classer, value, vv.position, vv.id, vv.fields, vv.children, vv.thumbnail)
            } else {
                return vv
            }
        }))
        saveHistory()
    }

    const changeNodeClasser = (id: string, value: string) => {
        setNodes(nodes.map(vv => {
            if(vv.id === id){
                return new Node(value, vv.type, vv.position, vv.id, vv.fields, vv.children, vv.thumbnail)
            } else {
                return vv
            }
        }))
        saveHistory()
    }

    const removeField = (id: string, index: number) => {
        setNodes(nodes.map(vv => {
            if(vv.id === id){
                return new Node(vv.classer, vv.type, vv.position, vv.id, vv.fields.filter((vvv, iii) => iii !== index), vv.children, vv.thumbnail)
            } else {
                return vv
            }
        }))
        saveHistory()
    }

    const restoreHistory = (index: number) => {
        setNodes(history[index])
        setHistoryIndex(index)
    }

    const saveHistory = () => {
        setHistory([...history.slice(0, historyIndex), nodes])
        setHistoryIndex(historyIndex + 1)
    }

    const linkNode = (from:string, to:string) => {
        if(!nodes.find(v => v.id === from)?.children.includes(to)){
            setNodes(nodes.map(v => {
                if(v.id === from){
                    return new Node(v.classer, v.type, v.position, v.id, v.fields, [...v.children, to], v.thumbnail)
                } else {
                    return v
                }
            }))
            saveHistory()
        }
    }

    const unlinkNode = (target:string, type:'head'|'tail') => {
        setNodes(nodes.map(v => {
            if(v.id === target && type === 'tail'){
                return new Node(v.classer, v.type, v.position, v.id, v.fields, [], v.thumbnail)
            } else if(v.children.includes(target) && type === 'head'){
                return new Node(v.classer, v.type, v.position, v.id, v.fields, v.children.filter(vv => vv !== target), v.thumbnail)
            } else {
                return v
            }
        }))
        saveHistory()
    }

    const renderNodes = () => {
        return nodes.filter(v => {
            let {pos, size} = getNodeTransform(v)
            return checkAABBCollision([0, 0], [width, height], pos, size)
        }).map((v, i) => {
            return <div key={i} className={`rounded-lg bg-gray-600 flex flex-col justify-start items-center gap-2 absolute w-60 ${selectedNodes.includes(v.id) ? 'border-2 border-white' : ''}`}
                style={{left: width/2 + (v.position[0] - viewport[0])*viewport[2] + (selectedNodes.includes(v.id) && mouseDraggingTarget === 'node' ? dragOffset[0] : 0),
                top: height/2 + (v.position[1] - viewport[1])*viewport[2] + (selectedNodes.includes(v.id) && mouseDraggingTarget === 'node' ? dragOffset[1] : 0),
                transform:`translate(-50%, -50%) scale(${viewport[2]})`}}>
                <div className={`rounded-tr-lg rounded-tl-lg p-2 w-full flex justify-center items-center font-semibold`}
                style={{backgroundColor:colorMap[colorMap.findIndex(vv => vv[0] === v.classer)][1] || '#777'}}
                onMouseMove={e => {
                    if(isDragging && mouseDraggingTarget === 'node' && !selectedNodes.includes(v.id)){
                        selectNode(v.id, e.shiftKey)
                    }
                }}
                id="node"
                onMouseUp={e => {
                    if(mouseDraggingTarget === 'node'){
                        if(!isDragging){
                            if(!selectedNodes.includes(v.id)) {
                                selectNode(v.id, e.shiftKey)
                            } else {
                                deselectNode(v.id, e.shiftKey)
                            }
                        } else {
                            setNodes(nodes.map(vv => {
                                if(selectedNodes.includes(vv.id)){
                                    return new Node(vv.classer, vv.type, [vv.position[0] + (dragOffset[0])/viewport[2], vv.position[1] + (dragOffset[1])/viewport[2]], vv.id, vv.fields, vv.children, vv.thumbnail)
                                } else {
                                    return vv
                                }
                            }))
                            saveHistory()
                        }
                    }
                }}
                >
                    <select name="" id="node" value={v.classer} className="bg-transparent text-center focus:outline-none" onChange={e => changeNodeClasser(v.id, e.target.value)}>
                        {colorMap.map((vv, ii) => {
                            return <option key={ii} value={vv[0]} className="bg-black">{vv[0]}</option>
                        })}
                    </select>
                </div>
                <input type="text" name="" id="" className="bg-transparent border-none p-1 focus:outline-none" style={{width:'90%'}} placeholder="Type" value={v.type} onChange={e => changeNodeType(v.id, e.target.value)}/>
                {v.fields.map((vv, ii) => {
                    return <div className="flex flex-row items-center justify-around" key={ii}>
                        <input type="text" name="" id="" className="bg-[#ffffff11] rounded-md border-none p-1 focus:outline-none" style={{width:'30%'}} placeholder="Field"
                        onChange={e => changeFieldKey(v.id, ii, e.target.value)} value={vv.key}/>
                        <input type="text" name="" id="" className="bg-[#ffffff11] rounded-md border-none p-1 focus:outline-none" style={{width:'50%'}} placeholder="Value"
                        onChange={e => changeFieldValue(v.id, ii, e.target.value)} value={vv.value}/>
                        <button className="bg-[#ffffff11] rounded-md border-none p-1 hover:bg-[#ffffff22]" style={{width:'10%'}} onClick={e => removeField(v.id, ii)}>-</button>
                    </div>
                })}
                <button className="w-full bg-[#ffffff11] rounded-br-lg rounded-bl-lg hover:bg-[#ffffff22] font-bold text-2xl"
                onClick={e => addField(v.id)}>+</button>
                <div className="absolute bg-[#00ffff] left-0 rounded-sm"
                style={{width:nodeLinkerSize, height:nodeLinkerSize, transform:`translate(-50%, -50%) rotate(45deg)`, top:'50%'}}
                onMouseDown={e => {
                    setTargetNode([v.id, 0])
                }}
                onMouseUp={e => {
                    if(targetNode[0] !== '' && targetNode[0] !== v.id && targetNode[1] !== -1 && targetNode[1] == 1){
                        linkNode(targetNode[0], v.id)
                    }
                }}
                onClick={e => {
                    if(e.altKey){
                        unlinkNode(v.id, 'head')
                    }
                }}
                ></div>
                <div className="absolute bg-[#ffff00] right-0 rounded-sm"
                style={{width:nodeLinkerSize, height:nodeLinkerSize, transform:`translate(50%, -50%) rotate(45deg)`, top:'50%'}}
                onMouseDown={e => {
                    setTargetNode([v.id, 1])
                }}
                onMouseUp={e => {
                    if(targetNode[0] !== '' && targetNode[0] !== v.id && targetNode[1] !== -1 && targetNode[1] == 0){
                        linkNode(v.id, targetNode[0])
                    }
                }}
                onClick={e => {
                    if(e.altKey){
                        unlinkNode(v.id, 'tail')
                    }
                }}
                ></div>
            </div>
        })
    }

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()
            setContextMenuPosition([e.clientX, e.clientY])
            setContextMenuVisible(true)
        }
        window.addEventListener('contextmenu', handleContextMenu)
        return () => {
            window.removeEventListener('contextmenu', handleContextMenu)
        }
    }, [contextMenuPosition, contextMenuVisible])

    useEffect(() => {
        const handleMousemove = (e: MouseEvent) => {
            if(isMousedown){
                if(!isDragging){
                    setIsDragging(true)
                }
                setDragOffset([e.clientX - dragStart[0], e.clientY - dragStart[1]])
            }
        }
        const handleMouseup = (e: MouseEvent) => {
            if(isDragging){
                setIsDragging(false)
                setDragOffset([0, 0])
            }
            setMouseDraggingTarget('')
            setIsMousedown(false)
            setTargetNode(['', -1])
        }
        const handleMousedown = (e: MouseEvent) => {
            setIsMousedown(true)
            setDragStart([e.clientX, e.clientY])
            if((e.target as HTMLElement).id === 'bg'){
                setMouseDraggingTarget('bg')
            } else if ((e.target as HTMLElement).id === 'node'){
                setMouseDraggingTarget('node')
            }
        }
        document.addEventListener('mousedown', handleMousedown)
        document.addEventListener('mousemove', handleMousemove)
        window.addEventListener('mouseup', handleMouseup)
        return () => {
            document.removeEventListener('mousedown', handleMousedown)
            document.removeEventListener('mousemove', handleMousemove)
            window.removeEventListener('mouseup', handleMouseup)
        }
    }, [isMousedown, isDragging, dragStart])

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if(e.altKey) e.preventDefault()
            if(e.code === 'Tab') {
                e.preventDefault()
                setNavbarVisible(!navbarVisible)
            }
            if(!keymap.includes(e.key)){
                setKeymap([...keymap, e.key])
            }
        }
        const handleKeyup = (e: KeyboardEvent) => {
            setKeymap(keymap.filter(v => v !== e.key))
        }
        window.addEventListener('keydown', handleKeydown)
        window.addEventListener('keyup', handleKeyup)
        return () => {
            window.removeEventListener('keydown', handleKeydown)
            window.removeEventListener('keyup', handleKeyup)
        }
    }, [keymap, navbarVisible])

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if(keymap.includes(' ')){
                setViewport([viewport[0] - e.deltaX, viewport[1] - e.deltaY, viewport[2]])
            } else {
                let zoom = (viewport[2] - e.deltaY/1000)
                setViewport([viewport[0], viewport[1], zoom < 0.1 ? 0.1 : zoom])
            }
        }
        window.addEventListener('wheel', handleWheel)
        return () => {
            window.removeEventListener('wheel', handleWheel)
        }
    }, [viewport, keymap])

    // keyboard shortcuts
    useEffect(() => {
        if(keymap.includes(' ')){
            setPanning(true)
            document.body.style.cursor = 'grab'
        } else {
            setPanning(false)
            document.body.style.cursor = 'default'
        }
    }, [keymap])

    const handlePanning = (e: MouseEvent) => {
        if(panning && isDragging){
            setViewport([viewport[0] - (e.movementX)/viewport[2], viewport[1] - (e.movementY)/viewport[2], viewport[2]])
        }
    }

    const checkAABBCollision = (a: [number, number], b: [number, number], c: [number, number], d: [number, number]) => {
        return a[0] < c[0] + d[0] && a[0] + b[0] > c[0] && a[1] < c[1] + d[1] && a[1] + b[1] > c[1]
    }

    const getNodeTransform = (node: Node) => {
        let selected = selectedNodes.includes(node.id) && mouseDraggingTarget === 'node'
        let size:[number, number] = [240*viewport[2], (120 + node.fields.length * 40)*viewport[2]]
        let pos:[number, number] = [
            (width/2 + (node.position[0] - viewport[0])*viewport[2]) - size[0]/2 + (selected ? dragOffset[0] : 0),
            (height/2 + (node.position[1] - viewport[1])*viewport[2]) - size[1]/2 + (selected ? dragOffset[1] : 0)
        ]
        return {pos, size}
    }

    useEffect(() => {
        const handleDelete = (e: KeyboardEvent) => {
            if(e.key === 'Delete'){
                e.preventDefault()
                let newNodes = [...nodes]
                selectedNodes.forEach(v => {
                    newNodes = newNodes.map(vv => {if(vv.children.includes(v)){
                            return new Node(vv.classer, vv.type, vv.position, vv.id, vv.fields, vv.children.filter(vv => vv !== v), vv.thumbnail)
                        } else {
                            return vv
                        }
                    })
                })
                setNodes(newNodes.filter(v => !selectedNodes.includes(v.id)))
                setSelectedNodes([])
                saveHistory()
            }
        }
        window.addEventListener('keydown', handleDelete)
        return () => {
            window.removeEventListener('keydown', handleDelete)
        }
    }, [nodes, selectedNodes, history, historyIndex])

    useEffect(() => {
        const handleCopy = (e: KeyboardEvent) => {
            if(e.key === 'c' && e.ctrlKey){
                setClipboard(nodes.filter(v => selectedNodes.includes(v.id)))
            }
        }
        window.addEventListener('keydown', handleCopy)
        return () => {
            window.removeEventListener('keydown', handleCopy)
        }
    }, [nodes, selectedNodes])

    useEffect(() => {
        const handlePaste = (e: KeyboardEvent) => {
            if(e.key === 'v' && e.ctrlKey){
                setNodes([...nodes, ...clipboard.map(v => new Node(v.classer, v.type, [v.position[0] + 10, v.position[1] + 10], generateRandomString(10), v.fields, v.children, v.thumbnail))])
            }
        }
        window.addEventListener('keydown', handlePaste)
        return () => {
            window.removeEventListener('keydown', handlePaste)
        }
    }, [nodes, clipboard])

    useEffect(() => {
        const handleDuplicate = (e: KeyboardEvent) => {
            if(e.key === 'd' && e.ctrlKey){
                e.preventDefault()
                let add = nodes.filter(v => selectedNodes.includes(v.id)).map(v => new Node(v.classer, v.type, [v.position[0] + 10, v.position[1] + 10], generateRandomString(10), v.fields, v.children, v.thumbnail))
                setNodes([...nodes, ...add])
                setSelectedNodes(add.map(v => v.id))
                saveHistory()
            }
        }
        window.addEventListener('keydown', handleDuplicate)
        return () => {
            window.removeEventListener('keydown', handleDuplicate)
        }
    }, [nodes, selectedNodes, history, historyIndex])

    useEffect(() => {
        const handleUndo = (e: KeyboardEvent) => {
            if(e.key === 'z' && e.ctrlKey){
                e.preventDefault()
                if(historyIndex > 0){
                    restoreHistory(historyIndex - 1)
                }
            }
        }
        document.addEventListener('keydown', handleUndo)
        return () => {
            document.removeEventListener('keydown', handleUndo)
        }
    }, [historyIndex, history])

    useEffect(() => {
        const handleRedo = (e: KeyboardEvent) => {
            if(e.key === 'y' && e.ctrlKey){
                e.preventDefault()
                if(historyIndex < history.length - 1){
                    restoreHistory(historyIndex + 1)
                }
            }
        }
        document.addEventListener('keydown', handleRedo)
        return () => {
            document.removeEventListener('keydown', handleRedo)
        }
    }, [historyIndex, history])

    useEffect(() => {
        const handleSelectAll = (e: KeyboardEvent) => {
            if(e.key === 'a' && e.ctrlKey){
                e.preventDefault()
                setSelectedNodes(nodes.map(v => v.id))
            }
        }
        document.addEventListener('keydown', handleSelectAll)
        return () => {
            document.removeEventListener('keydown', handleSelectAll)
        }
    }, [nodes])

    useEffect(() => {
        const handleDeselectAll = (e: KeyboardEvent) => {
            if(e.key === 'Escape'){
                setSelectedNodes([])
            }
        }
        document.addEventListener('keydown', handleDeselectAll)
        return () => {
            document.removeEventListener('keydown', handleDeselectAll)
        }
    }, [])

    useEffect(() => {
        const handleResetViewport = (e: KeyboardEvent) => {
            if(e.code === 'KeyR'){
                setViewport([0, 0, 1])
            }
        }
        document.addEventListener('keydown', handleResetViewport)
        return () => {
            document.removeEventListener('keydown', handleResetViewport)
        }
    }, [])

    useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            if(mouseDraggingTarget === 'bg' && isDragging && !panning){
                let selected:string[] = []
                let left = dragOffset[0] >= 0 ? dragStart[0] : dragStart[0] + dragOffset[0]
                let top = dragOffset[1] >= 0 ? dragStart[1] : dragStart[1] + dragOffset[1]
                let scale:[number, number] = [Math.abs(dragOffset[0]), Math.abs(dragOffset[1])]
                nodes.forEach(v => {
                    let {pos, size} = getNodeTransform(v)
                    checkAABBCollision([left, top], scale, pos, size) && selected.push(v.id)
                })
                setSelectedNodes(selected)
            }
        }
        document.addEventListener('mouseup', handleMouseUp)
        return () => {
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, dragOffset, dragStart, mouseDraggingTarget, nodes, viewport, width, height, panning])

    const GridCanvas = () => {
        const canvasRef = useRef(null);
      
        useEffect(() => {
            const canvas = canvasRef.current as unknown as HTMLCanvasElement;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return;
            }
        
            // 캔버스 초기화
            ctx.clearRect(0, 0, width, height);
        
            // 그리드 간격 설정
            const gridSize = 100;
            const scaledGridSize = gridSize * viewport[2];
        
            // 화면 중앙을 기준으로 그리드 그리기
            const centerX = width / 2;
            const centerY = height / 2;
            const startX = centerX - (viewport[0] * viewport[2]);
            const startY = centerY - (viewport[1] * viewport[2]);

            // 그리드 그리기
            ctx.strokeStyle = '#111';
            ctx.beginPath();
            for (let x = startX % scaledGridSize; x < width; x += scaledGridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            }
            for (let y = startY % scaledGridSize; y < height; y += scaledGridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            }
            ctx.stroke();
        }, [width, height, viewport]);

        return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute' }} id="bg"
        onMouseDown={e => {
            if(e.target === e.currentTarget){
                setSelectedNodes([])
                setContextMenuVisible(false)
            }
        }}
        onMouseUp={e => {
            if(e.target === e.currentTarget){
                setContextMenuVisible(false)
            }
        }}
        onMouseMove={e => handlePanning(e as unknown as MouseEvent)}/>;
    };

    const LineBetweenPoints: FC<{target:{pos:[number, number];size:[number,number]}; point2:[number, number]; idx:number}> = ({ target, point2, idx }) => {
        let x:number = target.pos[0] + (idx == 1 ? target.size[0] : 0);
        let y:number = target.pos[1] + target.size[1]/2;
        const deltaX = point2[0] - x;
        const deltaY = point2[1] - y;
        const gap = 12;
        const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY) - gap;
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        const dx = x + Math.cos(angle * Math.PI / 180) * (gap/2);
        const dy = y + Math.sin(angle * Math.PI / 180) * (gap/2);

        const lineStyle: CSSProperties = {
          width: `${length}px`,
          transform: `rotate(${angle}deg)`,
          transformOrigin: 'left',
          position: 'absolute',
          left: `${dx}px`,
          top: `${dy}px`,
          borderRadius: '10px',
          height: `${2*viewport[2]}px`, // 선의 두께
          backgroundImage: `linear-gradient(to ${idx ? 'right' : 'left'}, #FF0, #0FF)`,
        };

        return <div style={lineStyle} />;
    };

    const renderLines = () => {
        return nodes.filter(v => {
            let {pos, size} = getNodeTransform(v)
            let checkChildren = v.children.map(vv => {
                let target = getNodeTransform(nodes.find(vvv => vvv.id === vv) as Node)
                return checkAABBCollision([0, 0], [width, height], target.pos, target.size)
            })
            return v.children.length > 0 && checkAABBCollision([0, 0], [width, height], pos, size) || checkChildren.includes(true)
        }).map((v, i) => {
            return v.children.map((vv, ii) => {
                let tailnode = nodes.find(vvv => vvv.id === vv)
                if(tailnode){
                    let me = getNodeTransform(v)
                    let target = getNodeTransform(tailnode)
                    let x = target.pos[0]
                    let y = target.pos[1] + target.size[1]/2
                    return <LineBetweenPoints target={me} point2={[x, y]} idx={1} key={ii}/>
                } else {
                    return null
                }
            })
        })
    }

    return <div className="w-full h-full bg-black flex select-none text-white box-border" id="bg">
        {GridCanvas()}
        {renderNodes()}
        {renderLines()}
        {targetNode[0] !== '' && targetNode[1] !== -1 && <LineBetweenPoints
            target={getNodeTransform(nodes.find(v => v.id === targetNode[0]) as Node)}
            point2={[dragStart[0] + dragOffset[0], dragStart[1] + dragOffset[1]]}
            idx={targetNode[1]}
        />}
        {contextMenu(colorMap, contextMenuPosition, contextMenuVisible, createNode, setContextMenuVisible)}
        {isDragging && mouseDraggingTarget === 'bg' && !panning && <div className="bg-[#ffffff22] absolute border border-white rounded-md"
        style={{
            left: dragOffset[0] >= 0 ? dragStart[0] : dragStart[0] + dragOffset[0],
            top: dragOffset[1] >= 0 ? dragStart[1] : dragStart[1] + dragOffset[1],
            width: Math.abs(dragOffset[0]),
            height: Math.abs(dragOffset[1]),
        }}></div>}
        {!navbarVisible && <div className="absolute bg-white bg-opacity-10 right-1 top-1 p-1 rounded-md">Press "Tab" to show menu.</div>}
        {navbarVisible && navbar(colorMap, setColorMap, nodes, setNodes)}
        <div className="absolute bg-white bg-opacity-10 left-1 top-1 p-1 rounded-md">
            Viewport : {viewport[0].toFixed(2)} {viewport[1].toFixed(2)}<br />
            Zoom : {Math.round(viewport[2]*100)}%
        </div>
    </div>
}

const contextMenu = (colorMap:[string, string][], position: [number, number], visible: boolean, createNode:(...args:any[]) => void, setContextMenuVisible:(bool:boolean) => void) => {
    return <div className={`absolute bg-gray-800 rounded-lg border border-gray-600 ${visible ? 'visible' : 'invisible'}`} style={{left:position[0], top:position[1]}}>
        {colorMap.map((v, i) => {
            return <div key={i} className="p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
            onClick={e => {
                createNode(v[0])
                setContextMenuVisible(false)
            }}>{v[0]}</div>
        })}
    </div>
}

const navbar = (colorMap:[string, string][], setColorMap:React.Dispatch<React.SetStateAction<[string, string][]>>,
    nodes:Node[], setNodes:React.Dispatch<React.SetStateAction<Node[]>>) => {
    return <div className="w-60 h-full bg-slate-800 absolute right-0 p-2 flex flex-col gap-2 justify-start items-center overflow-auto">
        <div className="flex flex-row justify-center items-center gap-2 w-full">
            <button className="flex-1 p-1 bg-[#ffffff11] hover:bg-[#ffffff22] rounded-md" onClick={e => setNodes([])}>New</button>
            <button className="flex-1 p-1 bg-[#ffffff11] hover:bg-[#ffffff22] rounded-md"
            onClick={e => {
                let json = JSON.stringify(nodes)
                let file = new Blob([json], {type: 'application/json'})
                let a = document.createElement('a')
                a.href = URL.createObjectURL(file)
                a.download = 'save.json'
                a.click()
            }}>Save</button>
            <button className="flex-1 p-1 bg-[#ffffff11] hover:bg-[#ffffff22] rounded-md" onClick={e => {
                const file = document.createElement('input')
                file.type = 'file'
                file.accept = '.json'
                file.onchange = e => {
                    let reader = new FileReader()
                    reader.onload = e => {
                        let json = e.target?.result as string
                        setNodes(JSON.parse(json).map((v: any) => Object.assign(new Node('', '', [0, 0]), v)))
                    }
                    reader.readAsText((e.target as HTMLInputElement).files?.item(0) as Blob)
                }
                file.click()
            }}>Load</button>
        </div>
        {colorMap.map((v, i) => {
            return <div key={i} className="flex flex-row justify-center items-center gap-2 w-full">
                <input className="p-1 bg-[#ffffff11] hover:bg-[#ffffff22] rounded-md focus:outline-none" style={{width:130}} type="text" name="" id="" value={v[0]}
                onChange={e => {
                    setColorMap(colorMap.map((vv, ii) => {
                        if(ii === i){
                            return [e.target.value, vv[1]]
                        } else {
                            return vv
                        }
                    }))
                    setNodes(nodes.map(vv => {
                        if(vv.classer === v[0]){
                            return new Node(e.target.value, vv.type, vv.position, vv.id, vv.fields, vv.children, vv.thumbnail)
                        } else {
                            return vv
                        }
                    }))
                }} />
                <input type="color" name="" id="" className="flex-1 p-1 bg-[#ffffff11] hover:bg-[#ffffff22] rounded-md focus:outline-none" value={v[1]}
                onChange={e => {
                    setColorMap(colorMap.map((vv, ii) => {
                        if(ii === i){
                            return [vv[0], e.target.value]
                        } else {
                            return vv
                        }
                    }))
                }}/>
                <button className="bg-[#ffffff11] hover:bg-[#ffffff22] rounded-md text-2xl" style={{width:30}}
                onClick={e => {
                    setColorMap(colorMap.filter((vv, ii) => ii !== i))
                    setNodes(nodes.filter(vv => vv.classer !== v[0]))
                }}>-</button>
            </div>
        })}
        <button className="w-full bg-[#ffffff11] rounded-md hover:bg-[#ffffff22] font-bold text-2xl"
        onClick={e => {
            setColorMap([...colorMap, ['', '#ffffff']])
        }}>+</button>
    </div>
}