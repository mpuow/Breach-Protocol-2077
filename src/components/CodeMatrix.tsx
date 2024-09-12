import { useEffect, useState } from 'react'

interface Props {
    userSelect: string[]
    setUserSelect: React.Dispatch<React.SetStateAction<string[]>>
    bufferSize: number
    setSolutionString: React.Dispatch<React.SetStateAction<string>>
    matrixSize: number
}

export default function CodeMatrix(props: Props) {
    const [selection, setSelection] = useState<number>()
    const [combinationBoard, setCombinationBoard] = useState<string[][]>([])

    useEffect(() => {
        generateCodeMatrix()

        return () => {
            setCombinationBoard([])
        }

    }, [])

    function randomNumber(length:number) {
        return Math.floor(Math.random() * length)
    }

    function generateCombination() {
        const possibleCombinations = ["E9", "55", "BD", "1C", "7A", "FF"]
        const combination: string[] = []
        for (let i = 0; i < 6; i++) {
            combination.push(possibleCombinations[randomNumber(props.matrixSize)])
        }
        return combination
    }

    function generateCodeMatrix() {
        for (let i = 0; i < 6; i++) {
            setCombinationBoard((prevRow) => [...prevRow, generateCombination()])
        }
    }

    function displayCodeMatrix() {
        return (
            <>
                {combinationBoard.map((row, rowIndex) => (
                    <tr
                        key={rowIndex}
                        className="hover:bg-red-500 table-auto">
                        {row.map((val, colIndex) => (
                            <td
                                key={colIndex}
                                className={`p-4 select-none ${colIndex === selection ? 'bg-blue-500' : ''} hover:bg-[#CEEC58] text-[#C8D1A6]`}
                                onClick={() => clickCell(val, rowIndex, colIndex)}
                                onMouseEnter={() => setSelection(colIndex)}
                                onMouseLeave={() => setSelection(-1)}>
                                {val}
                            </td>
                        ))}
                    </tr>
                ))}
            </>
        )
    }

    function generateSolutionString() {
        // {combinationBoard.map((row, rowIndex) => {
        //     row.map((val, colIndex) => {
        //         if (rowIndex === 0 && colIndex === 5) {
        //             console.log(val)
        //         }
        //     })
        // })}

        const solutionStringLength = 7
        const solutionStringCoords = []
        let colIndex
        let rowIndex
        let selectRow = false
        
        // column = randomNumber(props.matrixSize)
        // solutionStringCoords.push([0, column])
        
        for (let i = 0; i < solutionStringLength - 1; i++) {

            if (selectRow) {
                rowIndex = randomNumber(props.matrixSize)
                solutionStringCoords.push([rowIndex, colIndex])
                selectRow = false
            } else {
                colIndex = randomNumber(props.matrixSize)
                if (rowIndex === undefined) { rowIndex = 0 }
                solutionStringCoords.push([rowIndex, colIndex])
                selectRow = true
            }
            
        }

        console.log(solutionStringCoords)

    }

    function clickCell(val: string, rowIndex:number, colIndex:number) {
        if (props.userSelect.length != props.bufferSize) {
            props.setUserSelect((prevSelection) => [...prevSelection, val])
            console.log("Row key: " + rowIndex + "     Col Key: " + colIndex)
        } else {
            console.log("out of buffer")
        }
    }

    return (
        <div className='border-t-[1px] border-[#CEEC58]'>
            <div className="border-t-[1px] border-[#CEEC58] bg-[#CEEC58] text-black p-2">CODE MATRIX</div>
            <table className="border-2 flex justify-center">
                <tbody className='hover:bg-purple-900'>
                    {displayCodeMatrix()}
                </tbody>
            </table>
            <span onClick={() => generateSolutionString()}>eroghun</span>
        </div>
    )
}