import { StatCard } from "@/components/dashboard/star-card";
import UsersPage from "@/components/dashboard/user/userPage";

import { Users, DollarSign, Wrench, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="w-full h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's your business overview.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Users"
            value="1,234"
            icon={<Users className="h-5 w-5" />}
            description="+12% from last month"
          />
          <StatCard
            title="Total Revenue"
            value="$45,231"
            icon={<DollarSign className="h-5 w-5" />}
            description="+8% from last month"
          />
          <StatCard
            title="Total Maintenance"
            value="$8,450"
            icon={<Wrench className="h-5 w-5" />}
            description="+3% from last month"
          />
          <StatCard
            title="Active Buses"
            value="156"
            icon={<TrendingUp className="h-5 w-5" />}
            description="+5 new this week"
          />
        </div>

        {/* User Table */}
        <div>
          <UsersPage />
        </div>
      </div>
    </div>
  );
}
