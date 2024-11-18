import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Calendar, FileText, Trash2, User, Phone, Mail, MapPin, Edit2, ClipboardList, FolderKanban } from 'lucide-react'
import { format, differenceInYears } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePatients, useMedicalRecords, useAppointments, useMedicalQuestionnaire } from "@/hooks/useStorage"
import { Patient, ConsentForm } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { SignaturePad } from "@/components/signature-pad"
import { LanguageToggle } from "@/components/language-toggle"
import { ConsentFormContent } from "@/components/consent-form-content"
import { ConsentFormLanguage, consentFormContent } from "@/lib/content/consent-form"
import { QuestionnaireForm } from "@/components/questionnaire/questionnaire-form"
import { v4 as uuidv4 } from 'uuid'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function PatientDetails() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null)
  const { patients, addPatient } = usePatients()
  const { records, removeRecord } = useMedicalRecords(id)
  const { appointments } = useAppointments(id)
  const { questionnaire, saveQuestionnaire } = useMedicalQuestionnaire(id)
  const { toast } = useToast()
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null)
  const [language, setLanguage] = useState<ConsentFormLanguage>('nl')
  const [consentFormData, setConsentFormData] = useState({
    location: '',
    date: '',
    patientName: '',
    signature: '',
    hasAgreed: false,
    hasAgreedDataProcessing: false
  })

  const patient = patients.find(p => p.id === id)

  useEffect(() => {
    if (patient) {
      setEditedPatient(patient)
      if (patient.consentForm) {
        setConsentFormData({
          location: patient.consentForm.location,
          date: patient.consentForm.date,
          patientName: patient.consentForm.patientName,
          signature: patient.consentForm.signature,
          hasAgreed: true,
          hasAgreedDataProcessing: true
        })
        setLanguage(patient.consentForm.language)
      }
    }
  }, [patient])

  const calculateAge = (dob: string) => {
    return differenceInYears(new Date(), new Date(dob))
  }

  const handleDeleteRecord = () => {
    if (deleteRecordId) {
      removeRecord(deleteRecordId)
      setDeleteRecordId(null)
      toast({
        title: "Success",
        description: "Medical record deleted successfully",
      })
    }
  }

  const handleSavePatient = () => {
    if (editedPatient) {
      addPatient(editedPatient)
      setIsEditingPersonal(false)
      toast({
        title: "Success",
        description: "Patient details updated successfully",
      })
    }
  }

  const handleSignConsent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!consentFormData.signature) {
      toast({
        title: "Error",
        description: "Please provide a signature",
        variant: "destructive",
      })
      return
    }

    const consentForm: ConsentForm = {
      id: uuidv4(),
      signedAt: new Date().toISOString(),
      location: consentFormData.location,
      date: consentFormData.date,
      patientName: consentFormData.patientName,
      signature: consentFormData.signature,
      agreementText: consentFormContent[language].agreementText,
      dataProcessingAgreement: consentFormContent[language].dataProcessingText,
      language
    }

    if (editedPatient) {
      const updatedPatient = {
        ...editedPatient,
        consentForm
      }
      addPatient(updatedPatient)
      setEditedPatient(updatedPatient)
      toast({
        title: "Success",
        description: "Consent form signed successfully",
      })
    }
  }

  const handleDeleteConsent = () => {
    if (editedPatient) {
      const { consentForm, ...patientWithoutConsent } = editedPatient
      addPatient(patientWithoutConsent)
      setEditedPatient(patientWithoutConsent)
      setConsentFormData({
        location: '',
        date: '',
        patientName: '',
        signature: '',
        hasAgreed: false,
        hasAgreedDataProcessing: false
      })
      toast({
        title: "Success",
        description: "Consent form deleted successfully",
      })
    }
  }

  if (!patient || !editedPatient) {
    return (
      <MainLayout>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/patients')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Patient not found</h1>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/patients')}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-3xl font-bold">
              Patient Details
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => navigate(`/patients/${id}/records/new`)}
              className="w-full sm:w-auto"
            >
              Add Medical Record
            </Button>
            <Button 
              onClick={() => navigate('/appointments')}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Schedule Appointment
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${patient.firstName} ${patient.lastName}`} />
                    <AvatarFallback>{patient.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    {isEditingPersonal ? (
                      <div className="space-y-4 w-full text-left">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">First Name</Label>
                          <Input 
                            value={editedPatient.firstName}
                            onChange={(e) => setEditedPatient({ ...editedPatient, firstName: e.target.value })}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Initials</Label>
                          <Input 
                            value={editedPatient.initials}
                            onChange={(e) => setEditedPatient({ ...editedPatient, initials: e.target.value })}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Last Name</Label>
                          <Input 
                            value={editedPatient.lastName}
                            onChange={(e) => setEditedPatient({ ...editedPatient, lastName: e.target.value })}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Date of Birth</Label>
                          <Input 
                            type="date"
                            value={editedPatient.dob}
                            onChange={(e) => setEditedPatient({ ...editedPatient, dob: e.target.value })}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Gender</Label>
                          <Input 
                            value={editedPatient.gender}
                            onChange={(e) => setEditedPatient({ ...editedPatient, gender: e.target.value as Patient['gender'] })}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Phone</Label>
                          <Input 
                            value={editedPatient.phone}
                            onChange={(e) => setEditedPatient({ ...editedPatient, phone: e.target.value })}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Email</Label>
                          <Input 
                            type="email"
                            value={editedPatient.email}
                            onChange={(e) => setEditedPatient({ ...editedPatient, email: e.target.value })}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Address</Label>
                          <Input 
                            value={editedPatient.address}
                            onChange={(e) => setEditedPatient({ ...editedPatient, address: e.target.value })}
                            className="w-full"
                          />
                        </div>
                        <Button onClick={handleSavePatient} className="w-full mt-6">
                          Save Changes
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold">
                          {patient.firstName} ({patient.initials}) {patient.lastName}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(patient.dob), "dd MMM yyyy")} ({calculateAge(patient.dob)} years)
                        </p>
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{patient.gender}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{patient.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{patient.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{patient.address}</span>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setIsEditingPersonal(true)}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Personal Info
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      <FolderKanban className="h-4 w-4" />
                      <span className="hidden sm:inline">Records</span>
                    </TabsTrigger>
                    <TabsTrigger value="questionnaire" className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      <span className="hidden sm:inline">Questionnaire</span>
                    </TabsTrigger>
                    <TabsTrigger value="consent" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Consent</span>
                    </TabsTrigger>
                    <TabsTrigger value="appointments" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">Appointments</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Medical Records</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {records.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No medical records found
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {[...records]
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .map((record) => (
                                <div 
                                  key={record.id}
                                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-muted rounded-lg relative group cursor-pointer hover:bg-muted/80 transition-colors"
                                  onClick={() => navigate(`/patients/${id}/records/${record.id}`)}
                                >
                                  <div className="space-y-1 mb-2 sm:mb-0">
                                    <h3 className="font-semibold">{record.type}</h3>
                                    <p className="text-sm text-muted-foreground">{record.provider}</p>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <Badge variant="secondary">{format(new Date(record.date), "dd MMM yyyy")}</Badge>
                                    <Badge variant="outline">{record.treatment}</Badge>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteRecordId(record.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="questionnaire" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Medical Questionnaire</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <QuestionnaireForm
                          patientId={id}
                          existingData={questionnaire}
                          onSave={saveQuestionnaire}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="consent" className="mt-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle>Treatment Consent Form</CardTitle>
                        <div className="flex gap-2">
                          <LanguageToggle language={language} onChange={setLanguage} />
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Export PDF
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {editedPatient.consentForm ? (
                          <div className="space-y-6">
                            <ConsentFormContent language={editedPatient.consentForm.language} />
                            <div className="mt-8 space-y-4">
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Patient Name</p>
                                <p className="text-sm font-medium">{editedPatient.consentForm.patientName}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Agreement</p>
                                <p className="text-sm">{editedPatient.consentForm.agreementText}</p>
                                <p className="text-sm">{editedPatient.consentForm.dataProcessingAgreement}</p>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground">Location</p>
                                  <p className="text-sm font-medium">{editedPatient.consentForm.location}</p>
                                </div>
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground">Date</p>
                                  <p className="text-sm font-medium">
                                    {format(new Date(editedPatient.consentForm.date), "dd MMM yyyy")}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Signature</p>
                                <img 
                                  src={editedPatient.consentForm.signature} 
                                  alt="Patient signature" 
                                  className="border rounded-md bg-background p-2"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button
                                variant="destructive"
                                onClick={handleDeleteConsent}
                              >
                                Delete Consent Form
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <ConsentFormContent language={language} />
                            <form onSubmit={handleSignConsent} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="patientName">Patient Name</Label>
                                <Input
                                  id="patientName"
                                  value={consentFormData.patientName}
                                  onChange={(e) => setConsentFormData({ ...consentFormData, patientName: e.target.value })}
                                  placeholder="Enter your full name"
                                  required
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox"
                                  id="consent"
                                  checked={consentFormData.hasAgreed}
                                  onChange={(e) => setConsentFormData({ ...consentFormData, hasAgreed: e.target.checked })}
                                  required
                                />
                                <Label htmlFor="consent" className="text-sm">
                                  {consentFormContent[language].agreementText}
                                </Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox"
                                  id="dataProcessing"
                                  checked={consentFormData.hasAgreedDataProcessing}
                                  onChange={(e) => setConsentFormData({ ...consentFormData, hasAgreedDataProcessing: e.target.checked })}
                                  required
                                />
                                <Label htmlFor="dataProcessing" className="text-sm">
                                  {consentFormContent[language].dataProcessingText}
                                </Label>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="location">Location</Label>
                                  <Input
                                    id="location"
                                    value={consentFormData.location}
                                    onChange={(e) => setConsentFormData({ ...consentFormData, location: e.target.value })}
                                    placeholder="Enter location"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="date">Date</Label>
                                  <Input
                                    id="date"
                                    type="date"
                                    value={consentFormData.date}
                                    onChange={(e) => setConsentFormData({ ...consentFormData, date: e.target.value })}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="signature">Digital Signature</Label>
                                <SignaturePad
                                  onSave={(signature) => setConsentFormData({ ...consentFormData, signature })}
                                />
                              </div>
                              <div className="flex justify-end">
                                <Button 
                                  type="submit"
                                  disabled={!consentFormData.hasAgreed || !consentFormData.hasAgreedDataProcessing || !consentFormData.signature}
                                >
                                  Sign and Submit
                                </Button>
                              </div>
                            </form>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="appointments" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Appointments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {appointments.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No appointments found
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {[...appointments]
                              .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
                              .map((appointment) => (
                                <div key={appointment.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-muted rounded-lg">
                                  <div>
                                    <h3 className="font-semibold">{appointment.type}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {format(new Date(appointment.start), "dd MMM yyyy HH:mm")} - {format(new Date(appointment.end), "HH:mm")}
                                    </p>
                                  </div>
                                  <Badge 
                                    variant={appointment.status === 'Scheduled' ? 'default' : 'secondary'}
                                    className={
                                      appointment.status === 'Scheduled' 
                                        ? 'bg-blue-500 hover:bg-blue-600' 
                                        : 'bg-green-500 hover:bg-green-600'
                                    }
                                  >
                                    {appointment.status}
                                  </Badge>
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={deleteRecordId !== null} onOpenChange={() => setDeleteRecordId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the medical record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteRecordId(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteRecord}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  )
}