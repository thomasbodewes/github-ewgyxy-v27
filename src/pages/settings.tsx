import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/useUser'
import { useToast } from '@/components/ui/use-toast'

export default function Settings() {
  const { user, updateUser } = useUser()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    firstName: user.firstName,
    lastName: user.lastName
  })

  const handleSave = () => {
    updateUser(editedUser)
    setIsEditing(false)
    toast({
      title: "Success",
      description: "Profile updated successfully",
    })
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">User Settings</h1>
        </div>

        <Card className="max-w-xl md:max-w-2xl lg:max-w-3xl">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
              <Button
                variant="outline"
                onClick={() => {
                  if (isEditing) {
                    handleSave()
                  } else {
                    setIsEditing(true)
                  }
                }}
                className="w-full sm:w-auto"
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">First Name</Label>
                {isEditing ? (
                  <Input
                    value={editedUser.firstName}
                    onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                    className="max-w-md"
                  />
                ) : (
                  <p className="text-sm mt-1">{user.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Last Name</Label>
                {isEditing ? (
                  <Input
                    value={editedUser.lastName}
                    onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                    className="max-w-md"
                  />
                ) : (
                  <p className="text-sm mt-1">{user.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm mt-1">{user.email}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Role</Label>
                <p className="text-sm mt-1">Medical Doctor</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Account Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-1">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline" className="w-full sm:w-auto">Enable 2FA</Button>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </MainLayout>
  )
}