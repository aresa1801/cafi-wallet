"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Vote,
  Users,
  Leaf,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
  Award,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Zap,
} from "lucide-react"
import { ProjectProposal } from "./project-proposal"
import { CreateProposal } from "./create-proposal"
import { PageHeader } from "./page-header"
import { EcoBadge } from "./eco-badge"

const CAFI_CONTRACT_ADDRESS = "0xa5359E55423E47Afe93D86b1bdaD827f1C1c16EB"

interface GreenProject {
  id: string
  title: string
  description: string
  category: "renewable" | "reforestation" | "ocean" | "technology" | "community"
  location: string
  fundingGoal: number
  currentFunding: number
  carbonImpact: number
  timeline: string
  status: "proposal" | "voting" | "funded" | "active" | "completed"
  proposer: string
  votesFor: number
  votesAgainst: number
  totalVotes: number
  votingEnds: string
  images: string[]
  details: {
    problem: string
    solution: string
    impact: string
    team: string[]
    milestones: { title: string; date: string; completed: boolean }[]
  }
}

const mockProjects: GreenProject[] = [
  {
    id: "1",
    title: "Solar Farm Initiative - Bali",
    description: "Building a 50MW solar farm to power 15,000 homes in rural Bali with clean renewable energy.",
    category: "renewable",
    location: "Bali, Indonesia",
    fundingGoal: 2500000,
    currentFunding: 1875000,
    carbonImpact: 125000,
    timeline: "18 months",
    status: "voting",
    proposer: "GreenEnergy DAO",
    votesFor: 15420,
    votesAgainst: 2340,
    totalVotes: 17760,
    votingEnds: "2024-01-25",
    images: ["/placeholder.svg?height=200&width=300"],
    details: {
      problem: "Rural Bali communities lack access to reliable clean energy, relying on diesel generators.",
      solution: "Deploy 50MW solar farm with battery storage and smart grid integration.",
      impact: "125,000 tons CO₂ reduction annually, powering 15,000 homes with clean energy.",
      team: ["Dr. Made Sutrisna", "Sarah Chen", "Ahmad Rahman"],
      milestones: [
        { title: "Land Acquisition", date: "2024-02-15", completed: false },
        { title: "Environmental Assessment", date: "2024-04-01", completed: false },
        { title: "Construction Phase 1", date: "2024-06-01", completed: false },
        { title: "Grid Connection", date: "2024-12-01", completed: false },
      ],
    },
  },
  {
    id: "2",
    title: "Mangrove Restoration - Sumatra",
    description: "Restoring 5,000 hectares of mangrove forests to protect coastlines and marine ecosystems.",
    category: "reforestation",
    location: "Sumatra, Indonesia",
    fundingGoal: 800000,
    currentFunding: 650000,
    carbonImpact: 75000,
    timeline: "24 months",
    status: "voting",
    proposer: "Ocean Guardians",
    votesFor: 12890,
    votesAgainst: 1560,
    totalVotes: 14450,
    votingEnds: "2024-01-28",
    images: ["/placeholder.svg?height=200&width=300"],
    details: {
      problem: "Coastal erosion and loss of marine biodiversity due to mangrove deforestation.",
      solution: "Community-led mangrove replanting with sustainable aquaculture integration.",
      impact: "75,000 tons CO₂ sequestration, protecting 50km of coastline.",
      team: ["Prof. Sari Wijaya", "Captain Budi", "Maria Santos"],
      milestones: [
        { title: "Community Training", date: "2024-02-01", completed: false },
        { title: "Seedling Preparation", date: "2024-03-15", completed: false },
        { title: "Planting Phase 1", date: "2024-05-01", completed: false },
        { title: "Monitoring Setup", date: "2024-08-01", completed: false },
      ],
    },
  },
  {
    id: "3",
    title: "Ocean Plastic Cleanup - Java Sea",
    description: "Deploying autonomous cleanup vessels to remove plastic waste from Java Sea waters.",
    category: "ocean",
    location: "Java Sea, Indonesia",
    fundingGoal: 1200000,
    currentFunding: 450000,
    carbonImpact: 25000,
    timeline: "12 months",
    status: "proposal",
    proposer: "CleanSeas Tech",
    votesFor: 0,
    votesAgainst: 0,
    totalVotes: 0,
    votingEnds: "2024-02-10",
    images: ["/placeholder.svg?height=200&width=300"],
    details: {
      problem: "Java Sea contains over 2 million tons of plastic waste affecting marine life.",
      solution: "Deploy 10 autonomous cleanup vessels with AI-powered waste collection.",
      impact: "Remove 50,000 tons of plastic, preventing 25,000 tons CO₂ equivalent emissions.",
      team: ["Dr. Ocean Kim", "Tech Lead Alex", "Marine Biologist Lisa"],
      milestones: [
        { title: "Vessel Manufacturing", date: "2024-03-01", completed: false },
        { title: "AI System Testing", date: "2024-05-01", completed: false },
        { title: "Deployment Phase", date: "2024-07-01", completed: false },
        { title: "Full Operation", date: "2024-10-01", completed: false },
      ],
    },
  },
]

