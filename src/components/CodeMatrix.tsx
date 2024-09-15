import { useEffect, useState } from 'react'
import "./CodeMatrix.css"

interface Props {
    userSelect: string[]
    setUserSelect: React.Dispatch<React.SetStateAction<string[]>>
    bufferSize: number
    solutionStringArray: string[]
    setSolutionStringArray: React.Dispatch<React.SetStateAction<string[]>>
    matrixSize: number
    combinationHover: string
    setCombinationHover: React.Dispatch<React.SetStateAction<string>>
    setMatrixHover: React.Dispatch<React.SetStateAction<string>>
    currentSequenceIndex: number
    setCurrentSequenceIndex: React.Dispatch<React.SetStateAction<number>>
}

// Generates a random number
export function randomNumber(length:number) {
    return Math.floor(Math.random() * length)
}

export default function CodeMatrix(props: Props) {
    const [selection, setSelection] = useState<number>()
    const [combinationBoard, setCombinationBoard] = useState<string[][]>([])

    // Generates the code matrix and solution string, also loads the code matrix on mount
    useEffect(() => {
        generateSolutionString(generateCodeMatrix())

        return () => {
            setCombinationBoard([])
        }

    }, [])

    // Generates random rows of combinations for the code matrix
    function generateCombination() {
        const possibleCombinations = ["E9", "55", "BD", "1C", "7A", "FF"]
        const combination: string[] = []
        for (let i = 0; i < possibleCombinations.length; i++) {
            combination.push(possibleCombinations[randomNumber(props.matrixSize)])
        }
        return combination
    }

    // Pushes the generates rows into the code matrix
    function generateCodeMatrix() {
        let localCombinationBoard = []
        for (let i = 0; i < props.matrixSize; i++) {
            // setCombinationBoard((prevRow) => [...prevRow, generateCombination()])
            localCombinationBoard.push(generateCombination())
        }

        return localCombinationBoard
    }

    // Generates the solution string based on the code matrix
    function generateSolutionString(localCombinationBoard:string[][]) {
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
            {localCombinationBoard.map((row, rowIndex) => {
                row.map((val, colIndex) => {
                    if (rowIndex === solutionStringCoords[i][0] && colIndex === solutionStringCoords[i][1]) {
                        localSolutionString.push(val)
                    }
                })
            })}
        }

        // Sets solutionString with the local generated string
        props.setSolutionStringArray(localSolutionString)

        setCombinationBoard(localCombinationBoard)
    }

    // Handles when a cell in the code matrix is clicked
    function clickCell(val: string) {
        if (props.userSelect.length + 1 != props.bufferSize) {
            props.setUserSelect((prevSelection) => [...prevSelection, val])
        } else {
            // console.log("out of buffer")
            props.setUserSelect((prevSelection) => [...prevSelection, val])
            // alert("Out of buffer. Lose game")
        }

        let setVariable = props.currentSequenceIndex + 1
        props.setCurrentSequenceIndex(setVariable)
    }

    // Handles the hover event for the cells
    function onHover(colIndex:number, val:string) {
        setSelection(colIndex)
        props.setMatrixHover(val)
    }

    // Resets the state after the hover event
    function stopHover() {
        setSelection(-1)
        props.setCombinationHover("")
        props.setMatrixHover("")
    }

    // Maps through the board and each row to display the code matrix
    function DisplayCodeMatrix() {
        return (
            <>
                {combinationBoard.map((row, rowIndex) => (
                    <tr key={rowIndex} className="table-auto hover:bg-[#292C39]">
                        {row.map((val, colIndex) => (
                            <td
                                key={colIndex}
                                className={`size-12 p-2 select-none text-cyber-lightgreen text-center
                                    ${colIndex === selection ? 'bg-[#1F2019]' : ''} 
                                    hover:double-border hover:text-cyber-blue hoverGlow text-xl 
                                    ${val == props.combinationHover ? "inner-cell" : ""}`}
                                onClick={() => clickCell(val)}
                                onMouseEnter={() => onHover(colIndex, val)}
                                onMouseLeave={() => stopHover()}>
                                {val}
                            </td>
                        ))}
                    </tr>
                ))}
            </>
        )
    }

    return (
        <div className='border-[1px] border-cyber-green'>
            <div className="bg-cyber-green text-black p-2 text-xl">CODE MATRIX</div>
            <table className="flex justify-center my-2" onMouseLeave={() => setSelection(-1)}>
                <tbody>
                    <DisplayCodeMatrix />
                </tbody>
            </table>
        </div>
    )
}