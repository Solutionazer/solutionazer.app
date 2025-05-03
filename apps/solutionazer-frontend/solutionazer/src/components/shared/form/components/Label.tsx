interface LabelProps {
  params: {
    htmlFor: string
    text: string
  }
}

export default function Label(props: Readonly<LabelProps>) {
  const { htmlFor, text } = props.params

  return <label htmlFor={htmlFor}>{text}</label>
}
