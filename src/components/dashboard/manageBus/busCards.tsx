import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";

const BusCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {["BUS-001", "BUS-002", "BUS-003"].map((bus) => (
        <Card key={bus}>
          <CardContent className="pt-6">
            <p className="font-semibold text-foreground">{bus}</p>
            <p className="text-sm text-muted-foreground">Route 5A • 45 seats</p>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Edit
              </Button>
              <Button size="sm" variant="destructive" className="flex-1">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BusCards;
