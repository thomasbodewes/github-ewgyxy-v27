import { useState, useEffect } from "react"
import { RadioQuestion } from "./radio-question"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { v4 as uuidv4 } from 'uuid'
import { MedicalQuestionnaire } from "@/types"

interface QuestionnaireFormProps {
  patientId: string
  existingData?: MedicalQuestionnaire | null
  onSave: (data: MedicalQuestionnaire) => void
}

export function QuestionnaireForm({ patientId, existingData, onSave }: QuestionnaireFormProps) {
  const { toast } = useToast()
  const [isLocked, setIsLocked] = useState(!!existingData)
  const [formData, setFormData] = useState<MedicalQuestionnaire>({
    id: existingData?.id || uuidv4(),
    patientId,
    previousTreatment: existingData?.previousTreatment ?? null,
    sideEffects: existingData?.sideEffects ?? null,
    sideEffectsDetails: existingData?.sideEffectsDetails || "",
    muscleDisorders: existingData?.muscleDisorders ?? null,
    infections: existingData?.infections ?? null,
    medications: existingData?.medications ?? null,
    medicationDetails: existingData?.medicationDetails || "",
    pregnancyStatus: existingData?.pregnancyStatus ?? null,
    allergies: existingData?.allergies ?? null,
    allergyDetails: existingData?.allergyDetails || "",
    facialSurgery: existingData?.facialSurgery ?? null,
    surgeryDetails: existingData?.surgeryDetails || "",
    createdAt: existingData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    const requiredFields = [
      'previousTreatment',
      'muscleDisorders',
      'infections',
      'medications',
      'allergies',
      'facialSurgery'
    ]

    // Add sideEffects to required fields if previousTreatment is true
    if (formData.previousTreatment === true) {
      requiredFields.push('sideEffects')
    }

    const missingFields = requiredFields.filter(
      field => formData[field as keyof MedicalQuestionnaire] === null
    )

    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: "Please answer all required questions",
        variant: "destructive",
      })
      return
    }

    // Validate conditional text fields
    const conditionalValidation = [
      { condition: formData.sideEffects === true, field: 'sideEffectsDetails', label: 'side effects' },
      { condition: formData.medications === true, field: 'medicationDetails', label: 'medications' },
      { condition: formData.allergies === true, field: 'allergyDetails', label: 'allergies' },
      { condition: formData.facialSurgery === true, field: 'surgeryDetails', label: 'surgery details' }
    ]

    const missingDetails = conditionalValidation.find(
      ({ condition, field }) => condition && !formData[field as keyof MedicalQuestionnaire]
    )

    if (missingDetails) {
      toast({
        title: "Error",
        description: `Please provide details about your ${missingDetails.label}`,
        variant: "destructive",
      })
      return
    }

    onSave(formData)
    setIsLocked(true)
    toast({
      title: "Success",
      description: "Questionnaire saved successfully",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {isLocked ? (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsLocked(false)}
          >
            Edit Questionnaire
          </Button>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <RadioQuestion
          question="Heeft u ooit eerder een botox behandeling gehad??"
          value={formData.previousTreatment}
          onChange={(value) => {
            setFormData({ 
              ...formData, 
              previousTreatment: value,
              // Reset side effects if previous treatment is set to false
              sideEffects: value ? formData.sideEffects : null,
              sideEffectsDetails: value ? formData.sideEffectsDetails : ""
            })
          }}
          disabled={isLocked}
        />

        {formData.previousTreatment === true && (
          <>
            <RadioQuestion
              question="Heeft u bijwerkingen ervaren?"
              value={formData.sideEffects}
              onChange={(value) => setFormData({ 
                ...formData, 
                sideEffects: value,
                sideEffectsDetails: value ? formData.sideEffectsDetails : ""
              })}
              disabled={isLocked}
            />

            {formData.sideEffects === true && (
              <div className="ml-6 space-y-2">
                <Label className="text-sm">Beschrijf de bijwerkingen:</Label>
                <Textarea
                  value={formData.sideEffectsDetails}
                  onChange={(e) => setFormData({ ...formData, sideEffectsDetails: e.target.value })}
                  placeholder="Beschrijf de bijwerkingen die u heeft ervaren..."
                  disabled={isLocked}
                  required
                />
              </div>
            )}
          </>
        )}

        <RadioQuestion
          question="Heeft u spier- of zenuwaandoeningen zoals ALS, myasthenia gravis of het Lambert-Eaton-syndroom?"
          value={formData.muscleDisorders}
          onChange={(value) => setFormData({ ...formData, muscleDisorders: value })}
          disabled={isLocked}
        />

        <RadioQuestion
          question="Heeft u een (huid)infectie of stollingsafwijking (bijv. heeft u regelmatig last van (neus)bloedingen of blauwe plekken)?"
          value={formData.infections}
          onChange={(value) => setFormData({ ...formData, infections: value })}
          disabled={isLocked}
        />

        <RadioQuestion
          question="Gebruikt u momenteel antibiotica of bloedverdunners?"
          value={formData.medications}
          onChange={(value) => setFormData({ 
            ...formData, 
            medications: value,
            medicationDetails: value ? formData.medicationDetails : ""
          })}
          disabled={isLocked}
        />

        {formData.medications === true && (
          <div className="ml-6 space-y-2">
            <Label className="text-sm">overzicht van uw huidige medicatie:</Label>
            <Textarea
              value={formData.medicationDetails}
              onChange={(e) => setFormData({ ...formData, medicationDetails: e.target.value })}
              placeholder="Uw actuele medicatieoverzicht..."
              disabled={isLocked}
              required
            />
          </div>
        )}

        <RadioQuestion
          question="Voor vrouwen in de vruchtbare leeftijd: 
          Bent u zwanger, zou u zwanger kunnen zijn, of geeft u borstvoeding?"
          value={formData.pregnancyStatus}
          onChange={(value) => setFormData({ ...formData, pregnancyStatus: value })}
          disabled={isLocked}
          showNotApplicable={true}
        />

        <RadioQuestion
          question="Heeft u allergieën voor medicijnen of andere stoffen?"
          value={formData.allergies}
          onChange={(value) => setFormData({ 
            ...formData, 
            allergies: value,
            allergyDetails: value ? formData.allergyDetails : ""
          })}
          disabled={isLocked}
        />

        {formData.allergies === true && (
          <div className="ml-6 space-y-2">
            <Label className="text-sm">Beschrijf uw allergieën:</Label>
            <Textarea
              value={formData.allergyDetails}
              onChange={(e) => setFormData({ ...formData, allergyDetails: e.target.value })}
              placeholder="Welke allergieën heeft u..."
              disabled={isLocked}
              required
            />
          </div>
        )}

        <RadioQuestion
          question="Heeft u ooit een gezichtsoperatie of gezichtsbehandelingen met (permanente) fillers ondergaan?"
          value={formData.facialSurgery}
          onChange={(value) => setFormData({ 
            ...formData, 
            facialSurgery: value,
            surgeryDetails: value ? formData.surgeryDetails : ""
          })}
          disabled={isLocked}
        />

        {formData.facialSurgery === true && (
          <div className="ml-6 space-y-2">
            <Label className="text-sm">Geef details over eerdere gezichtsbehandelingen:</Label>
            <Textarea
              value={formData.surgeryDetails}
              onChange={(e) => setFormData({ ...formData, surgeryDetails: e.target.value })}
              placeholder="Beschrijf eerdere gezichtsoperaties of -behandelingen..."
              disabled={isLocked}
              required
            />
          </div>
        )}

        {!isLocked && (
          <div className="flex justify-end">
            <Button type="submit">Save Questionnaire</Button>
          </div>
        )}
      </form>
    </div>
  )
}