
interface Props {
    userSelect: string[];
    bufferSize: number
    matrixHover: string
}

// Display and load the empty buffer squares once user clicks
function displayBuffer(bufferSize: number, userSelect: string[], matrixHover:string) {

    let elements = []
    for (let i = 0; i < bufferSize; i++) {
        elements.push(
            <div key={i} className={`border-2 h-8 min-w-8 flex items-center justify-center border-opacity-30 
                ${userSelect[i] !== undefined ? "border-cyber-green border-solid border-opacity-100 text-cyber-green" 
                : userSelect.length === i && matrixHover ? "border-cyber-blue border-solid border-opacity-100 text-cyber-blue" 
                : "border-cyber-lightgreen border-dashed"}`}>
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