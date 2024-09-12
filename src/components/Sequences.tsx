import { useState } from "react"
import { randomNumber } from "./CodeMatrix"

interface Props {
    solutionStringArray: string[]
}

// Fisher-Yates Shuffle
function shuffleArray(array:number[]) {
    let currentIndex = array.length

    while (currentIndex != 0) {
        let randomIndex = randomNumber(currentIndex)
        currentIndex--

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }
}

export function splitSolutionStringArray(solutionStringArray:string[]) {
        
    // Valid index locations to split the solution string
    let posibleIndexVariations = [2, 2, 3]
    shuffleArray(posibleIndexVariations)
    let finalSequenceArray = []

    // Create local copy of solutionStringArray to avoid mutating it directly
    let split3 = solutionStringArray.slice(0)
    let split1 = (split3.splice(0, posibleIndexVariations[0]))
    let split2 = (split3.splice(0, posibleIndexVariations[1]))

    // Recursion to prevent 3 of the same combination. Eg: ['FF', 'FF', 'FF']
    if (split1.length > 2) {
        if (split1[0] === split1[1] && split1[1] === split1[2]) {
            splitSolutionStringArray(split3)
        }
        [split1, split3] = [split3, split1]
    } else if (split2.length > 2) {
        if (split2[0] === split2[1] && split2[1] === split2[2]) {
            splitSolutionStringArray(split3)
        }
        [split2, split3] = [split3, split2]
    } else if (split3.length > 2) {
        if (split3[0] === split3[1] && split3[1] === split3[2]) {
            splitSolutionStringArray(split3)
        }
    }

    // Push results to finalSequenceArray
    finalSequenceArray.push(split1, split2, split3)
    // setFinalSequenceArray([split1, split2, split3])

    console.log(finalSequenceArray)

    return(finalSequenceArray)
}

export default function Sequences(props: Props) {

    // const [finalSequenceArray, setFinalSequenceArray] = useState<string[][]>(splitSolutionStringArray(props.solutionStringArray))
    let finalSequenceArray = splitSolutionStringArray(props.solutionStringArray)

    // function splitSolutionStringArray(solutionStringArray:string[]) {
        
    //     // Valid index locations to split the solution string
    //     let posibleIndexVariations = [2, 2, 3]
    //     shuffleArray(posibleIndexVariations)
    //     // let finalSequenceArray = []

    //     // Create local copy of solutionStringArray to avoid mutating it directly
    //     let split3 = solutionStringArray.slice(0)
    //     let split1 = (split3.splice(0, posibleIndexVariations[0]))
    //     let split2 = (split3.splice(0, posibleIndexVariations[1]))

    //     // Recursion to prevent 3 of the same combination. Eg: ['FF', 'FF', 'FF']
    //     if (split1.length > 2) {
    //         if (split1[0] === split1[1] && split1[1] === split1[2]) {
    //             splitSolutionStringArray(split3)
    //         }
    //         [split1, split3] = [split3, split1]
    //     } else if (split2.length > 2) {
    //         if (split2[0] === split2[1] && split2[1] === split2[2]) {
    //             splitSolutionStringArray(split3)
    //         }
    //         [split2, split3] = [split3, split2]
    //     } else if (split3.length > 2) {
    //         if (split3[0] === split3[1] && split3[1] === split3[2]) {
    //             splitSolutionStringArray(split3)
    //         }
    //     }

    //     // Push results to finalSequenceArray
    //     // finalSequenceArray.push(split1, split2, split3)
    //     setFinalSequenceArray([split1, split2, split3])

    //     console.log(finalSequenceArray)
    // }


    function DisplaySequences() {

        return (
            <table className="flex flex-row">
                <tbody>
                <tr className="table-auto">
                    <td>{finalSequenceArray[0]}</td>
                    <td>DATAMINE_V1</td>
                </tr>
                <tr>
                    <td>{finalSequenceArray[1]}</td>
                    <td>DATAMINE_V2</td>
                </tr>
                <tr>
                    <td>{finalSequenceArray[2]}</td>
                    <td>DATAMINE_V3</td>
                </tr>
                </tbody>
            </table>
        )
    }

    return (
        <div className='border-2 border-[#5873ec]'>
            <div className="border-2 border-[#CEEC58] text-[#C8D1A6] p-2">SEQUENCE REQUIRED TO UPLOAD</div>
            <DisplaySequences />


            {/* <span onClick={() => splitSolutionStringArray(props.solutionStringArray)}> eroign</span> */}
            {/* <span onClick={() => console.log(finalSequenceArray)}> 22222222</span> */}
            <span onClick={() => {console.log(finalSequenceArray)}}>aaaaaaa</span>
        </div>
    )
}