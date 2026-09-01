'use client'

interface Props {
  error: Error
}

export default function Error(props : Props) {
  return (
    <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
      Error : {props.error instanceof Error ? props.error.message : "Unknown error"}
    </div>
  )
}