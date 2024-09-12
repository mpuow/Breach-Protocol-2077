
interface Props {
  solutionString: string[]
}

function Sequences(props: Props) {
  return (
    <div>
      Sequences
      <span>{props.solutionString}</span>
    </div>
  )
}

export default Sequences