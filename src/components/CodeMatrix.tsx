import { useEffect, useState } from 'react'

interface Props {
    userSelect: string[]
    setUserSelect: React.Dispatch<React.SetStateAction<string[]>>
    bufferSize: number
    solutionStringArray: string[]
    setSolutionStringArray: React.Dispatch<React.SetStateAction<string[]>>
    matrixSize: number
}

export function randomNumber(length:number) {
    return Math.floor(Math.random() * length)
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

    function generateCombination() {
        const possibleCombinations = ["E9", "55", "BD", "1C", "7A", "FF"]
        const combination: string[] = []
        for (let i = 0; i < possibleCombinations.length; i++) {
            combination.push(possibleCombinations[randomNumber(props.matrixSize)])
        }
        return combination
    }

    function generateCodeMatrix() {
        for (let i = 0; i < 6; i++) {
            setCombinationBoard((prevRow) => [...prevRow, generateCombination()])
        }
    }

    function DisplayCodeMatrix() {
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
        const solutionStringLength = 7
        const solutionStringCoords: number[][] = []
        const localSolutionString:string[] = []
        let colIndex:number = -1
        let rowIndex:number = -1
        let prevColIndex:number
        let prevRowIndex:number
        let selectRow = false

        /*
            Generates the coordinates for the solution sequence

            How the algorithm works:
                1. First run forces the rowIndex to be 0 and selectRow to be false (as we are selecting a column)
                2. Sets the prevIndex for either col or row
                3. Generates a random index
                4. Ensures no unlucky backtracking with the while loop
                5. Pushes the coords to the array
                6. Updates selectRow to alternate between selecting a new column or row
                7. Repeat

            This works because all we need to do to find a valid path is change one index at a time, while ensuring we do not backtrack along the path
            Eg: [0,5] -> [4,5] -> [4,2] -> [0,2]

        */
        for (let i = 0; i < solutionStringLength; i++) {
            if (selectRow) {
                prevRowIndex = rowIndex
                while (rowIndex === prevRowIndex) { rowIndex = randomNumber(props.matrixSize) }
                solutionStringCoords.push([rowIndex, colIndex])
                selectRow = false
            } else {
                prevColIndex = colIndex
                while (colIndex === prevColIndex) { colIndex = randomNumber(props.matrixSize) }
                if (rowIndex === -1) { rowIndex = 0 }
                solutionStringCoords.push([rowIndex, colIndex])
                selectRow = true
            }
        }

        // Adds generated coordinates to localSolutionString array
        for (let i = 0; i < solutionStringCoords.length; i++) {
            {combinationBoard.map((row, rowIndex) => {
                row.map((val, colIndex) => {
                    if (rowIndex === solutionStringCoords[i][0] && colIndex === solutionStringCoords[i][1]) {
                        localSolutionString.push(val)
                    }
                })
            })}
        }

        // Sets solutionString with the local generated string
        props.setSolutionStringArray(localSolutionString)

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
                    <DisplayCodeMatrix />
                </tbody>
            </table>
            <span onClick={() => generateSolutionString()}>Generate Solution String</span>
        </div>
    )
}