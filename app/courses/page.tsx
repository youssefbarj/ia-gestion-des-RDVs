import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, BookOpen, Users, Star, Clock, Home, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function CoursesPage() {
  const courses = [
    {
      id: "mathematics",
      title: "Mathematics",
      description:
        "Master algebra, calculus, geometry, and statistics with comprehensive explanations and practice problems.",
      icon: "📊",
      students: 1250,
      rating: 4.8,
      lessons: 45,
      duration: "6-8 weeks",
      level: "Beginner to Advanced",
      progress: 78,
      topics: ["Algebra", "Calculus", "Geometry", "Statistics", "Trigonometry"],
    },
    {
      id: "physics",
      title: "Physics",
      description: "Explore the fundamental laws of nature through mechanics, thermodynamics, and quantum physics.",
      icon: "⚛️",
      students: 890,
      rating: 4.7,
      lessons: 38,
      duration: "5-7 weeks",
      level: "Intermediate",
      progress: 65,
      topics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Quantum Physics", "Optics"],
    },
    {
      id: "chemistry",
      title: "Chemistry",
      description: "Understand chemical reactions, molecular structures, and the periodic table in depth.",
      icon: "🧪",
      students: 750,
      rating: 4.9,
      lessons: 42,
      duration: "6-8 weeks",
      level: "Beginner to Advanced",
      progress: 82,
      topics: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Biochemistry"],
    },
    {
      id: "biology",
      title: "Biology",
      description: "Discover the wonders of life through cell biology, genetics, evolution, and ecology.",
      icon: "🧬",
      students: 680,
      rating: 4.6,
      lessons: 36,
      duration: "5-6 weeks",
      level: "Beginner to Intermediate",
      progress: 45,
      topics: ["Cell Biology", "Genetics", "Evolution", "Ecology", "Human Biology"],
    },
    {
      id: "computer-science",
      title: "Computer Science",
      description: "Learn programming fundamentals, algorithms, data structures, and software development.",
      icon: "💻",
      students: 1100,
      rating: 4.8,
      lessons: 50,
      duration: "8-10 weeks",
      level: "Beginner to Advanced",
      progress: 90,
      topics: ["Programming", "Algorithms", "Data Structures", "Software Engineering", "AI/ML"],
    },
    {
      id: "literature",
      title: "Literature",
      description: "Analyze classic and modern literature, improve writing skills, and explore literary themes.",
      icon: "📚",
      students: 520,
      rating: 4.5,
      lessons: 28,
      duration: "4-6 weeks",
      level: "All Levels",
      progress: 55,
      topics: ["Classic Literature", "Modern Literature", "Poetry", "Creative Writing", "Literary Analysis"],
    },
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
                <h1 className="text-xl font-bold text-gray-900">Courses</h1>
                <p className="text-sm text-gray-500">Choose your learning path</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Courses</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our comprehensive selection of subjects. Each course is designed to provide personalized
            tutoring with our AI assistant.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{course.icon}</div>
                    <div>
                      <CardTitle className="text-2xl">{course.title}</CardTitle>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">{course.students.toLocaleString()} students</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <CardDescription className="text-base mt-3">{course.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{course.duration}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm text-gray-500">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                {/* Topics */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <Link href={`/chat?course=${course.id}`} className="flex-1">
                    <Button className="w-full">Start Learning</Button>
                  </Link>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of students who are already improving their grades with our AI tutor. Get personalized help,
            instant feedback, and study at your own pace.
          </p>
          <Link href="/chat">
            <Button size="lg">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Your First Session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
