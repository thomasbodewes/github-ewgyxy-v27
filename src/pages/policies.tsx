import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Shield, AlertTriangle } from "lucide-react"
import { PDFViewer } from "@/components/ui/pdf-viewer"

interface Policy {
  id: string
  title: string
  description: string
  icon: JSX.Element
  pdfUrl: string
}

const policies: Policy[] = [
  {
    id: "privacy",
    title: "Privacy Policy",
    description: "Our commitment to protecting your personal information",
    icon: <FileText className="w-8 h-8 sm:w-12 sm:h-12 mb-4" />,
    pdfUrl: "/policies/privacy-policy.pdf"
  },
  {
    id: "security",
    title: "Data Security Policy",
    description: "How we safeguard your data and maintain its integrity",
    icon: <Shield className="w-8 h-8 sm:w-12 sm:h-12 mb-4" />,
    pdfUrl: "/policies/security-policy.pdf"
  },
  {
    id: "breach",
    title: "Data Breach Plan",
    description: "Our protocol for handling potential data breaches",
    icon: <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 mb-4" />,
    pdfUrl: "/policies/breach-plan.pdf"
  }
]

export default function Policies() {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">Our Policies</h1>
        
        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <FileText className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Privacy Policy</span>
              <span className="sm:hidden">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Data Security</span>
              <span className="sm:hidden">Security</span>
            </TabsTrigger>
            <TabsTrigger value="breach" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Data Breach Plan</span>
              <span className="sm:hidden">Breach</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex justify-center">
            <Card className="border-0 sm:border w-full max-w-md md:max-w-2xl lg:max-w-4xl">
              <CardContent className="p-0 sm:p-6">
                {policies.map((policy) => (
                  <TabsContent key={policy.id} value={policy.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-center px-4 py-6 sm:p-6"
                    >
                      {policy.icon}
                      <h2 className="text-xl sm:text-2xl font-semibold mb-2">{policy.title}</h2>
                      <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md mx-auto">
                        {policy.description}
                      </p>
                      <Button onClick={() => setSelectedPolicy(policy)}>
                        View Policy
                      </Button>
                    </motion.div>
                  </TabsContent>
                ))}
              </CardContent>
            </Card>
          </div>
        </Tabs>

        <PDFViewer
          isOpen={selectedPolicy !== null}
          onClose={() => setSelectedPolicy(null)}
          pdfUrl={selectedPolicy?.pdfUrl || ""}
          title={selectedPolicy?.title || ""}
        />
      </div>
    </MainLayout>
  )
}