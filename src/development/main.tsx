import { useEffect, useState } from "react"
import Node from "./node"

const classColors = {
    'resource': '#FFCC00',
    'creature': '#33DD33',
    'item': '#0099FF',
    'projectile': '#CC00FF',
    'effect': '#FF0066',
    'structure': '#3333CC',
    'vehicle': '#FF9933',
    'recipe': '#FFFF00',
    'region': '#9933FF'
}

export default function Main(){
    const [viewport, setViewport] = useState<[number, number, number]>([0, 0, 1])
    const [contextMenuPosition, setContextMenuPosition] = useState<[number, number]>([0, 0])
    const [contextMenuVisible, setContextMenuVisible] = useState(false)
    const [nodes, setNodes] = useState<Node[]>([])
    const [isMousedown, setIsMousedown] = useState<boolean>(false)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [dragStart, setDragStart] = useState<[number, number]>([0, 0])
    const [dragOffset, setDragOffset] = useState<[number, number]>([0, 0])
    const [selectedNodes, setSelectedNodes] = useState<string[]>([])

    const createNode = (classer: classes) => {
        setNodes([...nodes, new Node(classer, '', contextMenuPosition)])
    }

    const selectNode = (id: string) => {
        setSelectedNodes([...selectedNodes, id])
    }

    const deselectNode = (id: string) => {
        setSelectedNodes(selectedNodes.filter(v => v !== id))
    }

    const renderNodes = () => {
        return nodes.map((v, i) => {
            return <div key={i} className={`rounded-lg bg-gray-600 flex flex-col justify-start items-center absolute w-60 ${selectedNodes.includes(v.id) ? 'border-2 border-white' : ''}`}
                style={{left: v.position[0], top: v.position[1]}}>
                <div className={`rounded-tr-lg rounded-tl-lg p-2 w-full flex justify-center items-center font-semibold`} style={{backgroundColor:classColors[v.classer]}}
                onMouseMove={e => {
                    if(isMousedown){
                        selectNode(v.id)
                    }
                }}>{v.classer}</div>
                <input type="text" name="" id="" className="bg-transparent border-none p-1 selection:outline-none" style={{width:'90%'}} placeholder="Type"/>
                <button className="w-full bg-[#ffffff11] rounded-br-lg rounded-bl-lg hover:bg-[#ffffff22] font-bold text-2xl">+</button>
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
            }
            setIsMousedown(false)
        }
        const handleMousedown = (e: MouseEvent) => {
            setIsMousedown(true)
            setDragStart([e.clientX, e.clientY])
        }
        window.addEventListener('mousedown', handleMousedown)
        window.addEventListener('mousemove', handleMousemove)
        window.addEventListener('mouseup', handleMouseup)
        return () => {
            window.removeEventListener('mousedown', handleMousedown)
            window.removeEventListener('mousemove', handleMousemove)
            window.removeEventListener('mouseup', handleMouseup)
        }
    }, [isMousedown, isDragging, dragStart])

    return <div className="w-full h-full bg-black flex select-none"
        onMouseDown={e => {
            if(e.target === e.currentTarget){
                setSelectedNodes([])
                setContextMenuVisible(false)
            }
        }}>
        {renderNodes()}
        {contextMenu(contextMenuPosition, contextMenuVisible, createNode)}
    </div>
}

const contextMenu = (position: [number, number], visible: boolean, createNode:(...args:any[]) => void) => {
    return <div className={`absolute bg-gray-800 rounded-lg border border-gray-600 ${visible ? 'visible' : 'invisible'}`} style={{left:position[0], top:position[1]}}>
        {Object.keys(classColors).map((v, i) => {
            return <div key={i} className="p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
            onClick={e => createNode(v)}>{v}</div>
        })}
    </div>
}