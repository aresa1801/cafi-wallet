"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Award, Users, Target, Zap } from "lucide-react"

interface CarbonAnalyticsProps {
  carbonOffset: number
}

export function CarbonAnalytics({ carbonOffset }: CarbonAnalyticsProps) {
  const monthlyData = [
    { month: "Jan", offset: 0.8, color: "bg-carbon-primary" },
    { month: "Feb", offset: 1.2, color: "bg-carbon-accent" },
    { month: "Mar", offset: 2.1, color: "bg-carbon-purple" },
    { month: "Apr", offset: 1.9, color: "bg-carbon-orange" },
    { month: "May", offset: 2.3, color: "bg-carbon-pink" },
    { month: "Jun", offset: 4.2, color: "bg-carbon-primary" },
  ]

  const leaderboard = [
    { rank: 1, name: "EcoWarrior", offset: 45.2, badge: "🏆", color: "text-carbon-yellow" },
    { rank: 2, name: "GreenThumb", offset: 38.7, badge: "🥈", color: "text-gray-300" },
    { rank: 3, name: "ClimateHero", offset: 32.1, badge: "🥉", color: "text-carbon-orange" },
    { rank: 4, name: "You", offset: carbonOffset, badge: "🌱", color: "text-carbon-primary" },
    { rank: 5, name: "EcoFriend", offset: 8.9, badge: "🌿", color: "text-carbon-secondary" },
  ]

  const achievements = [
    {
      title: "First Offset",
      icon: "🌱",
      status: "unlocked",
      description: "Complete your first carbon offset",
      color: "bg-carbon-primary/10 border-carbon-primary/20",
    },
    {
      title: "Tree Planter",
      icon: "🌳",
      status: "unlocked",
      description: "Offset 10+ tons of CO₂",
      color: "bg-success/10 border-success/20",
    },
    {
      title: "Climate Hero",
      icon: "🏆",
      status: "locked",
      description: "Offset 50+ tons of CO₂",
      color: "bg-dark-surface border-dark-border",
    },
    {
      title: "Planet Saver",
      icon: "🌍",
      status: "locked",
      description: "Offset 100+ tons of CO₂",
      color: "bg-dark-surface border-dark-border",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Monthly Progress */}
      <Card className="bg-dark-card border-dark-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2 text-white">
            <TrendingUp className="w-6 h-6 text-carbon-primary" />
            <span>Monthly Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm font-semibold w-10 text-white">{data.month}</span>
                <div className="flex-1 mx-4">
                  <Progress value={(data.offset / 5) * 100} className="h-3 bg-dark-surface" />
                </div>
                <span className="text-sm text-carbon-accent font-semibold w-12 text-right">{data.offset}t</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-dark-card border-dark-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2 text-white">
            <Award className="w-6 h-6 text-carbon-yellow" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`text-center p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${achievement.color} ${
                  achievement.status === "unlocked" ? "cursor-pointer" : "opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-sm font-semibold text-white mb-1">{achievement.title}</p>
                <p className="text-xs text-dark-muted">{achievement.description}</p>
                {achievement.status === "unlocked" && (
                  <div className="mt-2">
                    <span className="text-xs bg-carbon-primary text-dark-bg px-2 py-1 rounded-full font-semibold">
                      Unlocked
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Leaderboard */}
      <Card className="bg-dark-card border-dark-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2 text-white">
            <Users className="w-6 h-6 text-carbon-purple" />
            <span>Community Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                  user.name === "You"
                    ? "bg-gradient-to-r from-carbon-primary/10 to-carbon-accent/10 border border-carbon-primary/20"
                    : "bg-dark-surface border border-dark-border"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{user.badge}</div>
                  <div>
                    <p className={`font-semibold ${user.name === "You" ? "text-carbon-primary" : "text-white"}`}>
                      {user.name}
                    </p>
                    <p className="text-xs text-dark-muted">#{user.rank} Global Rank</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-white">{user.offset}t</p>
                  <p className="text-xs text-carbon-accent">CO₂ offset</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-carbon-primary/10 to-carbon-secondary/10 border-carbon-primary/20">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-carbon-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">25%</p>
            <p className="text-xs text-carbon-primary">Goal Progress</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-carbon-accent/10 to-carbon-purple/10 border-carbon-accent/20">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-carbon-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">7</p>
            <p className="text-xs text-carbon-accent">Day Streak</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
