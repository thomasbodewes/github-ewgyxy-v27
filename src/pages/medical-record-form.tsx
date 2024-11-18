import { useParams, useNavigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Calendar, User, Stethoscope, Pill, Image, Plus, Syringe, CalendarPlus, FileText } from 'lucide-react'
import { useState } from 'react'
import { useMedicalRecords } from '@/hooks/useStorage'
import { MedicalRecord, TreatmentPoint, RecordImage } from '@/types'
import { useToast } from '@/components/ui/use-toast'
import { v4 as uuidv4 } from 'uuid'
import { ImageUpload } from '@/components/ui/image-upload'

const recordTypes = [
  "Consultation",
  "Treatment",
  "Follow-up Treatment"
]

const productNames = [
  "Bocouture® (Merz)",
  "Botox® (Allergan)"
]

const defaultAftercare = [
  "Vermijd aanraken/masseren van de behandelde gebieden gedurende 4 uur",
  "Vermijd een liggende houding gedurende 4 uur",
  "Vermijd intensieve lichaamsbeweging gedurende 24 uur"
]

export default function MedicalRecordForm() {
  const { patientId = '' } = useParams()
  const navigate = useNavigate()
  const { addRecord } = useMedicalRecords(patientId)
  const { toast } = useToast()
  const [treatmentPoints, setTreatmentPoints] = useState<TreatmentPoint[]>([])
  const [selectedAftercare, setSelectedAftercare] = useState<string[]>([])
  const [images, setImages] = useState<RecordImage[]>([])
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    provider: 'Dr. T.C.F. Bodewes',
    complaint: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    followUpDate: '',
    medication: {
      productName: '',
      genericName: 'Botulinum Toxin Type A',
      totalDosage: '',
      batch: '',
      expiryDate: ''
    }
  })

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    const newPoint: TreatmentPoint = {
      id: uuidv4(),
      area: `Point ${treatmentPoints.length + 1}`,
      units: 1,
      coordinates: { x, y }
    }

    setTreatmentPoints([...treatmentPoints, newPoint])
  }

  const handleUnitChange = (id: string, units: string) => {
    const parsedUnits = parseInt(units)
    if (parsedUnits >= 1 && parsedUnits <= 12) {
      setTreatmentPoints(points =>
        points.map(point =>
          point.id === id ? { ...point, units: parsedUnits } : point
        )
      )
    }
  }

  const handleImageChange = (type: 'Before' | 'After', image: RecordImage | undefined) => {
    if (image) {
      setImages(prev => {
        const filtered = prev.filter(img => img.type !== type)
        return [...filtered, image]
      })
    } else {
      setImages(prev => prev.filter(img => img.type !== type))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newRecord: MedicalRecord = {
      id: uuidv4(),
      patientId,
      date: formData.date,
      type: formData.type,
      provider: formData.provider,
      complaint: formData.complaint,
      diagnosis: formData.diagnosis,
      treatment: formData.treatment,
      notes: formData.notes,
      followUpDate: formData.followUpDate,
      medications: [{
        id: uuidv4(),
        productName: formData.medication.productName,
        genericName: formData.medication.genericName,
        dosage: formData.medication.totalDosage,
        batch: formData.medication.batch,
        expiryDate: formData.medication.expiryDate
      }],
      aftercare: selectedAftercare,
      images,
      treatmentPoints,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    addRecord(newRecord)
    toast({
      title: "Success",
      description: "Medical record saved successfully",
    })
    navigate(`/patients/${patientId}`)
  }

  return (
    <MainLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/patients/${patientId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">New Medical Record</h1>
          </div>
          <Button onClick={handleSubmit}>Save Record</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      className="pl-10"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Record Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {recordTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Medical Doctor</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="provider"
                      value={formData.provider}
                      disabled
                      className="bg-muted pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followUp">Follow-up Date</Label>
                  <div className="relative">
                    <CalendarPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="followUp"
                      type="date"
                      className="pl-10"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="clinical" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="clinical" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">Clinical</span>
              </TabsTrigger>
              <TabsTrigger value="treatment" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Treatment</span>
              </TabsTrigger>
              <TabsTrigger value="medication" className="flex items-center gap-2">
                <Syringe className="h-4 w-4" />
                <span className="hidden sm:inline">Botox</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Images</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clinical">
              <Card>
                <CardHeader>
                  <CardTitle>Clinical Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="complaint">Chief Complaint</Label>
                    <Textarea
                      id="complaint"
                      placeholder="Patient's main concern"
                      value={formData.complaint}
                      onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Textarea
                      id="diagnosis"
                      placeholder="Clinical diagnosis"
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Clinical Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Detailed clinical notes"
                      className="min-h-[100px]"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="treatment">
              <Card>
                <CardHeader>
                  <CardTitle>Treatment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="treatment">Treatment</Label>
                    <Textarea
                      id="treatment"
                      placeholder="Treatment details"
                      value={formData.treatment}
                      onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Aftercare Instructions</Label>
                    <div className="space-y-2">
                      {defaultAftercare.map((instruction) => (
                        <div key={instruction} className="flex items-center space-x-2">
                          <Checkbox
                            id={instruction}
                            checked={selectedAftercare.includes(instruction)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAftercare([...selectedAftercare, instruction])
                              } else {
                                setSelectedAftercare(selectedAftercare.filter(i => i !== instruction))
                              }
                            }}
                          />
                          <label
                            htmlFor={instruction}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {instruction}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Treatment Mapping</Label>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div 
                        className="relative w-full md:w-[300px] h-[400px] bg-muted rounded-lg border flex-shrink-0 cursor-crosshair"
                        onClick={handleImageClick}
                      >
                        <img 
                          src="/face.svg" 
                          alt="Face treatment map" 
                          className="absolute inset-0 w-full h-full p-4 object-contain"
                        />

                        {treatmentPoints.map((point) => (
                          <div
                            key={point.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group"
                            style={{
                              left: `${point.coordinates.x}%`,
                              top: `${point.coordinates.y}%`
                            }}
                          >
                            <div 
                              className="rounded-full bg-primary"
                              style={{
                                width: `${4 + (point.units * 2)}px`,
                                height: `${4 + (point.units * 2)}px`
                              }}
                            />
                            <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-8 bg-popover text-popover-foreground text-xs rounded px-2 py-1 whitespace-nowrap shadow-md">
                              {point.area}: {point.units} units
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex-1 space-y-4">
                        {treatmentPoints.map((point, index) => (
                          <div key={point.id} className="flex items-center gap-4">
                            <div className="w-20">
                              <Label>Point {index + 1}</Label>
                            </div>
                            <Input
                              type="number"
                              min="1"
                              max="12"
                              value={point.units}
                              onChange={(e) => handleUnitChange(point.id, e.target.value)}
                              className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">units</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medication">
              <Card>
                <CardHeader>
                  <CardTitle>Botox Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Select
                        value={formData.medication.productName}
                        onValueChange={(value) => setFormData({
                          ...formData,
                          medication: { ...formData.medication, productName: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {productNames.map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="genericName">Generic Name</Label>
                      <Input
                        id="genericName"
                        value={formData.medication.genericName}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalDosage">Total Dosage</Label>
                      <Input
                        id="totalDosage"
                        placeholder="e.g., 35 units total"
                        value={formData.medication.totalDosage}
                        onChange={(e) => setFormData({
                          ...formData,
                          medication: { ...formData.medication, totalDosage: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="batch">Batch Number</Label>
                      <Input
                        id="batch"
                        placeholder="e.g., BTX-2023-456"
                        value={formData.medication.batch}
                        onChange={(e) => setFormData({
                          ...formData,
                          medication: { ...formData.medication, batch: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date (MM/YYYY)</Label>
                      <Input
                        id="expiryDate"
                        type="month"
                        value={formData.medication.expiryDate}
                        onChange={(e) => setFormData({
                          ...formData,
                          medication: { ...formData.medication, expiryDate: e.target.value }
                 })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>Treatment Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ImageUpload
                      type="Before"
                      value={images.find(img => img.type === 'Before')}
                      onChange={(image) => handleImageChange('Before', image)}
                    />
                    <ImageUpload
                      type="After"
                      value={images.find(img => img.type === 'After')}
                      onChange={(image) => handleImageChange('After', image)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/patients/${patientId}`)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Record</Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}