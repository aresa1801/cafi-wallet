"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Vote, Info } from "lucide-react"
import { PageHeader } from "./page-header"

interface VotingInterfaceProps {
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
  onVote: (proposalId: string, voteType: "for" | "against", amount: number) => void
  onBack: () => void
}

export function VotingInterface({ proposal, userTokenBalance, onVote, onBack }: VotingInterfaceProps) {
  const [voteAmount, setVoteAmount] = useState(0)
  const [voteType, setVoteType] = useState<"for" | "against" | null>(null)

  const handleVoteSubmit = () => {
    if (voteAmount > 0 && voteAmount <= userTokenBalance && voteType) {
      onVote(proposal.id, voteType, voteAmount)
    } else {
      alert("Please enter a valid vote amount within your balance and select a vote type.")
    }
  }

  const isVotingDisabled = proposal.status !== "active" || new Date(proposal.endTime).getTime() < Date.now()

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary flex flex-col">
      <PageHeader title="Cast Your Vote" subtitle={proposal.title} onBack={onBack} badge="sustainable" />

      <div className="flex-1 overflow-auto p-4 space-y-6">
        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
          <CardHeader>
            <CardTitle className="text-lg text-text-primary dark:text-text-dark-primary flex items-center gap-2">
              <Vote className="w-5 h-5 text-soft-primary" />
              Vote on Proposal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-text-secondary dark:text-text-dark-secondary text-sm">
              Your current CAFI balance:{" "}
              <span className="font-semibold text-text-primary dark:text-text-dark-primary">
                {userTokenBalance.toLocaleString()} CAFI
              </span>
            </p>

            <div>
              <Label htmlFor="voteAmount" className="text-text-primary dark:text-text-dark-primary">
                Vote Amount (CAFI)
              </Label>
              <Input
                id="voteAmount"
                type="number"
                value={voteAmount}
                onChange={(e) => setVoteAmount(Number(e.target.value))}
                placeholder="Enter amount to vote"
                min="0"
                max={userTokenBalance}
                disabled={isVotingDisabled}
                className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary"
              />
              <p className="text-xs text-text-tertiary dark:text-text-dark-tertiary mt-1">
                Max: {userTokenBalance.toLocaleString()} CAFI
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={voteType === "for" ? "default" : "outline"}
                onClick={() => setVoteType("for")}
                disabled={isVotingDisabled}
                className={`flex-col h-20 ${
                  voteType === "for"
                    ? "bg-gradient-to-r from-soft-success to-soft-primary text-white shadow-soft"
                    : "border-soft-success/30 text-soft-success hover:bg-soft-success/10 hover:border-soft-success/50"
                }`}
              >
                <CheckCircle className="w-6 h-6 mb-1" />
                <span className="text-sm">Vote For</span>
              </Button>
              <Button
                variant={voteType === "against" ? "default" : "outline"}
                onClick={() => setVoteType("against")}
                disabled={isVotingDisabled}
                className={`flex-col h-20 ${
                  voteType === "against"
                    ? "bg-gradient-to-r from-soft-error to-soft-warning text-white shadow-soft"
                    : "border-soft-error/30 text-soft-error hover:bg-soft-error/10 hover:border-soft-error/50"
                }`}
              >
                <XCircle className="w-6 h-6 mb-1" />
                <span className="text-sm">Vote Against</span>
              </Button>
            </div>

            <Button
              onClick={handleVoteSubmit}
              disabled={isVotingDisabled || voteAmount <= 0 || !voteType}
              className="w-full bg-gradient-to-r from-soft-primary to-soft-secondary hover:from-soft-primary/90 hover:to-soft-secondary/90 text-white font-medium shadow-soft"
            >
              <Vote className="w-5 h-5 mr-2" />
              Cast Vote
            </Button>

            {isVotingDisabled && (
              <div className="flex items-center space-x-2 p-3 bg-soft-warning/10 border border-soft-warning/20 rounded-lg">
                <Info className="w-5 h-5 text-soft-warning" />
                <p className="text-sm text-soft-warning">Voting is closed for this proposal.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
