import "./Buffer.css"

interface Props {
    userSelect: string[]
    bufferSize: number
    matrixHover: string
}

// Display and load the empty buffer squares, change on hover or click
function displayBuffer(bufferSize: number, userSelect: string[], matrixHover:string) {

    let elements = []
    for (let i = 0; i < bufferSize; i++) {
        elements.push(
            <div key={i} className={`border-2 h-8 min-w-8 flex items-center justify-center 
                ${userSelect[i] !== undefined ? "border-cyber-lightgreen border-solid border-opacity-100 text-cyber-lightgreen" 
                : userSelect.length === i && matrixHover ? "border-cyber-blue border-solid border-opacity-100 text-cyber-blue underline-animation" 
                : "border-cyber-lightgreen border-dashed border-opacity-30"}`}>
                <span>{userSelect[i] !== undefined ? userSelect[i] : userSelect.length === i ? matrixHover : ""}</span>
            </div>
        )
    }
    return elements
}

export default function Buffer(props: Props) {
    return (
        <>
            <div className="border-2 border-cyber-green p-2 w-auto">
                <div className="space-x-2 flex flex-row p-2 text-lg">
                    {displayBuffer(props.bufferSize, props.userSelect, props.matrixHover)}
                </div>
            </div>
        </>
    )
}