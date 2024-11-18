import { useState, useEffect, useCallback } from 'react'
import { StorageManager } from '@/lib/storage'
import { Patient, MedicalRecord, Appointment, MedicalQuestionnaire } from '@/types'

const storage = StorageManager.getInstance()

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])

  useEffect(() => {
    setPatients(storage.getPatients())
  }, [])

  const addPatient = useCallback((patient: Patient) => {
    storage.savePatient(patient)
    setPatients(storage.getPatients())
  }, [])

  const removePatient = useCallback((id: string) => {
    storage.deletePatient(id)
    setPatients(storage.getPatients())
  }, [])

  return { patients, addPatient, removePatient }
}

export function useMedicalRecords(patientId?: string) {
  const [records, setRecords] = useState<MedicalRecord[]>([])

  useEffect(() => {
    setRecords(storage.getMedicalRecords(patientId))
  }, [patientId])

  const addRecord = useCallback((record: MedicalRecord) => {
    storage.saveMedicalRecord(record)
    setRecords(storage.getMedicalRecords(patientId))
  }, [patientId])

  const removeRecord = useCallback((id: string) => {
    storage.deleteMedicalRecord(id)
    setRecords(storage.getMedicalRecords(patientId))
  }, [patientId])

  return { records, addRecord, removeRecord }
}

export function useMedicalQuestionnaire(patientId: string) {
  const [questionnaire, setQuestionnaire] = useState<MedicalQuestionnaire | null>(null)

  useEffect(() => {
    setQuestionnaire(storage.getMedicalQuestionnaire(patientId))
  }, [patientId])

  const saveQuestionnaire = useCallback((data: MedicalQuestionnaire) => {
    storage.saveMedicalQuestionnaire(data)
    setQuestionnaire(storage.getMedicalQuestionnaire(patientId))
  }, [patientId])

  return { questionnaire, saveQuestionnaire }
}

export function useAppointments(patientId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    setAppointments(storage.getAppointments(patientId))
  }, [patientId])

  const addAppointment = useCallback((appointment: Appointment) => {
    storage.saveAppointment(appointment)
    setAppointments(storage.getAppointments(patientId))
  }, [patientId])

  const removeAppointment = useCallback((id: string) => {
    storage.deleteAppointment(id)
    setAppointments(storage.getAppointments(patientId))
  }, [patientId])

  return { appointments, addAppointment, removeAppointment }
}