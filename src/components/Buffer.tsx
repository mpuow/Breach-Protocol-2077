
interface Props {
    userSelect: string[];
    bufferSize: number
}

function displayBuffer(bufferSize: number, userSelect: string[]) {
    let elements = []
    for (let i = 0; i < bufferSize; i++) {
        elements.push(
            <div key={i} className="border-dashed border-2 border-cyber-lightgreen h-8 flex flex-grow items-center justify-center border-opacity-30">
                <span className="opacity-100">{userSelect[i]}</span>
            </div>
        )
    }
    // console.log(elements)

    return elements
}

export default function Buffer(props: Props) {
    return (
        <>
            <div className="border-2 border-cyber-green p-2 w-1/2">
                <div className="space-x-2 flex flex-row p-2">
                    {displayBuffer(props.bufferSize, props.userSelect)}
                </div>
            </div>
        </>
    )
}