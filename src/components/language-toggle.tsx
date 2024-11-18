import { Button } from "@/components/ui/button"
import { ConsentFormLanguage } from "@/lib/content/consent-form"

interface LanguageToggleProps {
  language: ConsentFormLanguage
  onChange: (language: ConsentFormLanguage) => void
}

export function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onChange(language === 'en' ? 'nl' : 'en')}
      className="w-16"
    >
      {language === 'en' ? 'NL' : 'EN'}
    </Button>
  )
}