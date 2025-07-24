"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Send } from "lucide-react"
import { PageHeader } from "./page-header"

interface CreateProposalProps {
  onCreate: (proposal: {
    title: string
    description: string
    quorum: number
    endTime: string
    proposer: string
    details: string
  }) => void
  onBack: () => void
}

export function CreateProposal({ onCreate, onBack }: CreateProposalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [details, setDetails] = useState("")
  const [quorum, setQuorum] = useState(0)
  const [endTime, setEndTime] = useState("")
  const [proposer] = useState("0xYourWalletAddress") // Mock proposer address

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && description && quorum > 0 && endTime && details) {
      onCreate({ title, description, quorum, endTime, proposer, details })
    } else {
      alert("Please fill in all fields correctly.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary flex flex-col">
      <PageHeader
        title="Create Proposal"
        subtitle="Submit your idea for DAO governance"
        onBack={onBack}
        badge="sustainable"
      />

      <div className="flex-1 overflow-auto p-4 space-y-6">
        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
          <CardHeader>
            <CardTitle className="text-lg text-text-primary dark:text-text-dark-primary flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-soft-primary" />
              New Governance Proposal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-text-primary dark:text-text-dark-primary">
                  Proposal Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Fund Carbon Capture Research"
                  required
                  className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-text-primary dark:text-text-dark-primary">
                  Short Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly explain your proposal (max 150 chars)"
                  maxLength={150}
                  required
                  className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary"
                />
              </div>
              <div>
                <Label htmlFor="details" className="text-text-primary dark:text-text-dark-primary">
                  Detailed Information
                </Label>
                <Textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide comprehensive details about your proposal, including goals, impact, and budget."
                  rows={6}
                  required
                  className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quorum" className="text-text-primary dark:text-text-dark-primary">
                    Quorum (CAFI Tokens)
                  </Label>
                  <Input
                    id="quorum"
                    type="number"
                    value={quorum}
                    onChange={(e) => setQuorum(Number(e.target.value))}
                    placeholder="e.g., 50000"
                    required
                    min="1"
                    className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="endTime" className="text-text-primary dark:text-text-dark-primary">
                    Voting End Time
                  </Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-soft-primary to-soft-secondary hover:from-soft-primary/90 hover:to-soft-secondary/90 text-white font-medium shadow-soft"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit Proposal
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
