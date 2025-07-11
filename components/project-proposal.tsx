"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  MapPin,
  Calendar,
  Target,
  Users,
  Leaf,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react"
import { VotingInterface } from "./voting-interface"
import { PageHeader } from "./page-header"

interface ProjectProposalProps {
  project: any
  userTokenBalance: number
  onBack: () => void
}

export function ProjectProposal({ project, userTokenBalance, onBack }: ProjectProposalProps) {
  const [showVoting, setShowVoting] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "proposal":
        return "bg-carbon-accent text-dark-bg"
      case "voting":
        return "bg-carbon-orange text-dark-bg"
      case "funded":
        return "bg-carbon-primary text-dark-bg"
      case "active":
        return "bg-carbon-purple text-white"
      case "completed":
        return "bg-success text-dark-bg"
      default:
        return "bg-dark-muted text-white"
    }
  }

  const votingPercentage = project.totalVotes > 0 ? (project.votesFor / project.totalVotes) * 100 : 0
  const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100

  if (showVoting) {
    return (
      <VotingInterface
        project={project}
        userTokenBalance={userTokenBalance}
        onBack={() => setShowVoting(false)}
        onVoteComplete={() => {
          setShowVoting(false)
          // Here you would update the project data
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary">
      {/* Header with Back Button */}
      <PageHeader
        title={project.title}
        subtitle={`by ${project.proposer}`}
        onBack={onBack}
        rightContent={
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-text-tertiary dark:text-text-dark-tertiary hover:text-text-primary dark:hover:text-text-dark-primary"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Badge className={`${getStatusColor(project.status)} font-semibold`}>{project.status.toUpperCase()}</Badge>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Hero Section */}
        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-soft-lg">
          <div className="aspect-video bg-neutral-100 dark:bg-neutral-800">
            <img
              src={project.images[0] || "/placeholder.svg"}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{getCategoryIcon(project.category)}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary">
                      {project.title}
                    </h2>
                    <p className="text-text-secondary dark:text-text-dark-secondary">{project.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-1 text-text-secondary dark:text-text-dark-secondary">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-text-secondary dark:text-text-dark-secondary">
                    <Calendar className="w-4 h-4" />
                    <span>{project.timeline}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-soft-primary">
                    <Leaf className="w-4 h-4" />
                    <span className="font-semibold">{project.carbonImpact.toLocaleString()} tons CO₂</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-80 space-y-4">
                {/* Funding Progress */}
                <Card className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-text-primary dark:text-text-dark-primary font-semibold">
                          ${project.currentFunding.toLocaleString()}
                        </span>
                        <span className="text-text-secondary dark:text-text-dark-secondary">
                          of ${project.fundingGoal.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={fundingPercentage} className="h-3 bg-neutral-200 dark:bg-neutral-700" />
                      <p className="text-sm text-soft-primary font-semibold">{fundingPercentage.toFixed(1)}% funded</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Voting Status */}
                {project.status === "voting" && (
                  <Card className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-soft-success font-semibold flex items-center">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {project.votesFor.toLocaleString()}
                          </span>
                          <span className="text-soft-error font-semibold flex items-center">
                            <ThumbsDown className="w-4 h-4 mr-1" />
                            {project.votesAgainst.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={votingPercentage} className="h-3 bg-neutral-200 dark:bg-neutral-700" />
                        <div className="flex justify-between text-sm">
                          <span className="text-text-primary dark:text-text-dark-primary">
                            {votingPercentage.toFixed(1)}% approval
                          </span>
                          <span className="text-text-secondary dark:text-text-dark-secondary flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Ends {new Date(project.votingEnds).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Button */}
                {project.status === "voting" && (
                  <Button
                    onClick={() => setShowVoting(true)}
                    className="w-full bg-gradient-to-r from-soft-primary to-soft-secondary hover:from-soft-secondary hover:to-soft-primary text-white font-semibold py-3 shadow-soft"
                  >
                    Cast Your Vote
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 dark:bg-bg-dark-secondary/60 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-soft-primary data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-soft-accent data-[state=active]:text-white">
              Details
            </TabsTrigger>
            <TabsTrigger
              value="milestones"
              className="data-[state=active]:bg-soft-secondary data-[state=active]:text-white"
            >
              Milestones
            </TabsTrigger>
            <TabsTrigger
              value="discussion"
              className="data-[state=active]:bg-soft-warning data-[state=active]:text-white"
            >
              Discussion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-text-primary dark:text-text-dark-primary flex items-center space-x-2">
                    <Target className="w-5 h-5 text-soft-primary" />
                    <span>Problem Statement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary dark:text-text-dark-secondary leading-relaxed">
                    {project.details.problem}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft">
                <CardHeader>
                  <CardTitle className="text-text-primary dark:text-text-dark-primary flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-soft-accent" />
                    <span>Proposed Solution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary dark:text-text-dark-secondary leading-relaxed">
                    {project.details.solution}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-text-primary dark:text-text-dark-primary flex items-center space-x-2">
                    <Leaf className="w-5 h-5 text-soft-primary" />
                    <span>Environmental Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary dark:text-text-dark-secondary leading-relaxed mb-4">
                    {project.details.impact}
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-soft-primary/10 rounded-lg border border-soft-primary/20">
                      <p className="text-2xl font-bold text-soft-primary">{project.carbonImpact.toLocaleString()}</p>
                      <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Tons CO₂ Impact</p>
                    </div>
                    <div className="text-center p-3 bg-soft-accent/10 rounded-lg border border-soft-accent/20">
                      <p className="text-2xl font-bold text-soft-accent">{project.timeline}</p>
                      <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Timeline</p>
                    </div>
                    <div className="text-center p-3 bg-soft-secondary/10 rounded-lg border border-soft-secondary/20">
                      <p className="text-2xl font-bold text-soft-secondary">
                        ${(project.fundingGoal / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Funding Goal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft">
              <CardHeader>
                <CardTitle className="text-text-primary dark:text-text-dark-primary flex items-center space-x-2">
                  <Users className="w-5 h-5 text-soft-primary" />
                  <span>Project Team</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.details.team.map((member: string, index: number) => (
                    <div key={index} className="text-center p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                      <div className="w-16 h-16 bg-gradient-to-br from-soft-primary to-soft-accent rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <p className="font-semibold text-text-primary dark:text-text-dark-primary">{member}</p>
                      <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Team Member</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="mt-6">
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft">
              <CardHeader>
                <CardTitle className="text-text-primary dark:text-text-dark-primary flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-soft-primary" />
                  <span>Project Milestones</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.details.milestones.map((milestone: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.completed
                            ? "bg-soft-success text-white"
                            : "bg-neutral-200 dark:bg-neutral-700 text-text-secondary dark:text-text-dark-secondary border-2 border-neutral-300 dark:border-neutral-600"
                        }`}
                      >
                        {milestone.completed ? <CheckCircle className="w-5 h-5" /> : <span>{index + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-text-primary dark:text-text-dark-primary">{milestone.title}</p>
                        <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                          Target: {milestone.date}
                        </p>
                      </div>
                      <Badge
                        className={
                          milestone.completed
                            ? "bg-soft-success/20 text-soft-success border-soft-success/30"
                            : "bg-neutral-200 dark:bg-neutral-700 text-text-secondary dark:text-text-dark-secondary"
                        }
                      >
                        {milestone.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discussion" className="mt-6">
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft">
              <CardHeader>
                <CardTitle className="text-text-primary dark:text-text-dark-primary flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-soft-accent" />
                  <span>Community Discussion</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-soft-accent mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
                    Join the Discussion
                  </h3>
                  <p className="text-text-secondary dark:text-text-dark-secondary mb-4">
                    Community comments and discussions will appear here
                  </p>
                  <Button className="bg-soft-accent hover:bg-soft-accent/80 text-white shadow-soft">
                    Start Discussion
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
