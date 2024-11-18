import { useParams, useNavigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, FileText, Calendar, User, Stethoscope, Pill, Image, Syringe, CalendarPlus, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { useMedicalRecords, usePatients } from '@/hooks/useStorage'
import { ImageUpload } from '@/components/ui/image-upload'
import { generateMedicalRecordPDF } from '@/lib/pdf-generator'
import { useToast } from '@/components/ui/use-toast'

export default function MedicalRecordDetail() {
  const { patientId = '', recordId = '' } = useParams()
  const navigate = useNavigate()
  const { records } = useMedicalRecords(patientId)
  const { patients } = usePatients()
  const { toast } = useToast()
  
  const record = records?.find(r => r.id === recordId)
  const patient = patients.find(p => p.id === patientId)

  const handleExportPDF = () => {
    if (!record || !patient) {
      toast({
        title: "Error",
        description: "Could not generate PDF: Missing record or patient data",
        variant: "destructive",
      })
      return
    }

    try {
      generateMedicalRecordPDF(record, patient)
      toast({
        title: "Success",
        description: "PDF generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      })
      console.error('PDF generation error:', error)
    }
  }

  if (!record) {
    return (
      <MainLayout>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/patients/${patientId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Record not found</h1>
        </div>
      </MainLayout>
    )
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
            <h1 className="text-2xl font-bold">Medical Record</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {record.date ? format(new Date(record.date), "dd MMM yyyy") : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground">{record.type || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Medical Doctor</p>
                  <p className="text-sm text-muted-foreground">{record.provider || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarPlus className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Follow-up Date</p>
                  <p className="text-sm text-muted-foreground">
                    {record.followUpDate ? format(new Date(record.followUpDate), "dd MMM yyyy") : 'N/A'}
                  </p>
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
                <div>
                  <p className="text-sm font-medium">Complaint</p>
                  <p className="text-sm text-muted-foreground">{record.complaint || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Diagnosis</p>
                  <p className="text-sm text-muted-foreground">{record.diagnosis || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Clinical Notes</p>
                  <p className="text-sm text-muted-foreground">{record.notes || 'N/A'}</p>
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
                <div>
                  <p className="text-sm font-medium">Treatment</p>
                  <p className="text-sm text-muted-foreground">{record.treatment || 'N/A'}</p>
                </div>
                {record.aftercare?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Aftercare Instructions</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {record.aftercare.map((instruction, index) => (
                        <li key={index} className="text-sm text-muted-foreground">{instruction}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {record.treatmentPoints?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Treatment Mapping</p>
                    <div className="flex gap-12 items-start">
                      <div className="relative w-[300px] h-[399px] bg-muted rounded-lg">
                        <img 
                          src="/face.svg" 
                          alt="Face treatment map" 
                          className="absolute inset-0 w-full h-full p-4 object-contain"
                        />
                        {record.treatmentPoints.map((point, index) => (
                          <div
                            key={point.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2 group"
                            style={{
                              left: `${point.coordinates.x}%`,
                              top: `${point.coordinates.y}%`
                            }}
                          >
                            <div 
                              className="rounded-full bg-primary z-10 relative"
                              style={{
                                width: `${4 + (point.units * 2)}px`,
                                height: `${4 + (point.units * 2)}px`
                              }}
                            />
                            <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 -top-16 bg-popover text-popover-foreground text-xs rounded px-2 py-1 whitespace-nowrap shadow-md z-[100] border border-border">
                              Point {index + 1}: {point.units} units
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 space-y-2">
                        {record.treatmentPoints.map((point, index) => (
                          <div key={point.id} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-sm text-muted-foreground">
                              Point {index + 1}: {point.units} units
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medication">
            <Card>
              <CardHeader>
                <CardTitle>Botox Details</CardTitle>
              </CardHeader>
              <CardContent>
                {record.medications?.length > 0 ? (
                  <div className="space-y-4">
                    {record.medications.map((medication, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Pill className="h-8 w-8 text-primary" />
                        <div className="grid grid-cols-2 gap-4 flex-1">
                          <div>
                            <p className="text-sm font-medium">Product Name</p>
                            <p className="text-sm text-muted-foreground">{medication.productName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Generic Name</p>
                            <p className="text-sm text-muted-foreground">{medication.genericName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Total Dosage</p>
                            <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Batch Number</p>
                            <p className="text-sm text-muted-foreground">{medication.batch}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Expiry Date</p>
                            <p className="text-sm text-muted-foreground">
                              {medication.expiryDate ? format(new Date(medication.expiryDate), "MMM yyyy") : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No medication information available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Images</CardTitle>
              </CardHeader>
              <CardContent>
                {record.images?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Before', 'After'].map((type) => {
                      const image = record.images.find(img => img.type === type)
                      return (
                        <ImageUpload
                          key={type}
                          type={type as 'Before' | 'After'}
                          value={image}
                          onChange={() => {}} // Read-only
                          disabled={true}
                        />
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No images available for this record.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}