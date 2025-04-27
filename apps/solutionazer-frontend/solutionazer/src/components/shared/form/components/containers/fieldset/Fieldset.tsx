interface FieldsetProps {
  params?: {
    className: string
  }
  children: React.ReactNode
}

export default function Fieldset({
  children,
  params,
}: Readonly<FieldsetProps>) {
  // props
  const className = params?.className

  return <fieldset className={className}>{children}</fieldset>
}
