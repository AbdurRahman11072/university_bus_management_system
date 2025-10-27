import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserTypes } from "@/lib/userType";

interface ProfileCardProps {
  user: UserTypes;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Teacher":
        return "bg-accent/10 text-accent border-accent/20";
      case "Driver":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-secondary/10 text-secondary border-secondary/20";
    }
  };

  const getBloodGroupColor = (bloodGroup: string) => {
    if (bloodGroup.includes("O")) return "bg-red-100 text-red-700";
    if (bloodGroup.includes("A")) return "bg-blue-100 text-blue-700";
    if (bloodGroup.includes("B")) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-t-4 border-t-primary overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary border-2 border-primary/20">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url || "/placeholder.svg"}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl text-foreground">
                {user.username}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {user.uId}
              </CardDescription>
              <div className="flex gap-2 mt-4">
                <Badge className={`${getRoleColor(user.roles)} border`}>
                  {user.roles}
                </Badge>
                <Badge
                  className={`${getBloodGroupColor(user.bloodGroup)} border`}
                >
                  {user.bloodGroup}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">User Id</p>
              <p className="text-foreground font-medium break-all">
                {user.uId}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
              <p className="text-foreground font-medium">
                {user.phone_number || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">User ID</p>
              <p className="text-foreground font-medium">{user.uId}</p>
            </div>
          </CardContent>
        </Card>

        {/* Health Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Health Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Blood Group</p>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${getBloodGroupColor(
                    user.bloodGroup
                  )} border text-base px-3 py-1`}
                >
                  {user.bloodGroup}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Role</p>
              <Badge className={`${getRoleColor(user.roles)} border`}>
                {user.roles}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver Information (if applicable) */}
      {user.roles === "Driver" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Driver Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Driver License
              </p>
              <p className="text-foreground font-medium">
                {user?.driverLicence || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                License Expiry
              </p>
              <p className="text-foreground font-medium">
                {user.licenceExpire
                  ? new Date(user.licenceExpire).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not provided"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
