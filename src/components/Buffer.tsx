
interface Props {
    userSelect: string[];
    bufferSize: number
}

function displayBuffer(bufferSize: number, userSelect: string[]) {
    let elements = []
    for (let i = 0; i < bufferSize; i++) {
        elements.push(
            <div key={i} className="border-dashed border-2 border-cyber-lightgreen h-8 min-w-8 flex items-center justify-center border-opacity-30">
                <span>{userSelect[i]}</span>
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
                    {displayBuffer(props.bufferSize, props.userSelect)}
                </div>
            </div>
        </>
    )
}