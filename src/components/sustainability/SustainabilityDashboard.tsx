import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowUpRight, Leaf, TreePine, Droplets, Wind } from "lucide-react";

const carbonData = [
  { name: "Jan", amount: 120 },
  { name: "Feb", amount: 145 },
  { name: "Mar", amount: 170 },
  { name: "Apr", amount: 190 },
  { name: "May", amount: 220 },
  { name: "Jun", amount: 250 },
];

// Define colors for each month
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444'];

const SustainabilityDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Sustainability Dashboard
          </h1>
          <p className="text-gray-500">
            Track your environmental impact and contribution to sustainability
            goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Carbon Offset</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">24.8 tons</CardTitle>
                <Leaf className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+2.4% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Trees Planted</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">1,248</CardTitle>
                <TreePine className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Water Conserved</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">128,500 gal</CardTitle>
                <Droplets className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-blue-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+5.7% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Clean Energy Generated</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">45.2 MWh</CardTitle>
                <Wind className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-yellow-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>+8.3% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Carbon Offset Progress</CardTitle>
              <CardDescription>Monthly carbon offset in tons</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={carbonData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impact Distribution</CardTitle>
              <CardDescription>
                Breakdown of monthly carbon offset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={carbonData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="amount"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {carbonData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sustainability Goals</CardTitle>
            <CardDescription>
              Track your progress towards sustainability targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="yearly">
              <TabsList className="mb-4">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
              <TabsContent value="monthly" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Carbon Neutrality
                    </span>
                    <span className="text-sm text-gray-500">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Renewable Energy Usage
                    </span>
                    <span className="text-sm text-gray-500">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Waste Reduction</span>
                    <span className="text-sm text-gray-500">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </TabsContent>
              <TabsContent value="quarterly" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Carbon Neutrality
                    </span>
                    <span className="text-sm text-gray-500">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Renewable Energy Usage
                    </span>
                    <span className="text-sm text-gray-500">58%</span>
                  </div>
                  <Progress value={58} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Waste Reduction</span>
                    <span className="text-sm text-gray-500">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </TabsContent>
              <TabsContent value="yearly" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Carbon Neutrality
                    </span>
                    <span className="text-sm text-gray-500">80%</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Renewable Energy Usage
                    </span>
                    <span className="text-sm text-gray-500">70%</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Waste Reduction</span>
                    <span className="text-sm text-gray-500">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SustainabilityDashboard;