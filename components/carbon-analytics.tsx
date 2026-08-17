"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Award, Users, Target, Zap, Lock } from "lucide-react"

interface CarbonAnalyticsProps {
  carbonOffset: number
}

export function CarbonAnalytics({ carbonOffset }: CarbonAnalyticsProps) {
  const monthlyData = [
    { month: "Jan", offset: 0.8, color: "bg-emerald-500" },
    { month: "Feb", offset: 1.2, color: "bg-teal-500" },
    { month: "Mar", offset: 2.1, color: "bg-lime-500" },
    { month: "Apr", offset: 1.9, color: "bg-emerald-400" },
    { month: "May", offset: 2.3, color: "bg-green-500" },
    { month: "Jun", offset: 4.2, color: "bg-emerald-500" },
  ]

  const leaderboard = [
    { rank: 1, name: "EcoWarrior", offset: 45.2, badge: "🏆", color: "text-yellow-400" },
    { rank: 2, name: "GreenThumb", offset: 38.7, badge: "🥈", color: "text-gray-300" },
    { rank: 3, name: "ClimateHero", offset: 32.1, badge: "🥉", color: "text-orange-400" },
    { rank: 4, name: "You", offset: carbonOffset, badge: "🌱", color: "text-emerald-400" },
    { rank: 5, name: "EcoFriend", offset: 8.9, badge: "🌿", color: "text-teal-300" },
  ]

  const achievements = [
    {
      title: "First Offset",
      icon: "🌱",
      status: "unlocked",
      description: "Complete your first carbon offset",
      color: "border-emerald-500/30 bg-emerald-500/10",
    },
    {
      title: "Tree Planter",
      icon: "🌳",
      status: "unlocked",
      description: "Offset 10+ tons of CO₂",
      color: "border-teal-500/30 bg-teal-500/10",
    },
    {
      title: "Climate Hero",
      icon: "🏆",
      status: "locked",
      description: "Offset 50+ tons of CO₂",
      color: "border-white/10 bg-white/5",
    },
    {
      title: "Planet Saver",
      icon: "🌍",
      status: "locked",
      description: "Offset 100+ tons of CO₂",
      color: "border-white/10 bg-white/5",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Monthly Progress */}
      <Card className="border border-white/10 bg-white/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Monthly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="w-10 text-sm font-semibold text-white">{data.month}</span>
                <div className="mx-4 flex-1">
                  <Progress value={(data.offset / 5) * 100} className="h-2.5 bg-white/10" />
                </div>
                <span className="w-12 text-right text-sm font-semibold text-emerald-300">{data.offset}t</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="border border-white/10 bg-white/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <Award className="h-5 w-5 text-yellow-400" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`rounded-xl border p-4 text-center transition hover:scale-105 ${achievement.color} ${
                  achievement.status === "locked" ? "opacity-60" : ""
                }`}
              >
                <div className="mb-2 text-3xl">{achievement.icon}</div>
                <p className="mb-1 text-sm font-semibold text-white">{achievement.title}</p>
                <p className="text-xs text-white/40">{achievement.description}</p>
                {achievement.status === "unlocked" && (
                  <span className="mt-2 inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    Unlocked
                  </span>
                )}
                {achievement.status === "locked" && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/40">
                    <Lock className="h-2.5 w-2.5" /> Locked
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Leaderboard */}
      <Card className="border border-white/10 bg-white/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <Users className="h-5 w-5 text-teal-400" />
            Community Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between rounded-xl p-3.5 transition hover:scale-[1.02] ${
                  user.name === "You"
                    ? "border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
                    : "border border-white/10 bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{user.badge}</div>
                  <div>
                    <p className={`text-sm font-semibold ${user.name === "You" ? "text-emerald-400" : "text-white"}`}>
                      {user.name}
                    </p>
                    <p className="text-xs text-white/40">#{user.rank} Global Rank</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{user.offset}t</p>
                  <p className="text-xs text-emerald-300">CO₂ offset</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <CardContent className="p-4 text-center">
            <Target className="mx-auto mb-2 h-7 w-7 text-emerald-400" />
            <p className="text-2xl font-bold text-white">25%</p>
            <p className="text-xs text-emerald-300">Goal Progress</p>
          </CardContent>
        </Card>
        <Card className="border border-teal-500/20 bg-gradient-to-br from-teal-500/10 to-transparent">
          <CardContent className="p-4 text-center">
            <Zap className="mx-auto mb-2 h-7 w-7 text-teal-300" />
            <p className="text-2xl font-bold text-white">7</p>
            <p className="text-xs text-teal-300">Day Streak</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
