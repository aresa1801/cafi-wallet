"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Plus, Minus, CheckCircle } from "lucide-react"
import { PageHeader } from "./page-header"

interface CreateProposalProps {
  onBack: () => void
}

export function CreateProposal({ onBack }: CreateProposalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    fundingGoal: "",
    timeline: "",
    carbonImpact: "",
    problem: "",
    solution: "",
    impact: "",
  })
  const [teamMembers, setTeamMembers] = useState([""])
  const [milestones, setMilestones] = useState([{ title: "", date: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTeamMember = () => {
    setTeamMembers((prev) => [...prev, ""])
  }

  const removeTeamMember = (index: number) => {
    setTeamMembers((prev) => prev.filter((_, i) => i !== index))
  }

  const updateTeamMember = (index: number, value: string) => {
    setTeamMembers((prev) => prev.map((member, i) => (i === index ? value : member)))
  }

  const addMilestone = () => {
    setMilestones((prev) => [...prev, { title: "", date: "" }])
  }

  const removeMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index))
  }

  const updateMilestone = (index: number, field: string, value: string) => {
    setMilestones((prev) => prev.map((milestone, i) => (i === index ? { ...milestone, [field]: value } : milestone)))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate proposal submission
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsSubmitting(false)
    setSubmitted(true)

    setTimeout(() => {
      onBack()
    }, 3000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary flex items-center justify-center p-4">
        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 w-full max-w-md shadow-soft-lg">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-soft-primary to-soft-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-soft-glow shadow-soft">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
              Proposal Submitted!
            </h3>
            <p className="text-text-secondary dark:text-text-dark-secondary mb-4">
              Your green project proposal has been submitted to the DAO for community review and voting.
            </p>
            <p className="text-sm text-soft-primary">Redirecting to proposals...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-bg-dark dark:to-bg-dark-secondary">
      {/* Header with Back Button */}
      <PageHeader title="Create Proposal" subtitle="Submit a new green project initiative" onBack={onBack} />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Basic Information */}
        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
          <CardHeader>
            <CardTitle className="text-text-primary dark:text-text-dark-primary">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                  Project Title
                </label>
                <Input
                  placeholder="Enter project title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                  Category
                </label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-bg-dark-secondary border-neutral-200 dark:border-neutral-700">
                    <SelectItem value="renewable">⚡ Renewable Energy</SelectItem>
                    <SelectItem value="reforestation">🌳 Reforestation</SelectItem>
                    <SelectItem value="ocean">🌊 Ocean Conservation</SelectItem>
                    <SelectItem value="technology">🔬 Green Technology</SelectItem>
                    <SelectItem value="community">🏘️ Community Initiative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                Description
              </label>
              <Textarea
                placeholder="Brief description of your project"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                  Location
                </label>
                <Input
                  placeholder="Project location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                  Funding Goal (USD)
                </label>
                <Input
                  type="number"
                  placeholder="1000000"
                  value={formData.fundingGoal}
                  onChange={(e) => handleInputChange("fundingGoal", e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                  Timeline
                </label>
                <Input
                  placeholder="12 months"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange("timeline", e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                Carbon Impact (tons CO₂)
              </label>
              <Input
                type="number"
                placeholder="50000"
                value={formData.carbonImpact}
                onChange={(e) => handleInputChange("carbonImpact", e.target.value)}
                className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
          <CardHeader>
            <CardTitle className="text-text-primary dark:text-text-dark-primary">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                Problem Statement
              </label>
              <Textarea
                placeholder="Describe the environmental problem your project addresses"
                value={formData.problem}
                onChange={(e) => handleInputChange("problem", e.target.value)}
                className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                Proposed Solution
              </label>
              <Textarea
                placeholder="Explain your solution and approach"
                value={formData.solution}
                onChange={(e) => handleInputChange("solution", e.target.value)}
                className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-2">
                Environmental Impact
              </label>
              <Textarea
                placeholder="Detail the expected environmental benefits"
                value={formData.impact}
                onChange={(e) => handleInputChange("impact", e.target.value)}
                className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-text-primary dark:text-text-dark-primary">Team Members</CardTitle>
              <Button
                onClick={addTeamMember}
                size="sm"
                className="bg-soft-primary hover:bg-soft-primary/80 text-white shadow-soft"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Member
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Input
                  placeholder="Team member name"
                  value={member}
                  onChange={(e) => updateTeamMember(index, e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary"
                />
                {teamMembers.length > 1 && (
                  <Button
                    onClick={() => removeTeamMember(index)}
                    size="sm"
                    variant="outline"
                    className="border-soft-error/30 text-soft-error hover:bg-soft-error/10 hover:border-soft-error/50"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-text-primary dark:text-text-dark-primary">Project Milestones</CardTitle>
              <Button
                onClick={addMilestone}
                size="sm"
                className="bg-soft-accent hover:bg-soft-accent/80 text-white shadow-soft"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Milestone
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Input
                  placeholder="Milestone title"
                  value={milestone.title}
                  onChange={(e) => updateMilestone(index, "title", e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary flex-1"
                />
                <Input
                  type="date"
                  value={milestone.date}
                  onChange={(e) => updateMilestone(index, "date", e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-text-primary dark:text-text-dark-primary w-40"
                />
                {milestones.length > 1 && (
                  <Button
                    onClick={() => removeMilestone(index)}
                    size="sm"
                    variant="outline"
                    className="border-soft-error/30 text-soft-error hover:bg-soft-error/10 hover:border-soft-error/50"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Images Upload */}
        <Card className="bg-white/80 dark:bg-bg-dark-secondary/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-soft-lg">
          <CardHeader>
            <CardTitle className="text-text-primary dark:text-text-dark-primary">Project Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-soft-accent/30 rounded-xl p-8 text-center cursor-pointer hover:bg-soft-accent/5 hover:border-soft-accent/50 transition-colors">
              <Upload className="w-12 h-12 text-soft-accent mx-auto mb-4" />
              <p className="text-text-primary dark:text-text-dark-primary font-semibold mb-2">Upload Project Images</p>
              <p className="text-text-secondary dark:text-text-dark-secondary text-sm">
                Click to select images or drag and drop
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-neutral-300 dark:border-neutral-600 text-text-secondary dark:text-text-dark-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.description || !formData.category || isSubmitting}
            className="bg-gradient-to-r from-soft-primary to-soft-secondary hover:from-soft-secondary hover:to-soft-primary text-white font-semibold px-8 shadow-soft"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Proposal"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
