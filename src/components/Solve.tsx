
interface Props {
    sequenceArray: string[][]
    combinationBoard: string[][]
    setSolvedArray: React.Dispatch<React.SetStateAction<number[][]>>
}

export default function Solve(props: Props) {

    /*
        The searchAlgorithm finds a solution to the matrix puzzle by using a modified, double recursive DFS algorithm.

        The idea is to assume every match is the correct path and to continue forward until there is a solution or a dead end.
        Backtracking is achieved within the functions by looping through the row or column, or looping through the sequences.
        The double recursive structure allows for backtracking after continuing far through the matrix,
        and the stack allows for current and previous States to be stored and accessed appropriately.

        How the algorithm works:
            1. Define State and set default values to the stack
            2. Search a new row for matches in the sequences
                a) Loop through row
                b) Loop through sequence array or search for a specific sequence
                c) If there is a match:
                    i. Set variables
                    ii. Update stack
                    iii. Begin searching the next chosen column
                    iv. Pop the most recent state if no path was found
            3. Search the chosen column for matches in the chosen sequence
                a) Loop through column
                b) Loop through sequence array or search for a specific sequence
                c) If there is a match:
                    i. Set variables
                    ii. Update stack
                    iii. Begin searching the next chosen row
                    iv. Pop the most recent state if no path was found
            4. Upon starting a new row or column either:
                a) Continue searching for the next match in the sequence
                b) Start searching for a new sequence
                c) Exhaust all options and backtrack
            5. Repeat until solved

    */

    function searchAlgorithm() {
        // Local array to access the generated sequences
        let localSequenceArray = props.sequenceArray

        // Const lengths of all sequences to check if matrix solved later
        const finishedSequences = [localSequenceArray[0].length, localSequenceArray[1].length, localSequenceArray[2].length]

        // Define State object for the algorithm
        interface State {
            searchIndexArray: number[]
            foundSequencePath: number[][]
        }

        // Create a type for the array of State objects
        type StateArray = Array<State>

        // Default State object
        const defaultState: State = {
            searchIndexArray: [0, 0, 0],
            foundSequencePath: []
        }

        // Array of State objects which functions as a stack
        const stack: StateArray = [defaultState]

        // Search through rows for matches
        function searchRow(startNewSequenceResult: boolean, prevRowIndex: number = 0, prevColIndex: number = -1, currentSequenceIndex: number = -1) {
            // Set row array
            let row = props.combinationBoard[prevRowIndex]

            // Loop through the row
            for (let colIndex = 0; colIndex < row.length; colIndex++) {

                // Prevent backtracking
                if (colIndex === prevColIndex) { continue }

                // If starting a new sequence
                if (startNewSequenceResult) {
                    // Loop through all sequences
                    for (let i = 0; i < localSequenceArray.length; i++) {
                        // Deep clone the stack to avoid unwanted mutating
                        const localStack = structuredClone(stack)

                        // Set State variables with the most recent values in the stack
                        let currentSequenceIndexArray = localStack[localStack.length - 1].searchIndexArray
                        let localFoundPath = localStack[localStack.length - 1].foundSequencePath

                        // Prevents re-finding found coords
                        if (!JSON.stringify(localFoundPath).includes(JSON.stringify([prevRowIndex, colIndex]))) {
                            // If val matches first part of the given sequence
                            if (row[colIndex] === localSequenceArray[i][currentSequenceIndexArray[i]]) {
                                // Push the found coord to the end of the path so far
                                localFoundPath.push([prevRowIndex, colIndex])

                                // Increment the index we are looking for in the given sequence
                                currentSequenceIndexArray[i] = currentSequenceIndexArray[i] + 1

                                // Create a State object to push
                                const currentState: State = {
                                    searchIndexArray: currentSequenceIndexArray,
                                    foundSequencePath: localFoundPath
                                }

                                // Push the most recent State
                                stack.push(currentState)

                                // Start searching for matches in the next column
                                searchColumn(startNewSequence(i), prevRowIndex, colIndex, i)

                                // If no matches found, backtrack to this loop and pop the State (resetting the searchIndexArray and foundPath)
                                stack.pop()
                            }
                        }
                    }
                } else {
                    // Deep clone the stack to avoid unwanted mutating
                    const localStack = structuredClone(stack)
                    // Set State variables with the most recent values in the stack
                    let currentSequenceIndexArray = localStack[localStack.length - 1].searchIndexArray
                    let localFoundPath = localStack[localStack.length - 1].foundSequencePath

                    // Prevents re-finding found coords
                    if (!JSON.stringify(localFoundPath).includes(JSON.stringify([prevRowIndex, colIndex]))) {
                        // If val matches first part of the given sequence
                        if (row[colIndex] === localSequenceArray[currentSequenceIndex][currentSequenceIndexArray[currentSequenceIndex]]) {
                            // Push the found coord to the end of the path so far
                            localFoundPath.push([prevRowIndex, colIndex])

                            // Increment the index we are looking for in the given sequence
                            currentSequenceIndexArray[currentSequenceIndex] = currentSequenceIndexArray[currentSequenceIndex] + 1 // Increment index in sequence

                            // Create a State object to push
                            const currentState: State = {
                                searchIndexArray: currentSequenceIndexArray,
                                foundSequencePath: localFoundPath
                            }

                            // Push the most recent State
                            stack.push(currentState)

                            // Start searching for matches in the next column
                            searchColumn(startNewSequence(currentSequenceIndex), prevRowIndex, colIndex, currentSequenceIndex)

                            // If no matches found, backtrack to this loop and pop the State (resetting the searchIndexArray and foundPath)
                            stack.pop()
                        }
                    }
                }
            }
        }

        // Get the column at the given colIndex
        function getColumn(givenColIndex: number) {
            let column: string[] = []
            props.combinationBoard.map((row, _rowIndex) => {
                row.map((val, colIndex) => {
                    if (colIndex === givenColIndex) {
                        column.push(val)
                    }
                })
            })
            return column
        }

        // Search through columns for matches
        function searchColumn(startNewSequenceResult: boolean, prevRowIndex: number, prevColIndex: number, currentSequenceIndex: number) {
            // Set the column array with getColumn
            let column = getColumn(prevColIndex)

            // Loop through the column
            for (let rowIndex = 0; rowIndex < column.length; rowIndex++) {

                // Prevent backtracking
                if (rowIndex === prevRowIndex) { continue }

                // If starting a new sequence
                if (startNewSequenceResult) {

                    // Loop through the sequences
                    for (let i = 0; i < localSequenceArray.length; i++) {
                        // Deep clone the stack to avoid unwanted mutating
                        const localStack = structuredClone(stack)
                        // Set State variables with the most recent values in the stack
                        let currentSequenceIndexArray = localStack[localStack.length - 1].searchIndexArray
                        let localFoundPath = localStack[localStack.length - 1].foundSequencePath

                        // Prevents re-finding found coords
                        if (!JSON.stringify(localFoundPath).includes(JSON.stringify([rowIndex, prevColIndex]))) {
                            // If val matches first part of the given sequence
                            if (column[rowIndex] === localSequenceArray[i][currentSequenceIndexArray[i]]) {
                                // Push the found coord to the end of the path so far
                                localFoundPath.push([rowIndex, prevColIndex])

                                // Increment the index we are looking for in the given sequence
                                currentSequenceIndexArray[i] = currentSequenceIndexArray[i] + 1

                                // Create a State object to push
                                const currentState: State = {
                                    searchIndexArray: currentSequenceIndexArray,
                                    foundSequencePath: localFoundPath
                                }

                                // Push the most recent State
                                stack.push(currentState)

                                // Start searching for matches in the next row
                                searchRow(startNewSequence(i), rowIndex, prevColIndex, i)

                                // If no matches found, backtrack to this loop and pop the State (resetting the searchIndexArray and foundPath)
                                stack.pop()
                            }
                        }
                    }
                } else {
                    // Deep clone the stack to avoid unwanted mutating
                    const localStack = structuredClone(stack)
                    // Set State variables with the most recent values in the stack
                    let currentSequenceIndexArray = localStack[localStack.length - 1].searchIndexArray
                    let localFoundPath = localStack[localStack.length - 1].foundSequencePath

                    // Prevents re-finding found coords
                    if (!JSON.stringify(localFoundPath).includes(JSON.stringify([rowIndex, prevColIndex]))) {
                        // If val matches first part of the given sequence
                        if (column[rowIndex] === localSequenceArray[currentSequenceIndex][currentSequenceIndexArray[currentSequenceIndex]]) {
                            // Push the found coord to the end of the path so far
                            localFoundPath.push([rowIndex, prevColIndex])

                            // Increment the index we are looking for in the given sequence
                            currentSequenceIndexArray[currentSequenceIndex] = currentSequenceIndexArray[currentSequenceIndex] + 1

                            // Create a State object to push
                            const currentState: State = {
                                searchIndexArray: currentSequenceIndexArray,
                                foundSequencePath: localFoundPath
                            }

                            // Push the most recent State
                            stack.push(currentState)

                            // Start searching for matches in the next row
                            searchRow(startNewSequence(currentSequenceIndex), rowIndex, prevColIndex, currentSequenceIndex)

                            // If no matches found, backtrack to this loop and pop the State (resetting the searchIndexArray and foundPath)
                            stack.pop()
                        }
                    }
                }
            }
        }

        // Determine whether to start a new sequence or not, along with checking if the algorithm has found a solution
        function startNewSequence(currentSequenceIndex: number) {
            // Deep clone the stack to avoid unwanted mutating
            const localStack = structuredClone(stack)
            // Set State variables with the most recent values in the stack
            let currentSequenceIndexArray = localStack[localStack.length - 1].searchIndexArray
            let localFoundPath = localStack[localStack.length - 1].foundSequencePath

            // If the given sequence is complete
            if (localSequenceArray[currentSequenceIndex].length === currentSequenceIndexArray[currentSequenceIndex]) {
                // Check if all sequences are complete
                if (JSON.stringify(currentSequenceIndexArray) === JSON.stringify(finishedSequences)) {
                    // Set solvedArray to the found path
                    props.setSolvedArray(localFoundPath)
                } else {
                    // If sequence is complete, return true to start a new sequence
                    return true
                }
            }

            // Else return false to continue the sequence
            return false
        }

        // Start the algorithm - default search for a new sequence
        searchRow(true)
    }


    return (
        <span className='border-2 border-cyber-red-menu p-2 px-6 bg-black bg-opacity-20 hover:bg-cyber-red-menu hover:bg-opacity-30' onClick={() => searchAlgorithm()}>SOLVE</span>
    )
}