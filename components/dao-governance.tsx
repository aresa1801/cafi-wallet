"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Vote, Users, BarChart2, Clock, Calendar, DollarSign } from "lucide-react"
import { ProjectProposal } from "./project-proposal"
import { CreateProposal } from "./create-proposal"
import { VotingInterface } from "./voting-interface"
import { PageHeader } from "./page-header"

interface DAOGovernanceProps {
  userTokenBalance: number
  onBack: () => void
}

interface Proposal {
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

export function DAOGovernance({ userTokenBalance, onBack }: DAOGovernanceProps) {
  const [activeView, setActiveView] = useState<"list" | "create" | "details" | "vote">("list")
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)

  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "1",
      title: "Fund Reforestation Project in Amazon",
      description:
        "Proposing to allocate 50,000 CAFI tokens to fund a large-scale reforestation initiative in the Amazon rainforest.",
      status: "active",
      votesFor: 120000,
      votesAgainst: 15000,
      totalVotes: 135000,
      quorum: 100000,
      endTime: "2025-08-01T10:00:00Z",
      proposer: "0xDAOAdmin",
      details:
        "This project aims to plant 1 million trees over 5 years, focusing on biodiversity restoration and carbon sequestration. Funds will cover sapling acquisition, planting operations, and 3-year maintenance. Regular audits will ensure transparency and impact.",
    },
    {
      id: "2",
      title: "Partnership with Green Energy Startup",
      description:
        "Proposal to form a strategic partnership with 'SolarFlow', a promising startup developing decentralized solar energy solutions.",
      status: "pending",
      votesFor: 0,
      votesAgainst: 0,
      totalVotes: 0,
      quorum: 75000,
      endTime: "2025-08-15T14:30:00Z",
      proposer: "0xCommunityMember",
      details:
        "The partnership would involve CarbonFi providing initial seed funding in exchange for a share in SolarFlow's carbon credits generated from their projects. This aligns with CarbonFi's mission to support innovative green technologies.",
    },
    {
      id: "3",
      title: "Community Grant Program Q3",
      description:
        "Establish a grant program for community-led sustainability projects, with a total budget of 20,000 CAFI tokens for Q3.",
      status: "passed",
      votesFor: 80000,
      votesAgainst: 5000,
      totalVotes: 85000,
      quorum: 50000,
      endTime: "2025-07-10T18:00:00Z",
      proposer: "0xCarbonFiCore",
      details:
        "This program will empower community members to propose and execute small-scale environmental initiatives, fostering grassroots engagement and expanding CarbonFi's impact. A transparent application and voting process will be implemented.",
    },
    {
      id: "4",
      title: "Token Burn Initiative (5% of Supply)",
      description: "Proposal to burn 5% of the total CAFI token supply to reduce inflation and increase token value.",
      status: "failed",
      votesFor: 40000,
      votesAgainst: 60000,
      totalVotes: 100000,
      quorum: 70000,
      endTime: "2025-06-20T12:00:00Z",
      proposer: "0xTokenHolder",
      details:
        "The proposed token burn aims to create scarcity and potentially increase the value of remaining CAFI tokens. However, concerns were raised about the impact on liquidity and future development funding.",
    },
  ])

  const handleCreateProposal = (
    newProposal: Omit<Proposal, "id" | "status" | "votesFor" | "votesAgainst" | "totalVotes">,
  ) => {
    const id = (proposals.length + 1).toString()
    const fullProposal: Proposal = {
      ...newProposal,
      id,
      status: "pending",
      votesFor: 0,
      votesAgainst: 0,
      totalVotes: 0,
    }
    setProposals((prev) => [...prev, fullProposal])
    setActiveView("list")
  }

  const handleVote = (proposalId: string, voteType: "for" | "against", amount: number) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) {
          return {
            ...p,
            votesFor: voteType === "for" ? p.votesFor + amount : p.votesFor,
            votesAgainst: voteType === "against" ? p.votesAgainst + amount : p.votesAgainst,
            totalVotes: p.totalVotes + amount,
          }
        }
        return p
      }),
    )
    setActiveView("details") // Go back to proposal details after voting
  }

  const renderContent = () => {
    switch (activeView) {
      case "list":
        return (
          <div className="space-y-6">
            <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary flex items-center gap-2">
                    <Users className="w-5 h-5 text-soft-primary" />
                    Your Governance Power
                  </h3>
                  <Badge className="bg-soft-primary/20 text-soft-primary border-soft-primary/30">
                    {userTokenBalance.toLocaleString()} CAFI
                  </Badge>
                </div>
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-4">
                  Your CAFI balance determines your voting power in DAO proposals.
                </p>
                <Button
                  onClick={() => setActiveView("create")}
                  className="w-full bg-gradient-to-r from-soft-primary to-soft-secondary hover:from-soft-primary/90 hover:to-soft-secondary/90 text-white font-medium shadow-soft"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Create New Proposal
                </Button>
              </CardContent>
            </Card>

            <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-4 flex items-center gap-2">
              <Vote className="w-5 h-5 text-soft-accent" />
              Active Proposals
            </h3>
            <div className="space-y-4">
              {proposals
                .filter((p) => p.status === "active" || p.status === "pending")
                .map((proposal) => (
                  <Card
                    key={proposal.id}
                    className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft hover:shadow-soft-md transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedProposal(proposal)
                      setActiveView("details")
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-text-primary dark:text-text-dark-primary">
                          {proposal.title}
                        </h4>
                        <Badge
                          className={`text-xs ${
                            proposal.status === "active"
                              ? "bg-soft-success/20 text-soft-success border-soft-success/30"
                              : "bg-soft-warning/20 text-soft-warning border-soft-warning/30"
                          }`}
                        >
                          {proposal.status === "active" ? "Active" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-3 line-clamp-2">
                        {proposal.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-text-tertiary dark:text-text-dark-tertiary">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Ends: {new Date(proposal.endTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>Quorum: {proposal.quorum.toLocaleString()} CAFI</span>
                        </div>
                      </div>
                      <Progress
                        value={(proposal.totalVotes / proposal.quorum) * 100}
                        className="h-2 mt-3 bg-neutral-200 dark:bg-neutral-700"
                      />
                      <div className="flex justify-between text-xs text-text-secondary dark:text-text-dark-secondary mt-1">
                        <span>
                          {proposal.totalVotes.toLocaleString()} / {proposal.quorum.toLocaleString()} Votes
                        </span>
                        <span>{Math.round((proposal.totalVotes / proposal.quorum) * 100)}% Quorum</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-text-tertiary dark:text-text-dark-tertiary" />
              Past Proposals
            </h3>
            <div className="space-y-4">
              {proposals
                .filter((p) => p.status === "passed" || p.status === "failed")
                .map((proposal) => (
                  <Card
                    key={proposal.id}
                    className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft hover:shadow-soft-md transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedProposal(proposal)
                      setActiveView("details")
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-text-primary dark:text-text-dark-primary">
                          {proposal.title}
                        </h4>
                        <Badge
                          className={`text-xs ${
                            proposal.status === "passed"
                              ? "bg-soft-success/20 text-soft-success border-soft-success/30"
                              : "bg-soft-error/20 text-soft-error border-soft-error/30"
                          }`}
                        >
                          {proposal.status === "passed" ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-3 line-clamp-2">
                        {proposal.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-text-tertiary dark:text-text-dark-tertiary">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Ended: {new Date(proposal.endTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart2 className="w-3 h-3" />
                          <span>Votes: {proposal.totalVotes.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )
      case "create":
        return <CreateProposal onCreate={handleCreateProposal} onBack={() => setActiveView("list")} />
      case "details":
        return selectedProposal ? (
          <ProjectProposal
            proposal={selectedProposal}
            userTokenBalance={userTokenBalance}
            onBack={() => setActiveView("list")}
            onVote={() => setActiveView("vote")}
          />
        ) : null
      case "vote":
        return selectedProposal ? (
          <VotingInterface
            proposal={selectedProposal}
            userTokenBalance={userTokenBalance}
            onVote={handleVote}
            onBack={() => setActiveView("details")}
          />
        ) : null
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary flex flex-col">
      <PageHeader
        title="DAO Governance"
        subtitle="Participate in CarbonFi's future"
        onBack={onBack}
        badge="sustainable"
      />
      <div className="flex-1 overflow-auto p-4 pb-24">{renderContent()}</div>
    </div>
  )
}
