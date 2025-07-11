"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown, Zap, AlertTriangle, CheckCircle } from "lucide-react"
import { PageHeader } from "./page-header"

interface VotingInterfaceProps {
  project: any
  userTokenBalance: number
  onBack: () => void
  onVoteComplete: () => void
}

const CAFI_CONTRACT_ADDRESS = "0xa5359E55423E47Afe93D86b1bdaD827f1C1c16EB"

export function VotingInterface({ project, userTokenBalance, onBack, onVoteComplete }: VotingInterfaceProps) {
  const [selectedVote, setSelectedVote] = useState<"for" | "against" | null>(null)
  const [voteAmount, setVoteAmount] = useState(100)
  const [comment, setComment] = useState("")
  const [isVoting, setIsVoting] = useState(false)
  const [voteComplete, setVoteComplete] = useState(false)

  const handleVote = async () => {
    if (!selectedVote) return

    setIsVoting(true)
    // Simulate voting transaction
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsVoting(false)
    setVoteComplete(true)

    setTimeout(() => {
      onVoteComplete()
    }, 2000)
  }

  const votingPower = Math.min(voteAmount, userTokenBalance)
  const votingPercentage = project.totalVotes > 0 ? (project.votesFor / project.totalVotes) * 100 : 0

  if (voteComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary flex items-center justify-center p-4">
        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 w-full max-w-md shadow-soft-lg">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-soft-primary to-soft-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-soft-glow shadow-soft">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-2">Vote Submitted!</h3>
            <p className="text-text-secondary dark:text-text-dark-secondary mb-4">
              Your vote of {votingPower} CAFI tokens has been recorded on the blockchain.
            </p>
            <Badge className="bg-soft-success/20 text-soft-success border-soft-success/30 font-semibold">
              Voted {selectedVote === "for" ? "FOR" : "AGAINST"}
            </Badge>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary">
      {/* Header with Back Button */}
      <PageHeader
        title="Cast Your Vote"
        subtitle={project.title}
        onBack={onBack}
        rightContent={
          <div className="text-right">
            <p className="text-sm text-soft-primary font-semibold">{userTokenBalance.toLocaleString()} CAFI</p>
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Available</p>
          </div>
        }
      />

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Current Voting Status */}
        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
          <CardHeader>
            <CardTitle className="text-text-primary dark:text-text-dark-primary">Current Voting Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-soft-success font-semibold flex items-center">
                <ThumbsUp className="w-4 h-4 mr-1" />
                {project.votesFor.toLocaleString()} FOR
              </span>
              <span className="text-soft-error font-semibold flex items-center">
                <ThumbsDown className="w-4 h-4 mr-1" />
                {project.votesAgainst.toLocaleString()} AGAINST
              </span>
            </div>
            <Progress value={votingPercentage} className="h-3 bg-neutral-200 dark:bg-neutral-700" />
            <div className="flex justify-between text-sm text-text-secondary dark:text-text-dark-secondary">
              <span>{votingPercentage.toFixed(1)}% approval</span>
              <span>Total: {project.totalVotes.toLocaleString()} votes</span>
            </div>
          </CardContent>
        </Card>

        {/* Vote Selection */}
        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
          <CardHeader>
            <CardTitle className="text-text-primary dark:text-text-dark-primary">Your Vote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={selectedVote === "for" ? "default" : "outline"}
                onClick={() => setSelectedVote("for")}
                className={`h-20 flex-col space-y-2 ${
                  selectedVote === "for"
                    ? "bg-soft-success hover:bg-soft-success/80 text-white"
                    : "border-soft-success/30 text-soft-success hover:bg-soft-success/10"
                }`}
              >
                <ThumbsUp className="w-8 h-8" />
                <span className="font-semibold">Vote FOR</span>
              </Button>
              <Button
                variant={selectedVote === "against" ? "default" : "outline"}
                onClick={() => setSelectedVote("against")}
                className={`h-20 flex-col space-y-2 ${
                  selectedVote === "against"
                    ? "bg-soft-error hover:bg-soft-error/80 text-white"
                    : "border-soft-error/30 text-soft-error hover:bg-soft-error/10"
                }`}
              >
                <ThumbsDown className="w-8 h-8" />
                <span className="font-semibold">Vote AGAINST</span>
              </Button>
            </div>

            {selectedVote && (
              <div className="space-y-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                    Voting Power
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max={userTokenBalance}
                      value={voteAmount}
                      onChange={(e) => setVoteAmount(Number(e.target.value))}
                      className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-right min-w-[100px]">
                      <p className="text-lg font-bold text-text-primary dark:text-text-dark-primary">
                        {votingPower.toLocaleString()}
                      </p>
                      <p className="text-xs text-text-secondary dark:text-text-dark-secondary">CARBONFI</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                    Comment (Optional)
                  </label>
                  <Textarea
                    placeholder="Share your thoughts on this proposal..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vote Summary */}
        {selectedVote && (
          <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
            <CardHeader>
              <CardTitle className="text-text-primary dark:text-text-dark-primary flex items-center space-x-2">
                <Zap className="w-5 h-5 text-soft-accent" />
                <span>Vote Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-secondary dark:text-text-dark-secondary">Your Vote</p>
                  <p className={`font-semibold ${selectedVote === "for" ? "text-soft-success" : "text-soft-error"}`}>
                    {selectedVote === "for" ? "FOR" : "AGAINST"}
                  </p>
                </div>
                <div>
                  <p className="text-text-secondary dark:text-text-dark-secondary">Voting Power</p>
                  <p className="font-semibold text-text-primary dark:text-text-dark-primary">
                    {votingPower.toLocaleString()} CAFI
                  </p>
                </div>
              </div>

              <div className="p-3 bg-soft-warning/10 rounded-lg border border-soft-warning/20">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-soft-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-soft-warning">Important</p>
                    <p className="text-xs text-text-secondary dark:text-text-dark-secondary">
                      Your vote will be recorded on the blockchain and cannot be changed. Make sure you understand the
                      proposal before voting.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleVote}
                disabled={!selectedVote || isVoting}
                className="w-full bg-gradient-to-r from-soft-primary to-soft-secondary hover:from-soft-secondary hover:to-soft-primary text-white font-semibold py-3 shadow-soft"
              >
                {isVoting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Vote...</span>
                  </div>
                ) : (
                  `Submit Vote: ${selectedVote?.toUpperCase()}`
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
