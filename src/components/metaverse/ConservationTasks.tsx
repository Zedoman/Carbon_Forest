import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Leaf,
  Droplets,
  Wind,
  Bug,
  Award,
  Clock,
  ChevronRight,
} from "lucide-react";

interface ConservationTask {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  reward: {
    type: "token" | "yield" | "impact";
    amount: number;
    unit: string;
  };
  progress: number;
  timeRequired: string;
  icon: React.ReactNode;
  status: "available" | "in-progress" | "completed";
}

interface ConservationTasksProps {
  tasks?: ConservationTask[];
  onTaskSelect?: (taskId: string) => void;
  onTaskComplete?: (taskId: string) => void;
}

const ConservationTasks = ({
  tasks = defaultTasks,
  onTaskSelect = () => {},
  onTaskComplete = () => {},
}: ConservationTasksProps) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    onTaskSelect(taskId);
  };

  const handleTaskComplete = (taskId: string) => {
    onTaskComplete(taskId);
  };

  const selectedTask =
    tasks.find((task) => task.id === selectedTaskId) || tasks[0];

  return (
    <div className="h-full flex flex-col bg-background border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <h2 className="text-lg font-semibold">Conservation Tasks</h2>
        <p className="text-sm text-muted-foreground">
          Complete tasks to earn rewards and boost your forest's health
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`mb-2 p-3 border rounded-md cursor-pointer transition-colors ${selectedTaskId === task.id ? "bg-accent border-primary" : "hover:bg-accent/50"}`}
            onClick={() => handleTaskSelect(task.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  {task.icon}
                </div>
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        task.status === "completed" ? "secondary" : "outline"
                      }
                      className="text-xs"
                    >
                      {task.status === "available"
                        ? "Available"
                        : task.status === "in-progress"
                          ? "In Progress"
                          : "Completed"}
                    </Badge>
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.timeRequired}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant={getDifficultyVariant(task.difficulty)}>
                {task.difficulty}
              </Badge>
            </div>
            {task.status === "in-progress" && (
              <div className="mt-2">
                <Progress value={task.progress} className="h-1" />
                <span className="text-xs text-muted-foreground mt-1 block">
                  {task.progress}% complete
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedTask && (
        <div className="p-4 border-t bg-card">
          <h3 className="font-semibold mb-2">{selectedTask.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {selectedTask.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">
                      {selectedTask.reward.amount} {selectedTask.reward.unit}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reward for completing this task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="text-sm text-muted-foreground">
              Difficulty: {selectedTask.difficulty}
            </span>
          </div>

          {selectedTask.status === "available" && (
            <Button
              className="w-full"
              onClick={() => handleTaskComplete(selectedTask.id)}
            >
              Start Task <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {selectedTask.status === "in-progress" && (
            <Button
              className="w-full"
              onClick={() => handleTaskComplete(selectedTask.id)}
            >
              Complete Task ({selectedTask.progress}%)
            </Button>
          )}

          {selectedTask.status === "completed" && (
            <Button variant="secondary" className="w-full" disabled>
              Task Completed
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

const getDifficultyVariant = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "secondary";
    case "medium":
      return "default";
    case "hard":
      return "destructive";
    default:
      return "outline";
  }
};

const defaultTasks: ConservationTask[] = [
  {
    id: "1",
    title: "Plant Virtual Seedlings",
    description:
      "Plant 10 virtual seedlings in your forest plot. This activity represents real seedlings being planted by our conservation partners.",
    difficulty: "easy",
    reward: {
      type: "token",
      amount: 5,
      unit: "Carbon Tokens",
    },
    progress: 100,
    timeRequired: "5 min",
    icon: <Leaf className="h-4 w-4" />,
    status: "completed",
  },
  {
    id: "2",
    title: "Implement Irrigation System",
    description:
      "Set up a virtual irrigation system to improve water efficiency in your forest plot, representing real-world water conservation efforts.",
    difficulty: "medium",
    reward: {
      type: "yield",
      amount: 2.5,
      unit: "% Yield Boost",
    },
    progress: 60,
    timeRequired: "15 min",
    icon: <Droplets className="h-4 w-4" />,
    status: "in-progress",
  },
  {
    id: "3",
    title: "Create Windbreak Barriers",
    description:
      "Design and place windbreak barriers to protect your forest from strong winds and erosion, mirroring actual conservation techniques.",
    difficulty: "medium",
    reward: {
      type: "impact",
      amount: 10,
      unit: "Impact Points",
    },
    progress: 0,
    timeRequired: "10 min",
    icon: <Wind className="h-4 w-4" />,
    status: "available",
  },
  {
    id: "4",
    title: "Introduce Beneficial Insects",
    description:
      "Release virtual beneficial insects into your forest ecosystem to control pests naturally, representing real biodiversity enhancement.",
    difficulty: "hard",
    reward: {
      type: "token",
      amount: 15,
      unit: "Carbon Tokens",
    },
    progress: 0,
    timeRequired: "20 min",
    icon: <Bug className="h-4 w-4" />,
    status: "available",
  },
];

export default ConservationTasks;
