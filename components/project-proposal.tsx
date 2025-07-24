"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Calendar, DollarSign, User, Info, BarChart2, Vote } from "lucide-react"
import { PageHeader } from "./page-header"

interface ProjectProposalProps {
  proposal: {
    id: string
    title: string
    description: string
    status: "active" | "passed" | "failed" | "pending"
    votesFor: number
    votesAgainst: number
    totalVotes: number
    quorum: number
    endTime: string
    proposer: string
    details: string
  }
  userTokenBalance: number
  onBack: () => void
  onVote: () => void
}

export function ProjectProposal({ proposal, userTokenBalance, onBack, onVote }: ProjectProposalProps) {
  const { title, description, status, votesFor, votesAgainst, totalVotes, quorum, endTime, proposer, details } =
    proposal

  const progressValue = (totalVotes / quorum) * 100
  const timeLeft = new Date(endTime).getTime() - Date.now()
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))

  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-soft-success/20 text-soft-success border-soft-success/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "passed":
        return (
          <Badge className="bg-soft-success/20 text-soft-success border-soft-success/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Passed
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-soft-error/20 text-soft-error border-soft-error/30">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-soft-warning/20 text-soft-warning border-soft-warning/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary flex flex-col">
      <PageHeader title="Proposal Details" subtitle={title} onBack={onBack} badge="sustainable" />

      <div className="flex-1 overflow-auto p-4 space-y-6">
        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-text-primary dark:text-text-dark-primary">{title}</CardTitle>
              {getStatusBadge()}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-text-secondary dark:text-text-dark-secondary text-sm">{description}</p>

            <div className="grid grid-cols-2 gap-3 text-sm text-text-secondary dark:text-text-dark-secondary">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-soft-primary" />
                <span>
                  Proposer: {proposer.substring(0, 6)}...{proposer.substring(proposer.length - 4)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-soft-accent" />
                <span>Ends: {new Date(endTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-soft-secondary" />
                <span>Time Left: {daysLeft > 0 ? `${daysLeft} days` : "Ended"}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-soft-success" />
                <span>Quorum: {quorum.toLocaleString()} CAFI</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-text-primary dark:text-text-dark-primary">
                <span>Votes For: {votesFor.toLocaleString()}</span>
                <span>Votes Against: {votesAgainst.toLocaleString()}</span>
              </div>
              <Progress value={progressValue} className="h-3 bg-neutral-200 dark:bg-neutral-700" />
              <div className="flex justify-between text-xs text-text-secondary dark:text-text-dark-secondary">
                <span>Total Votes: {totalVotes.toLocaleString()}</span>
                <span>Quorum: {Math.round(progressValue)}%</span>
              </div>
            </div>

            {status === "active" && daysLeft > 0 && (
              <Button
                onClick={onVote}
                className="w-full bg-gradient-to-r from-soft-primary to-soft-secondary hover:from-soft-primary/90 hover:to-soft-secondary/90 text-white font-medium shadow-soft"
              >
                <Vote className="w-5 h-5 mr-2" />
                Vote on Proposal
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
          <CardHeader>
            <CardTitle className="text-lg text-text-primary dark:text-text-dark-primary flex items-center gap-2">
              <Info className="w-5 h-5 text-soft-accent" />
              Detailed Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary dark:text-text-dark-secondary text-sm leading-relaxed">{details}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
          <CardHeader>
            <CardTitle className="text-lg text-text-primary dark:text-text-dark-primary flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-soft-success" />
              Your Voting Power
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary dark:text-text-dark-secondary text-sm">Your CAFI Balance</span>
              <span className="font-bold text-lg text-text-primary dark:text-text-dark-primary">
                {userTokenBalance.toLocaleString()} CAFI
              </span>
            </div>
            <p className="text-xs text-text-tertiary dark:text-text-dark-tertiary mt-2">
              This balance represents your current voting power.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
