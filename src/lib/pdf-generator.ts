import jsPDF from 'jspdf'
import { format } from 'date-fns'
import type { MedicalRecord, Patient } from '@/types'

export function generateMedicalRecordPDF(record: MedicalRecord, patient: Patient): void {
  const doc = new jsPDF()
  const lineHeight = 7
  let yPos = 20

  // Helper function to add text and manage page breaks
  const addText = (text: string, indent: number = 0) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }
    doc.text(text, 20 + indent, yPos)
    yPos += lineHeight
  }

  // Add modernized header with clinic info
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('tsg aesthetic', doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' })
  yPos += lineHeight * 2

  // Add contact information
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const address = 'Sint Willibrordusstraat 79-4, 1073 VA Amsterdam'
  const email = 'info@tsgaesthetic.nl'
  const phone = '+31652653911'
  
  // Center align contact details
  doc.text(address, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' })
  yPos += lineHeight
  doc.text(email, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' })
  yPos += lineHeight
  doc.text(phone, doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' })
  yPos += lineHeight * 2

  // Add decorative line
  doc.setDrawColor(200, 200, 200)
  doc.line(20, yPos, doc.internal.pageSize.getWidth() - 20, yPos)
  yPos += lineHeight * 2

  // Patient Information Section with modern formatting
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(240, 240, 240)
  doc.rect(20, yPos - 5, doc.internal.pageSize.getWidth() - 40, 8, 'F')
  addText('Patient Information')
  doc.setFont('helvetica', 'normal')
  addText(`Name: ${patient.lastName}, ${patient.initials} (${patient.firstName})`, 5)
  addText(`Date of Birth: ${format(new Date(patient.dob), 'dd MMM yyyy')}`, 5)
  addText(`Patient ID: ${patient.id}`, 5)
  addText(`Gender: ${patient.gender}`, 5)
  addText(`Phone Number: ${patient.phone}`, 5)
  addText(`Address: ${patient.address}`, 5)
  yPos += lineHeight

  // Medical Record title
  yPos += lineHeight
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('MEDICAL RECORD', doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' })
  yPos += lineHeight * 2

  // Record Details with enhanced styling
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(240, 240, 240)
  doc.rect(20, yPos - 5, doc.internal.pageSize.getWidth() - 40, 8, 'F')
  addText('Record Details')
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  addText(`Date: ${format(new Date(record.date), 'dd MMM yyyy')}`, 5)
  addText(`Type: ${record.type}`, 5)
  addText(`Medical Doctor: ${record.provider}`, 5)
  if (record.followUpDate) {
    addText(`Follow-up Date: ${format(new Date(record.followUpDate), 'dd MMM yyyy')}`, 5)
  }
  yPos += lineHeight
  doc.setFontSize(12)


  // Clinical Information with improved formatting
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(240, 240, 240)
  doc.rect(20, yPos - 5, doc.internal.pageSize.getWidth() - 40, 8, 'F')
  addText('Clinical Information')
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  addText('Chief Complaint:', 5)
  doc.setFontSize(12)
  const complaintLines = doc.splitTextToSize(record.complaint, 170)
  complaintLines.forEach((line: string) => addText(line, 10))
  doc.setFontSize(12)

  addText('Diagnosis:', 5)
  doc.setFontSize(12)
  const diagnosisLines = doc.splitTextToSize(record.diagnosis, 170)
  diagnosisLines.forEach((line: string) => addText(line, 10))
  doc.setFontSize(12)

  addText('Clinical Notes:', 5)
  doc.setFontSize(12)
  const notesLines = doc.splitTextToSize(record.notes, 170)
  notesLines.forEach((line: string) => addText(line, 10))
  yPos += lineHeight
  doc.setFontSize(12)

  // Treatment Information with consistent styling
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(240, 240, 240)
  doc.rect(20, yPos - 5, doc.internal.pageSize.getWidth() - 40, 8, 'F')
  addText('Treatment Information')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  const treatmentLines = doc.splitTextToSize(record.treatment, 170)
  treatmentLines.forEach((line: string) => addText(line, 5))
  yPos += lineHeight
  doc.setFontSize(12)

  // Medication Details with enhanced layout
  if (record.medications && record.medications.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(240, 240, 240)
    doc.rect(20, yPos - 5, doc.internal.pageSize.getWidth() - 40, 8, 'F')
    addText('Medication Details')
    doc.setFont('helvetica', 'normal')
    record.medications.forEach(medication => {
      addText(`Product: ${medication.productName}`, 5)
      addText(`Generic Name: ${medication.genericName}`, 5)
      addText(`Dosage: ${medication.dosage}`, 5)
      addText(`Batch: ${medication.batch}`, 5)
      if (medication.expiryDate) {
        addText(`Expiry: ${format(new Date(medication.expiryDate), 'MMM yyyy')}`, 5)
      }
      yPos += lineHeight
    })
  }

  // Aftercare Instructions with bullet points
  if (record.aftercare && record.aftercare.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(240, 240, 240)
    doc.rect(20, yPos - 5, doc.internal.pageSize.getWidth() - 40, 8, 'F')
    addText('Aftercare Instructions')
    doc.setFont('helvetica', 'normal')
    record.aftercare.forEach(instruction => {
      addText(`• ${instruction}`, 5)
    })
    yPos += lineHeight
  }

  // Treatment Points Summary with improved formatting
  if (record.treatmentPoints && record.treatmentPoints.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(240, 240, 240)
    doc.rect(20, yPos - 5, doc.internal.pageSize.getWidth() - 40, 8, 'F')
    addText('Treatment Points')
    doc.setFont('helvetica', 'normal')
    record.treatmentPoints.forEach((point, index) => {
      addText(`Point ${index + 1}: ${point.units} units`, 5)
    })
  }

  // Enhanced footer with timestamp and confidentiality notice
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  const pageCount = doc.getNumberOfPages()
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    // Add footer line
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 280, doc.internal.pageSize.getWidth() - 20, 280)
    // Add footer text
    const footer = `CONFIDENTIAL - Generated on ${format(new Date(), 'dd MMM yyyy HH:mm')} - Page ${i} of ${pageCount}`
    doc.text(footer, doc.internal.pageSize.getWidth() / 2, 290, { align: 'center' })
  }

  // Generate filename and download
  const filename = `medical-record-${patient.id}-${record.id}.pdf`
  doc.save(filename)
}