interface DAOGovernanceProps {
  userTokenBalance: number
  onBack: () => void
}

export function DAOGovernance({ userTokenBalance = 1250, onBack }: DAOGovernanceProps) {
  const [selectedProject, setSelectedProject] = useState<GreenProject | null>(null)
  const [showCreateProposal, setShowCreateProposal] = useState(false)
  const [activeTab, setActiveTab] = useState("proposals")

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "renewable":
        return "⚡"
      case "reforestation":
        return "🌳"
      case "ocean":
        return "🌊"
      case "technology":
        return "🔬"
      case "community":
        return "🏘️"
      default:
        return "🌱"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "renewable":
        return "text-soft-warning"
      case "reforestation":
        return "text-soft-success"
      case "ocean":
        return "text-soft-accent"
      case "technology":
        return "text-soft-secondary"
      case "community":
        return "text-soft-primary"
      default:
        return "text-soft-primary"
    }
  }

  const getCategoryBg = (category: string) => {
    switch (category) {
      case "renewable":
        return "bg-soft-warning/10 border-soft-warning/20"
      case "reforestation":
        return "bg-soft-success/10 border-soft-success/20"
      case "ocean":
        return "bg-soft-accent/10 border-soft-accent/20"
      case "technology":
        return "bg-soft-secondary/10 border-soft-secondary/20"
      case "community":
        return "bg-soft-primary/10 border-soft-primary/20"
      default:
        return "bg-soft-primary/10 border-soft-primary/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "proposal":
        return "bg-soft-accent/20 text-soft-accent border-soft-accent/30"
      case "voting":
        return "bg-soft-warning/20 text-soft-warning border-soft-warning/30"
      case "funded":
        return "bg-soft-primary/20 text-soft-primary border-soft-primary/30"
      case "active":
        return "bg-soft-secondary/20 text-soft-secondary border-soft-secondary/30"
      case "completed":
        return "bg-soft-success/20 text-soft-success border-soft-success/30"
      default:
        return "bg-neutral-200 dark:bg-neutral-700 text-text-secondary dark:text-text-dark-secondary"
    }
  }

  const totalTreasuryValue = mockProjects.reduce((sum, project) => sum + project.currentFunding, 0)
  const activeProposals = mockProjects.filter((p) => p.status === "voting").length
  const totalCarbonImpact = mockProjects.reduce((sum, project) => sum + project.carbonImpact, 0)

  if (selectedProject) {
    return (
      <ProjectProposal
        project={selectedProject}
        userTokenBalance={userTokenBalance}
        onBack={() => setSelectedProject(null)}
      />
    )
  }

  if (showCreateProposal) {
    return <CreateProposal onBack={() => setShowCreateProposal(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary">
      {/* Header with Back Button */}
      <PageHeader
        title="CarbonFi DAO"
        subtitle="Community Governance"
        onBack={onBack}
        badge="sustainable"
        rightContent={
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-soft-primary font-semibold">{userTokenBalance.toLocaleString()} CAFI</p>
              <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Voting Power</p>
            </div>
            <Button
              onClick={() => setShowCreateProposal(true)}
              className="bg-gradient-to-r from-soft-primary to-soft-secondary hover:from-soft-primary/90 hover:to-soft-secondary/90 text-white font-medium shadow-soft"
            >
              <Plus className="w-4 h-4 mr-2" />
              Propose
            </Button>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* DAO Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-soft-primary/10 to-soft-secondary/10 border-soft-primary/20 shadow-soft">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-soft-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">
                ${(totalTreasuryValue / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-soft-primary font-medium">Treasury Value</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-soft-warning/10 to-soft-error/10 border-soft-warning/20 shadow-soft">
            <CardContent className="p-4 text-center">
              <Vote className="w-8 h-8 text-soft-warning mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">{activeProposals}</p>
              <p className="text-xs text-soft-warning font-medium">Active Votes</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-soft-accent/10 to-soft-secondary/10 border-soft-accent/20 shadow-soft">
            <CardContent className="p-4 text-center">
              <Leaf className="w-8 h-8 text-soft-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">
                {(totalCarbonImpact / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-soft-accent font-medium">Tons CO₂ Impact</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/60 dark:bg-bg-dark-secondary/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700">
            <TabsTrigger
              value="proposals"
              className="data-[state=active]:bg-soft-primary data-[state=active]:text-white"
            >
              <Vote className="w-4 h-4 mr-2" />
              Proposals
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-soft-accent data-[state=active]:text-white">
              <Zap className="w-4 h-4 mr-2" />
              Active Projects
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-soft-secondary data-[state=active]:text-white"
            >
              <Award className="w-4 h-4 mr-2" />
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="proposals" className="mt-6">
            <div className="space-y-4">
              {mockProjects
                .filter((project) => project.status === "proposal" || project.status === "voting")
                .map((project) => (
                  <Card
                    key={project.id}
                    className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 hover:border-soft-primary/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] shadow-soft hover:shadow-soft-lg"
                    onClick={() => setSelectedProject(project)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Project Image */}
                        <div className="w-full md:w-48 h-32 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
                          <img
                            src={project.images[0] || "/placeholder.svg"}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Project Info */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-text-primary dark:text-text-dark-primary mb-1">
                                {project.title}
                              </h3>
                              <p className="text-text-secondary dark:text-text-dark-secondary text-sm">
                                {project.description}
                              </p>
                            </div>
                            <Badge className={`${getStatusColor(project.status)} font-medium`}>
                              {project.status.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <span className="text-2xl">{getCategoryIcon(project.category)}</span>
                              <span className={`font-medium capitalize ${getCategoryColor(project.category)}`}>
                                {project.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-text-secondary dark:text-text-dark-secondary">
                              <MapPin className="w-4 h-4" />
                              <span>{project.location}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-text-secondary dark:text-text-dark-secondary">
                              <Calendar className="w-4 h-4" />
                              <span>{project.timeline}</span>
                            </div>
                          </div>

                          {/* Funding Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-text-primary dark:text-text-dark-primary font-semibold">
                                ${project.currentFunding.toLocaleString()} raised
                              </span>
                              <span className="text-text-secondary dark:text-text-dark-secondary">
                                Goal: ${project.fundingGoal.toLocaleString()}
                              </span>
                            </div>
                            <Progress
                              value={(project.currentFunding / project.fundingGoal) * 100}
                              className="h-2 bg-neutral-200 dark:bg-neutral-700"
                            />
                          </div>

                          {/* Voting Info */}
                          {project.status === "voting" && (
                            <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <ThumbsUp className="w-4 h-4 text-soft-success" />
                                  <span className="text-soft-success font-semibold">
                                    {project.votesFor.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <ThumbsDown className="w-4 h-4 text-soft-error" />
                                  <span className="text-soft-error font-semibold">
                                    {project.votesAgainst.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-text-secondary dark:text-text-dark-secondary">
                                <Clock className="w-4 h-4" />
                                <span>Ends {new Date(project.votingEnds).toLocaleDateString()}</span>
                              </div>
                            </div>
                          )}

                          {/* Impact Metrics */}
                          <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center space-x-2">
                              <Leaf className="w-4 h-4 text-soft-success" />
                              <span className="text-soft-success font-semibold">
                                {project.carbonImpact.toLocaleString()} tons CO₂
                              </span>
                              <EcoBadge variant="carbon-neutral" size="sm" />
                            </div>
                            <div className="flex items-center space-x-2 text-text-secondary dark:text-text-dark-secondary">
                              <Users className="w-4 h-4" />
                              <span>{project.totalVotes.toLocaleString()} votes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-soft-accent mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-text-primary dark:text-text-dark-primary mb-2">Active Projects</h3>
              <p className="text-text-secondary dark:text-text-dark-secondary">
                Funded projects will appear here once voting completes
              </p>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-soft-secondary mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
                Completed Projects
              </h3>
              <p className="text-text-secondary dark:text-text-dark-secondary">
                Successfully completed green initiatives will be showcased here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
