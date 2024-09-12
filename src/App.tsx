import { useEffect, useState } from "react"

/*

2077-Hacking-Minigame

*/

function App() {
  const [userSelect, setUserSelect] = useState("")
  const [selection, setSelection] = useState<number>()
  const [combinationBoard, setCombinationBoard] = useState<string[][]>([])

  function clickTest(val: string) {
    setUserSelect(userSelect + val)
  }

  function generateCombination() {
    const possibleCombinations = ["E9", "55", "BD", "1C", "7A", "FF"]
    const combination:string[] = []
    for (let i = 0; i < 6; i++) {
      combination.push(possibleCombinations[Math.floor(Math.random() * 6)])
    }
    return combination
  }

  function generateCodeMatrix() {
    for (let i = 0; i < 6; i++) {
      setCombinationBoard((test) => [...test, generateCombination()])
    }
  }

  let load = false
  useEffect(() => {
    // Hack to get around double useEffect rendering in strict mode
    if (!load) {
      load = true
    }

    generateCodeMatrix()
    console.log(combinationBoard)

    return () => {
      setCombinationBoard([])
    }

  }, [])

  function CodeMatrix() {

    return (
      <table>
        {combinationBoard.map((row, rowKey) => (
          <tr className="p-4 hover:bg-red-500 table-auto" key={rowKey}>
            {row.map((val, colKey) => (
              <td
                key={colKey}
                className={`p-4 select-none ${colKey === selection ? 'bg-blue-500' : ''} hover:bg-[#CEEC58]`}
                onClick={() => clickTest(val)}
                onMouseEnter={() => setSelection(colKey)}
                onMouseLeave={() => setSelection(-1)}>
                {val}
              </td>
            ))}
          </tr>
        ))}
      </table>
    )
  }

  return (
    <>
      <h1 className="font-bold text-3xl">Breach Protocol</h1>
      <div className="border-2 border-black bg-[#CEEC58] text-black p-2">CODE MATRIX</div>
      <div className="border-2 border-[#CEEC58] p-4">
        <CodeMatrix />
      </div>
      <div className="border-2 border-[#CEEC58] mt-2 p-2 h-12">
        {userSelect}
      </div>
    </>
  )
}

export default App