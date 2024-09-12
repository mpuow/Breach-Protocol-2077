
interface Props {
    userSelect: string[];
    bufferSize: number
}

function displayBuffer(bufferSize:number, userSelect:string[]) {
    let elements = []
    for (let i = 0; i < bufferSize; i++) {
        elements.push(<div key={i} className="border-dashed border-2 border-[#C8D1A6] size-8 flex flex-grow items-center justify-center">{userSelect[i]}</div>)
    }
    console.log(elements)

    return elements
}

function Buffer(props: Props) {
    return (
        <div className="border-2 border-[#CEEC58] mt-2 p-2 w-1/4 container">
            <div className="space-x-2 flex flex-row">
                {displayBuffer(props.bufferSize, props.userSelect)}
            </div>
        </div>
    )
}

export default Buffer