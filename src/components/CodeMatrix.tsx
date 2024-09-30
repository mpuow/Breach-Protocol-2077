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
    gameStart: React.MutableRefObject<boolean>
    gameStatus: string
    setGameStatus: React.Dispatch<React.SetStateAction<string>>
    gameReset: React.MutableRefObject<boolean>
    solutionLength: number
    sequenceArray: string[][]
}

// Generates a random number
export function randomNumber(length:number) {
    return Math.floor(Math.random() * length)
}

export default function CodeMatrix(props: Props) {
    const [columnHover, setColumnHover] = useState<number>(-1)
    const [rowHover, setRowHover] = useState<number>(-1)
    const [combinationBoard, setCombinationBoard] = useState<string[][]>([])
    const selectPlaceholder = "[ ]"
    const [selectRow, setSelectRow] = useState<number>(0)
    const [selectColumn, setSelectColumn] = useState<number>(0)
    const [isRowTurn, setIsRowTurn] = useState<boolean>(true)
    const [solvedArray, setSolvedArray] = useState<number[][]>([])

    // Generates the code matrix and solution string, also loads the code matrix on mount
    useEffect(() => {
        generateSolutionString(generateCodeMatrix())

        return () => {
            setCombinationBoard([])
        }

    }, [props.matrixSize])

    // Reset game state
    function resetGame() {
        // Generate a new matrix and solution
        generateSolutionString(generateCodeMatrix())

        // Reset all hover and select states
        setColumnHover(-1)
        setRowHover(-1)
        setSelectRow(0)
        setSelectColumn(0)
        setIsRowTurn(true)

        // Reset buffer
        props.setUserSelect([])

        // Reset timer
        props.gameReset.current = true
    }

    // Generates random rows of combinations for the code matrix
    function generateCombination() {
        const possibleCombinations = ["E9", "55", "BD", "1C", "7A", "FF"]
        const combination: string[] = []
        for (let i = 0; i < props.matrixSize; i++) {
            combination.push(possibleCombinations[randomNumber(possibleCombinations.length)])
        }
        return combination
    }

    // Pushes the generated rows into the code matrix
    function generateCodeMatrix() {
        let localCombinationBoard = []
        for (let i = 0; i < props.matrixSize; i++) {
            localCombinationBoard.push(generateCombination())
        }

        return localCombinationBoard
    }

    // Generates the solution string based on the code matrix
    function generateSolutionString(localCombinationBoard:string[][]) {
        try {
            props.setGameStatus("")
        } catch (error) {
            console.log(error)
        }

        const solutionStringLength = props.solutionLength
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

        // Generate solution string of given length
        for (let i = 0; i < solutionStringLength; i++) {
            if (selectRow) {
                prevRowIndex = rowIndex
                while (rowIndex === prevRowIndex) {
                    // Generate rowIndex
                    rowIndex = randomNumber(props.matrixSize)

                    // If coords are not already in solution string
                    if (!JSON.stringify(solutionStringCoords).includes(JSON.stringify([rowIndex, colIndex]))) {
                        solutionStringCoords.push([rowIndex, colIndex])
                    } else {
                        // Reset loop
                        rowIndex = prevRowIndex
                    }
                }
                selectRow = false
            } else {
                prevColIndex = colIndex
                while (colIndex === prevColIndex) {
                    // Generate colIndex
                    colIndex = randomNumber(props.matrixSize)

                    // If coords are not already in solution string
                    if (!JSON.stringify(solutionStringCoords).includes(JSON.stringify([rowIndex, colIndex]))) {
                        // First iteration rowindex is always 0
                        if (rowIndex === -1) { rowIndex = 0 }

                        solutionStringCoords.push([rowIndex, colIndex])
                    } else {
                        // Reset loop
                        colIndex = prevColIndex
                    }
                }
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

        console.log("solution string coords")
        console.log(solutionStringCoords)

        setCombinationBoard(localCombinationBoard)
    }

    // Handles when a cell in the code matrix is clicked
    function clickCell(val: string, rowIndex:number, colIndex:number) {
        
        // Check if it is a row or column turn
        if (isRowTurn && val !== selectPlaceholder) {
            // Disable clicking cells outside of the row
            if (rowIndex !== selectRow) {
                return
            }
            
            // Start the game
            props.gameStart.current = true

            // Set next turn column and change isRowTurn state
            setSelectColumn(colIndex)
            setIsRowTurn(false)
        } else if (val !== selectPlaceholder) {
            // Disable clicking cells outside of the column
            if (colIndex !== selectColumn) {
                return
            }

            // Set next turn row and change isRowTurn state
            setSelectRow(rowIndex)
            setIsRowTurn(true)
        }

        // Check val is not placeholder
        if (val !== selectPlaceholder) {
            props.setUserSelect((prevSelection) => [...prevSelection, val])
        }

        // Replace coordinates with placeholder
        let tempCombinationBoard = [...combinationBoard]
        tempCombinationBoard[rowIndex][colIndex] = selectPlaceholder
        setCombinationBoard(tempCombinationBoard)
    }

    // Handles the hover event for the cells
    function onHover(colIndex:number, val:string, rowIndex:number) {
        // Return if hovering a placeholder
        if (val === selectPlaceholder) {
            return
        }

        // Return if the column hovered in the row contains a placeholder
        if (combinationBoard[selectRow][colIndex] === selectPlaceholder && isRowTurn) {
            return
        }

        // Set hover indexes and val hover
        setColumnHover(colIndex)
        setRowHover(rowIndex)
        props.setMatrixHover(val)
    }

    // Resets the state after the hover event
    function stopHover() {
        setColumnHover(-1)
        setRowHover(-1)
        props.setCombinationHover("")
        props.setMatrixHover("")
    }

    function solveClick() {
        let localSequenceArray = [...props.sequenceArray]

        let foundSequencePath: number[][] = []

        let sequenceSearchIndexArray = [0,0,0]

        // let currentRowIndex = 0
        // let currentColIndex = 0

        // Function to search for first row starting points
        // Function to search rows
        // Function to search cols


        function searchStartRow() {
            let row = combinationBoard[0] // Default 0
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                for (let i = 0; i < localSequenceArray.length; i++) {
                    if (foundSequencePath.length === props.solutionLength) {
                        break
                    } else {
                        console.log("RESET")
                        sequenceSearchIndexArray = [0,0,0] // Reset every search
                        foundSequencePath = []
                    }
                    if (row[colIndex] === localSequenceArray[i][0]) { // If val matches first part of sequence
                        console.log("SEQUENCE START")
                        console.log(row[colIndex], 0, colIndex)
                        foundSequencePath.push([0, colIndex])

                        sequenceSearchIndexArray[i] = sequenceSearchIndexArray[i] + 1 // Increment index in sequence
                        // searchColumn([[rowIndex, colIndex]], i) // continue searching next column
                        searchColumn(0, colIndex, i, false)
                    }
                }
            }
        }

        function getColumn(getColIndex:number) {
            let column:string[] = []
            combinationBoard.map((row, _rowIndex) => {
                    row.map((val, colIndex) => {
                        if (colIndex === getColIndex) {
                            column.push(val)
                        }
                    })
            })
            return column
        }

        function searchRow(prevRowIndex:number, prevColIndex:number, currentSequenceIndex:number, startNewSequenceResult:boolean) {
            let localSequenceSearchIndexArray = sequenceSearchIndexArray
            let row = combinationBoard[prevRowIndex]
            for (let localColIndex = 0; localColIndex < row.length; localColIndex++) {
                sequenceSearchIndexArray = localSequenceSearchIndexArray

                
                if (localColIndex === prevColIndex) { continue } // Prevent backtracking
                if (startNewSequenceResult) {
                    for (let i = 0; i < localSequenceArray.length; i++) {
                        if (row[localColIndex] === localSequenceArray[i][sequenceSearchIndexArray[i]]) { // If val matches first part of sequence
                            console.log(">>  ROW")
                            console.log(row[localColIndex], prevRowIndex, localColIndex)
                            foundSequencePath.push([prevRowIndex, localColIndex])
    
                            sequenceSearchIndexArray[i] = sequenceSearchIndexArray[i] + 1 // Increment index in sequence

                            searchColumn(prevRowIndex, localColIndex, i, startNewSequence(currentSequenceIndex))
                        }
                    }
                } else {
                    if (row[localColIndex] === localSequenceArray[currentSequenceIndex][sequenceSearchIndexArray[currentSequenceIndex]]) { // If val matches first part of sequence
                        console.log(row[localColIndex], prevRowIndex, localColIndex)
                        foundSequencePath.push([prevRowIndex, localColIndex])
    
                        sequenceSearchIndexArray[currentSequenceIndex] = sequenceSearchIndexArray[currentSequenceIndex] + 1 // Increment index in sequence
    
                        searchColumn(prevRowIndex, localColIndex, currentSequenceIndex, startNewSequence(currentSequenceIndex))
                    }
                }
            }
        }

        function searchColumn(prevRowIndex:number, prevColIndex:number, currentSequenceIndex:number, startNewSequenceResult:boolean) {
            let localSequenceSearchIndexArray = sequenceSearchIndexArray
            let column = getColumn(prevColIndex)
            for (let localRowIndex = 0; localRowIndex < column.length; localRowIndex++) {
                sequenceSearchIndexArray = localSequenceSearchIndexArray

                if (localRowIndex === prevRowIndex) { continue } // Prevent backtracking
                if (startNewSequenceResult) {
                    for (let i = 0; i < localSequenceArray.length; i++) {
                        if (column[localRowIndex] === localSequenceArray[i][sequenceSearchIndexArray[i]]) { // If val matches first part of sequence
                            console.log(">>  COL")
                            console.log(column[localRowIndex], localRowIndex, prevColIndex)
                            foundSequencePath.push([localRowIndex, prevColIndex])
    
                            sequenceSearchIndexArray[i] = sequenceSearchIndexArray[i] + 1 // Increment index in sequence

                            searchRow(localRowIndex, prevColIndex, i, startNewSequence(currentSequenceIndex))
                        }
                    }
                } else {
                    console.log(column)
                    console.log(column[localRowIndex], localSequenceArray[currentSequenceIndex][sequenceSearchIndexArray[currentSequenceIndex]])
                    if (column[localRowIndex] === localSequenceArray[currentSequenceIndex][sequenceSearchIndexArray[currentSequenceIndex]]) { // If val matches part of sequence
                        console.log(column[localRowIndex], localRowIndex, prevColIndex)
                        foundSequencePath.push([localRowIndex, prevColIndex])
    
                        sequenceSearchIndexArray[currentSequenceIndex] = sequenceSearchIndexArray[currentSequenceIndex] + 1 // Increment index in sequence
    
                        searchRow(localRowIndex, prevColIndex, currentSequenceIndex, startNewSequence(currentSequenceIndex))
                    }
                }
            }
        }

        function startNewSequence(currentSequenceIndex:number) {
            if (localSequenceArray[currentSequenceIndex].length === sequenceSearchIndexArray[currentSequenceIndex]) { // Checking if sequence is complete
                sequenceSearchIndexArray[currentSequenceIndex] = -1 // Set sequence to complete
                if (JSON.stringify(sequenceSearchIndexArray) === `[-1,-1,-1]`) { // Check if all sequences are complete
                    console.log("COMPLETE SEQUENCE FOUND")
                    console.log(foundSequencePath)
                    setSolvedArray(foundSequencePath)
                } else {
                    console.log("complete")
                    return true
                }
            }
            return false
        }


        // function searchStartRow() {
        //     combinationBoard.map((row, rowIndex) => {
        //         if (rowIndex === 0) { // Starting row
        //             row.map((val, colIndex) => {
        //                 for (let i = 0; i < localSequenceArray.length; i++) {
        //                     if (foundSequencePath.length === props.solutionLength) {
        //                         break
        //                     } else {
        //                         console.log("RESET")
        //                         sequenceSearchIndexArray = [0,0,0] // Reset every search
        //                         foundSequencePath = []
        //                     }

        //                     if (val === localSequenceArray[i][0]) { // If val matches first part of sequence
        //                         console.log("SEQUENCE START")
        //                         console.log(val, rowIndex, colIndex)
        //                         // foundSequencePath.push([rowIndex, colIndex])

        //                         sequenceSearchIndexArray[i] = sequenceSearchIndexArray[i] + 1 // Increment index in sequence
        //                         searchColumn([[rowIndex, colIndex]], i) // continue searching next column
        //                     }
        //                 }
        //             })
        //         }
        //     })
        // }

        // function searchRow(currentRowIndex:number, currentSequenceIndex:number = -1, prevColMatch:number[][] = [[-1,-1]]) {
        //     combinationBoard.map((row, rowIndex) => {
        //         if (rowIndex === currentRowIndex) {
        //             row.map((val, colIndex) => {
        //                 if (colIndex !== prevColMatch[0][1] && !JSON.stringify(foundSequencePath).includes(JSON.stringify([rowIndex, colIndex]))) { // Prevents backtracking and re-finding coords
        //                     if (currentSequenceIndex !== -1) { // Default assume sequence in progress
        //                         // for (let i = 0; i < props.matrixSize; i++) {
        //                             if (val === localSequenceArray[currentSequenceIndex][sequenceSearchIndexArray[currentSequenceIndex]]) { // If val matches part of sequence
        //                                 console.log(val, rowIndex, colIndex)
        //                                 // foundSequencePath.push([rowIndex, colIndex])
        //                                 sequenceSearchIndexArray[currentSequenceIndex] = sequenceSearchIndexArray[currentSequenceIndex] + 1 // Increment index in sequence
        //                                 searchColumn([[rowIndex, colIndex]], currentSequenceIndex) // continue searching next column
        //                             }
        //                         // }
        //                     } else { // If no sequence in progress, start another sequence
        //                         for (let i = 0; i < localSequenceArray.length; i++) {
        //                             if (val === localSequenceArray[i][sequenceSearchIndexArray[i]]) { // If val matches part of sequence
        //                                 console.log(val, rowIndex, colIndex)
        //                                 // foundSequencePath.push([rowIndex, colIndex])
        //                                 sequenceSearchIndexArray[i] = sequenceSearchIndexArray[i] + 1 // Increment index in sequence
        //                                 searchColumn([[rowIndex, colIndex]], i) // Continue searching next column
        //                             }
        //                         }
        //                     }
        //                 }
        //             })
        //         }
        //     })
        // }

        
        // function searchColumn(prevRowMatch:number[][], currentSequenceIndex:number) {
        //     let found = false
        //     combinationBoard.map((row, rowIndex) => {
        //         if (rowIndex !== prevRowMatch[0][0]) { // Prevents backtracking
        //             row.map((val, colIndex) => {
        //                 if (colIndex === prevRowMatch[0][1]) {
        //                     if (!JSON.stringify(foundSequencePath).includes(JSON.stringify([rowIndex, colIndex]))) { // Prevents re-finding found coords
        //                         if (val === localSequenceArray[currentSequenceIndex][sequenceSearchIndexArray[currentSequenceIndex]]) { // If val matches part of sequence
        //                             console.log(val, rowIndex, colIndex)
        //                             foundSequencePath.push([prevRowMatch[0][0], prevRowMatch[0][1]])
        //                             foundSequencePath.push([rowIndex, colIndex])
        //                             found = true
        //                             sequenceSearchIndexArray[currentSequenceIndex] = sequenceSearchIndexArray[currentSequenceIndex] + 1 // Increment index in sequence
                                    
        //                             if (localSequenceArray[currentSequenceIndex].length === sequenceSearchIndexArray[currentSequenceIndex]) { // Checking if sequence is complete
        //                                 sequenceSearchIndexArray[currentSequenceIndex] = -1
        //                                 if (JSON.stringify(sequenceSearchIndexArray) === `[-1,-1,-1]`) { // Check if all sequences are complete
        //                                     console.log("COMPLETE SEQUENCE FOUND")
        //                                     console.log(foundSequencePath)
        //                                     setSolvedArray(foundSequencePath)
        //                                 } else {
        //                                     console.log("NEW ROW NEW SEQUENCE")
        //                                     searchRow(rowIndex, -1, [[rowIndex, colIndex]]) // Start searching new sequence
        //                                 }
        //                             } else {
        //                                 console.log("NEW ROW SAME SEQUENCE")
        //                                 searchRow(rowIndex, currentSequenceIndex, [[rowIndex, colIndex]]) // Continue searching for sequence
        //                             }
        //                         }
        //                     }
        //                 }
        //             })
        //         }
        //     })
        //     if (!found) { // reset sequence search index if no matches found
        //         sequenceSearchIndexArray[currentSequenceIndex] = 0
        //         found = false
        //     }
        // }


        searchStartRow()
        console.log(foundSequencePath)

    }

    // Swap board style depending on row or column turn
    function swapBoardStyle(colIndex:number, rowIndex:number, val:string) {

        let styleString = ""

        const solveCoords = [...solvedArray]
        // let testCoords = []
        // testCoords.push(rowIndex, colIndex)
        let solveStartEnd = 1

        if (JSON.stringify(solveCoords).includes(JSON.stringify([rowIndex, colIndex]))) {
            if (solveStartEnd === 1) {
                styleString = `size-12 p-2 select-none text-center text-xl text-cyber-lightgreen bg-cyber-blue-darker`
            } else if (solveStartEnd === solveCoords.length) {
                styleString = `size-12 p-2 select-none text-center text-xl text-cyber-lightgreen bg-cyber-red`
            } else {
                styleString = `size-12 p-2 select-none text-center text-xl text-cyber-lightgreen bg-gray-500`
            }

            solveStartEnd++

            return styleString
        }
        
        if (isRowTurn) {
            // Row Style
            styleString = `size-12 p-2 select-none text-center text-xl text-cyber-lightgreen
            ${colIndex === columnHover ? 'bg-matrix-preview' : ''}
            ${val === props.combinationHover ? "inner-cell" : ""}
            ${val !== selectPlaceholder ? rowIndex === selectRow && columnHover === colIndex ? "double-border hoverGlow" : "": "text-white text-opacity-20"}`
        } else {
            // Column Style
            styleString = `size-12 p-2 select-none text-center text-xl text-cyber-lightgreen
            ${colIndex === selectColumn ? 'bg-matrix-select' : ''}
            ${val === props.combinationHover ? "inner-cell" : ""}
            ${val !== selectPlaceholder ? colIndex === selectColumn && rowHover === rowIndex ? "double-border hoverGlow" : "" : "text-white text-opacity-20"}`
        }

        return styleString
    }

    // Maps through the board and each row to display the code matrix
    function DisplayCodeMatrix() {
        return (
            <>
                {combinationBoard.map((row, rowIndex) => (
                    <tr key={rowIndex} className={`table-auto ${rowIndex === selectRow && isRowTurn ? "bg-matrix-select" : !isRowTurn && rowIndex !== selectRow ? "hover:bg-matrix-preview" : ""}`}>
                        {row.map((val, colIndex) => (
                            <td
                                key={colIndex}
                                className={swapBoardStyle(colIndex, rowIndex, val)}
                                onClick={() => clickCell(val, rowIndex, colIndex)}
                                onMouseEnter={() => onHover(colIndex, val, rowIndex)}
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
        <>
            <div className={`${props.gameStatus === "win" ? "border-[1px] border-cyber-success" : props.gameStatus === "lose" ? "border-[1px] border-cyber-red" : "border-[1px] border-cyber-green overflow-hidden"}`}>
                <div className='relative'>
                    <div className="bg-cyber-green text-black p-2 text-xl">CODE MATRIX</div>
                    {props.gameStatus ?
                        <div className={`text-black p-2 text-xl absolute top-0 left-0 w-full h-full ${props.gameStatus === "win" ? "bg-cyber-success" : props.gameStatus === "lose" ? "bg-cyber-red" : ""}`}></div>
                        : ""}
                </div>
                <table className={`flex justify-center py-2 ${props.gameStatus === "win" ? "bg-success-green" : props.gameStatus === "lose" ? "bg-fail-red" : ""}`} onMouseLeave={() => stopHover()}>
                    <tbody>

                        {props.gameStatus === "win" ?
                            <tr>
                                <td>
                                    <div className='text-cyber-success font-semibold'>
                                        //ROOT <br />
                                        //ACCESS_REQUEST <br />
                                        //ACCESS_REQUEST_SUCCESS <br />
                                        //COLLECTING PACKET_1.......................COMPLETE <br />
                                        //COLLECTING PACKET_2.......................COMPLETE <br />
                                        //COLLECTING PACKET_3.......................COMPLETE <br />
                                        //COLLECTING PACKET_4.......................COMPLETE <br />
                                        //LOGIN <br />
                                        //LOGIN_SUCCESS <br />
                                        // <br />
                                        //UPLOAD_IN_PROGRESS <br />
                                        //UPLOAD_COMPLETE! <br />
                                    </div>
                                </td>
                            </tr>
                        : props.gameStatus === "lose" ?
                            <tr>
                                <td>
                                    <div className='text-cyber-red font-semibold'>
                                        //ROOT_ATTEMPT_1<br />
                                        //ROOT_ATTEMPT_2<br />
                                        //ROOT_ATTEMPT_3<br />
                                        //ROOT_FAILED<br />
                                        //ROOT_REBOOT<br />
                                        //ACCESSING...............................FAILED<br />
                                        //ACCESSING...............................FAILED<br />
                                        //ACCESSING...............................FAILED<br />
                                        //ACCESSING...............................FAILED<br />
                                        //ACCESSING...............................FAILED<br />
                                        <br />
                                    </div>
                                </td>
                            </tr>
                        : <DisplayCodeMatrix />}
                    </tbody>
                </table>

                {props.gameStatus ?
                    <>
                        {props.gameStatus === "win" ?
                            <div className='bg-cyber-success h-20 flex items-center justify-center text-success-green'>
                                DAEMONS UPLOADED
                            </div>
                        : props.gameStatus === 'lose' ?
                            <div className='bg-cyber-red h-20 flex items-center justify-center text-fail-red'>
                                USER TERMINATED PROCESS
                            </div>
                        :
                        <div></div>}
                    </>
                : <div></div>}
            </div>
            {props.gameStatus ?
                <div className={`
                ${props.gameStatus === "win" ? "bg-success-green border-[1px] border-cyber-success text-cyber-success" 
                : props.gameStatus === "lose" ? "bg-fail-red border-[1px] border-cyber-red text-cyber-red" : ""} 
                flex items-center p-2 mt-6 w-2/5 mr-0 ml-auto`} onClick={() => resetGame()}>
                    EXIT INTERFACE
                </div>
            : 
            <div className='flex flex-col items-center justify-center p-2 mt-6 mr-0 ml-auto text-cyber-blue-darker'>
                <span className='border-2 border-cyber-red-menu p-2 px-6 bg-black bg-opacity-20 hover:bg-cyber-red-menu hover:bg-opacity-30' onClick={() => solveClick()}>SOLVE</span>
            </div>}

        </>
    )
}