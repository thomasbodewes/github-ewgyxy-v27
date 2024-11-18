import { useState, useCallback } from "react"
import { startOfMonth, endOfMonth, eachMonthOfInterval, format, subMonths, isPast, subYears } from "date-fns"
import { ArrowRight, Calendar, Users, TrendingUp, Filter, Building2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MainLayout } from "@/components/layout/main-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePatients, useAppointments } from "@/hooks/useStorage"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function Dashboard() {
  const navigate = useNavigate()
  const { patients } = usePatients()
  const { appointments } = useAppointments()
  const [timeRange, setTimeRange] = useState("12months")
  const [cumulativeTimeRange, setCumulativeTimeRange] = useState("12months")

  const handleClinicClick = useCallback(() => {
    window.open('https://www.tsgaesthetic.nl', '_blank')
  }, [])

  const getDateRange = (range: string) => {
    switch (range) {
      case "6months":
        return subMonths(new Date(), 5)
      case "12months":
        return subMonths(new Date(), 11)
      case "2years":
        return subYears(new Date(), 2)
      default:
        return subMonths(new Date(), 11)
    }
  }

  const monthlyData = eachMonthOfInterval({
    start: getDateRange(timeRange),
    end: new Date()
  }).map(month => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    
    const patientsInMonth = patients.filter(patient => {
      const createdAt = new Date(patient.createdAt)
      return createdAt >= monthStart && createdAt <= monthEnd
    }).length

    const appointmentsInMonth = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.start)
      return appointmentDate >= monthStart && appointmentDate <= monthEnd
    }).length

    return {
      name: format(month, 'MMM yy'),
      patients: patientsInMonth,
      appointments: appointmentsInMonth
    }
  })

  const cumulativeData = eachMonthOfInterval({
    start: getDateRange(cumulativeTimeRange),
    end: new Date()
  }).map((month, index, array) => {
    const monthEnd = endOfMonth(month)
    
    const totalPatients = patients.filter(patient => {
      const createdAt = new Date(patient.createdAt)
      return createdAt <= monthEnd
    }).length

    const totalAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.start)
      return appointmentDate <= monthEnd
    }).length

    return {
      name: format(month, 'MMM yy'),
      totalPatients,
      totalAppointments
    }
  })

  const totalPatients = patients.length
  const upcomingAppointments = appointments.filter(appointment => 
    !isPast(new Date(appointment.start))
  ).length

  const currentMonthPatients = monthlyData[monthlyData.length - 1]?.patients || 0
  const lastMonthPatients = monthlyData[monthlyData.length - 2]?.patients || 0
  const patientGrowth = lastMonthPatients 
    ? ((currentMonthPatients - lastMonthPatients) / lastMonthPatients) * 100 
    : 0

  const currentMonthAppointments = monthlyData[monthlyData.length - 1]?.appointments || 0
  const lastMonthAppointments = monthlyData[monthlyData.length - 2]?.appointments || 0
  const appointmentGrowth = lastMonthAppointments 
    ? ((currentMonthAppointments - lastMonthAppointments) / lastMonthAppointments) * 100 
    : 0

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary">
            <img 
    src="/logo.svg" 
    alt="Company Logo" 
    className="w-12 h-12 object-contain"
  />
          </div>
          <div>
            <h1 className="text-3xl font-bold">MedVault Analytics</h1>
            <p className="text-sm text-muted-foreground">Patient Management Dashboard</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group cursor-pointer transition-all hover:shadow-md" onClick={() => navigate('/patients')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-muted-foreground">
                {patientGrowth > 0 ? '+' : ''}{patientGrowth.toFixed(2)}% from last month
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-between">
                View all patients
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="group cursor-pointer transition-all hover:shadow-md" onClick={() => navigate('/appointments')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                {appointmentGrowth > 0 ? '+' : ''}{appointmentGrowth.toFixed(2)}% from last month
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-between">
                View all appointments
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card 
            className="group cursor-pointer transition-all hover:shadow-md" 
            onClick={handleClinicClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Name Clinic</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">tsg aesthetic</div>
              <p className="text-xs text-muted-foreground">
                tsgaesthetic.nl
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full justify-between">
                Visit website
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.9/5.0</div>
              <p className="text-xs text-muted-foreground">
                Based on 50 reviews
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Cumulative Growth</CardTitle>
                <CardDescription>Total patients and appointments over time</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    {cumulativeTimeRange === "6months" ? "Last 6 months" : 
                     cumulativeTimeRange === "12months" ? "Last 12 months" : "Last 2 years"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCumulativeTimeRange("6months")}>
                    Last 6 months
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCumulativeTimeRange("12months")}>
                    Last 12 months
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCumulativeTimeRange("2years")}>
                    Last 2 years
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patients" className="space-y-4">
              <TabsList>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
              </TabsList>
              <TabsContent value="patients" className="space-y-4">
                <ChartContainer
                  config={{
                    totalPatients: {
                      label: "Total Patients",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cumulativeData}>
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="totalPatients"
                        stroke="var(--color-totalPatients)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="appointments" className="space-y-4">
                <ChartContainer
                  config={{
                    totalAppointments: {
                      label: "Total Appointments",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cumulativeData}>
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="totalAppointments"
                        stroke="var(--color-totalAppointments)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Growth Analytics</CardTitle>
                <CardDescription>Monthly growth in patients and appointments</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    {timeRange === "6months" ? "Last 6 months" : 
                     timeRange === "12months" ? "Last 12 months" : "Last 2 years"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTimeRange("6months")}>
                    Last 6 months
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange("12months")}>
                    Last 12 months
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange("2years")}>
                    Last 2 years
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patients" className="space-y-4">
              <TabsList>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
              </TabsList>
              <TabsContent value="patients" className="space-y-4">
                <ChartContainer
                  config={{
                    patients: {
                      label: "Patients",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="patients"
                        stroke="var(--color-patients)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="appointments" className="space-y-4">
                <ChartContainer
                  config={{
                    appointments: {
                      label: "Appointments",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="appointments"
                        stroke="var(--color-appointments)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}