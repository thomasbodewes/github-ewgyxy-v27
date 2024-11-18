import { useState, useEffect } from 'react'
import { User } from '@/types/user'
import { useLocalStorage } from './use-local-storage'

const defaultUser: User = {
  id: '1',
  firstName: 'T.C.F.',
  lastName: 'Bodewes',
  email: 'info@medvault.com',
  role: 'Medical Doctor',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export function useUser() {
  const [user, setUser] = useLocalStorage<User>('user', defaultUser)

  const updateUser = (updates: Partial<User>) => {
    setUser({
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    })
  }

  return {
    user,
    updateUser
  }
}