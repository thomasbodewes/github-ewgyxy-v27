import { ConsentFormLanguage, consentFormContent } from "@/lib/content/consent-form"

interface ConsentFormContentProps {
  language: ConsentFormLanguage
}

export function ConsentFormContent({ language }: ConsentFormContentProps) {
  const content = consentFormContent[language]

  return (
    <div className="prose prose-sm max-w-none">
      <h3 className="text-lg font-semibold mb-4">{content.title}</h3>
      
      <p className="mb-6">{content.description}</p>

      <div className="space-y-6">
        <section>
          <h4 className="font-semibold mb-2">{content.treatment.title}</h4>
          <p>{content.treatment.text}</p>
        </section>

        <section>
          <h4 className="font-semibold mb-2">{content.risks.title}</h4>
          <p className="mb-2">{content.risks.text}</p>
          <ul className="list-disc pl-5 mb-2">
            {content.risks.effects.map((effect, index) => (
              <li key={index}>{effect}</li>
            ))}
          </ul>
          <p>{content.risks.additionalInfo}</p>
        </section>

        <section>
          <h4 className="font-semibold mb-2">{content.declaration.title}</h4>
          <p className="whitespace-pre-line">{content.declaration.text}</p>
        </section>

        <section>
          <h4 className="font-semibold mb-2">{content.privacy.title}</h4>
          <p>{content.privacy.text}</p>
        </section>
      </div>
    </div>
  )
}