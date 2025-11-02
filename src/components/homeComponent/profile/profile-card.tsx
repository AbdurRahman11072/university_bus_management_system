// profile-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTypes } from "@/lib/userType";

interface ProfileCardProps {
  user: UserTypes;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Username:</span>
            <span className="font-medium">{user.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role:</span>
            <span className="font-medium capitalize">
              {user.roles.toLowerCase()}
            </span>
          </div>
          {/* Add other user fields as needed */}
        </div>
      </CardContent>
    </Card>
  );
}
