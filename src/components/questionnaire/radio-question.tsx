import { Label } from "@/components/ui/label"

interface RadioQuestionProps {
  question: string
  value: boolean | null
  onChange: (value: boolean | null) => void
  disabled?: boolean
  showNotApplicable?: boolean
}

export function RadioQuestion({ question, value, onChange, disabled = false, showNotApplicable = false }: RadioQuestionProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{question}</Label>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            checked={value === true}
            onChange={() => onChange(true)}
            className="h-4 w-4 border-input"
            disabled={disabled}
          />
          <Label className="text-sm font-normal">Ja</Label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            checked={value === false}
            onChange={() => onChange(false)}
            className="h-4 w-4 border-input"
            disabled={disabled}
          />
          <Label className="text-sm font-normal">Nee</Label>
        </div>
        {showNotApplicable && (
          <div className="flex items-center gap-2">
            <input
              type="radio"
              checked={value === null}
              onChange={() => onChange(null)}
              className="h-4 w-4 border-input"
              disabled={disabled}
            />
            <Label className="text-sm font-normal">N.v.t.</Label>
          </div>
        )}
      </div>
    </div>
  )
}