import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, BookOpen, Clock, TrendingUp, MessageCircle, Award, Home, Settings } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const recentSessions = [
    {
      id: 1,
      subject: "Mathematics",
      topic: "Calculus - Derivatives",
      duration: "25 min",
      questions: 8,
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      subject: "Physics",
      topic: "Quantum Mechanics",
      duration: "18 min",
      questions: 5,
      timestamp: "1 day ago",
    },
    {
      id: 3,
      subject: "Chemistry",
      topic: "Organic Reactions",
      duration: "32 min",
      questions: 12,
      timestamp: "2 days ago",
    },
  ]

  const courseProgress = [
    { subject: "Mathematics", progress: 78, totalLessons: 45, completed: 35 },
    { subject: "Physics", progress: 65, totalLessons: 38, completed: 25 },
    { subject: "Chemistry", progress: 82, totalLessons: 42, completed: 34 },
    { subject: "Biology", progress: 45, totalLessons: 36, completed: 16 },
    { subject: "Computer Science", progress: 90, totalLessons: 50, completed: 45 },
    { subject: "Literature", progress: 55, totalLessons: 28, completed: 15 },
  ]

  const achievements = [
    { title: "Quick Learner", description: "Completed 10 sessions in a week", icon: "🚀" },
    { title: "Math Wizard", description: "Mastered calculus concepts", icon: "🧮" },
    { title: "Curious Mind", description: "Asked 100+ questions", icon: "🤔" },
    { title: "Consistent Student", description: "7-day learning streak", icon: "🔥" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center cursor-pointer">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Track your learning progress</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+12 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42.5h</div>
              <p className="text-xs text-muted-foreground">+3.2h from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions Asked</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+89 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 new this week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Course Progress</span>
              </CardTitle>
              <CardDescription>Your progress across all subjects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseProgress.map((course) => (
                <div key={course.subject} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{course.subject}</span>
                    <span className="text-sm text-gray-500">
                      {course.completed}/{course.totalLessons} lessons
                    </span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <div className="text-right">
                    <Badge
                      variant={course.progress >= 80 ? "default" : course.progress >= 60 ? "secondary" : "outline"}
                    >
                      {course.progress}%
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Sessions</span>
              </CardTitle>
              <CardDescription>Your latest tutoring sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{session.subject}</div>
                    <div className="text-sm text-gray-600">{session.topic}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {session.duration} • {session.questions} questions • {session.timestamp}
                    </div>
                  </div>
                  <Link href={`/chat?course=${session.subject.toLowerCase()}`}>
                    <Button size="sm" variant="outline">
                      Continue
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Recent Achievements</span>
            </CardTitle>
            <CardDescription>Celebrate your learning milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg"
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{achievement.title}</div>
                    <div className="text-xs text-gray-600">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
