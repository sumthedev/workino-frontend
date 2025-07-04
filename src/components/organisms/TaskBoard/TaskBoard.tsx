"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Clock, CheckCircle2, Circle, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import api from "@/api/auth"
import { toast } from "sonner"

interface TaskBoardProps {
  team: any
  project: any
  workspace: any
  usageMode: "ALONE" | "TEAM"
  onBack: () => void
}

interface Task {
  id: string
  title: string
  description?: string
  status: "TODO" | "PENDING" | "DONE"
  priority: "LOW" | "NORMAL" | "HIGH" | "CRITICAL"
  assignedTo?: { id: string; name: string; email: string }
  createdBy: { id: string; name: string; email: string }
  createdAt: string
}

interface TeamMember {
  id: string, 
  fullName: string,
  email: string,
  role: string
}


export function TaskBoard({ team, project, workspace, usageMode, onBack }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "NORMAL" as Task["priority"],
    assignedToId: "unassigned",
  })
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return

    setIsCreating(true)

    try {
      const payload = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        assignedToId: newTask.assignedToId === "unassigned" ? undefined : newTask.assignedToId,
        teamId: team.id
      }

      const token = localStorage.getItem("token")

      const response = await api.post("/task/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Add the new task to the local state
      const newTaskData: Task = {
        id: response.data.task.id,
        title: response.data.task.title,
        description: response.data.task.description,
        status: "TODO",
        priority: response.data.task.priority,
        assignedTo: response.data.task.assignedTo,
        createdBy: response.data.task.createdBy,
        createdAt: response.data.task.createdAt,
      }

      setTasks([...tasks, newTaskData])
      setNewTask({ title: "", description: "", priority: "NORMAL" as Task["priority"], assignedToId: "unassigned" })
      setShowCreateDialog(false)
      toast.success("Task created successfully!")
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Failed to create task")
    } finally {
      setIsCreating(false)
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    try {
      const token = localStorage.getItem("token")
      await api.put(`/task/update/${taskId}`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
      toast.success("Task status updated!")
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Failed to update task")
    }
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "TODO":
        return <Circle className="w-4 h-4" />
      case "PENDING":
        return <Clock className="w-4 h-4" />
      case "DONE":
        return <CheckCircle2 className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "LOW":
        return "bg-blue-100 text-blue-800"
      case "NORMAL":
        return "bg-gray-100 text-gray-800"
      case "HIGH":
        return "bg-orange-100 text-orange-800"
      case "CRITICAL":
        return "bg-red-100 text-red-800"
    }
  }

  const handleInvite = () => {
    router.push("/invite")
  }

  const tasksByStatus = {
    TODO: tasks.filter((task) => task.status === "TODO"),
    PENDING: tasks.filter((task) => task.status === "PENDING"),
    DONE: tasks.filter((task) => task.status === "DONE"),
  }

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get(`/task/${team.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setTasks(response.data)
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Failed to fetch tasks")
    }
  }

  const fetchTeamMembers = async () => {
    try {
        const token = localStorage.getItem("token");

      const response = await api.get("/team/members", {
        params: { teamId : team.id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const members = response.data.members || [];
      setMembers(members);

    } catch (err : any) {
      toast.error(err.response?.data?.msg )
    }
  }

  useEffect(() => {
    fetchTeamMembers()
    fetchTasks()
  }, [team.id])

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{team.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {project.name} • {workspace.name} • {tasks.length} tasks
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {usageMode === "TEAM" && (
                <Button variant="outline" size="sm" onClick={handleInvite}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Members
                </Button>
              )}
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>Add a new task to {team.name}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-title">Title</Label>
                      <Input
                        id="task-title"
                        placeholder="Enter task title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-description">Description</Label>
                      <Textarea
                        id="task-description"
                        placeholder="Enter task description (optional)"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value: Task["priority"]) => setNewTask({ ...newTask, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="NORMAL">Normal</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="CRITICAL">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {usageMode === "TEAM" && (
                      <div className="space-y-2">
                        <Label>Assign To</Label>
                        <Select
                          value={newTask.assignedToId}
                          onValueChange={(value) => setNewTask({ ...newTask, assignedToId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select team member" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {members.map((member) => (
                              <SelectItem key={member.id} value={member.id}>{member.fullName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTask} disabled={!newTask.title.trim() || isCreating}>
                        {isCreating ? "Creating..." : "Create Task"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["TODO", "PENDING", "DONE"] as const).map((status) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(status)}
                <h3 className="font-semibold">
                  {status === "TODO" ? "To Do" : status === "PENDING" ? "In Progress" : "Done"}
                </h3>
                <Badge variant="secondary">{tasksByStatus[status].length}</Badge>
              </div>

              <div className="space-y-3">
                {tasksByStatus[status].map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                      </div>
                      {task.description && <CardDescription className="text-xs">{task.description}</CardDescription>}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          {task.assignedTo && <span>Assigned to {task.assignedTo.name}</span>}
                        </div>
                        <div className="flex space-x-1">
                          {status !== "TODO" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(task.id, "TODO")}
                              className="h-6 px-2 text-xs"
                            >
                              To Do
                            </Button>
                          )}
                          {status !== "PENDING" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(task.id, "PENDING")}
                              className="h-6 px-2 text-xs"
                            >
                              Progress
                            </Button>
                          )}
                          {status !== "DONE" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(task.id, "DONE")}
                              className="h-6 px-2 text-xs"
                            >
                              Done
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {tasksByStatus[status].length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No tasks in {status.toLowerCase()}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}