import { Card, CardContent } from "../ui/card";

export function MaintenancePage() {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Maintenance Tracking
          </h1>
          <p className="text-muted-foreground mt-1">
            Track bus repairs and maintenance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {["BUS-001", "BUS-002", "BUS-003"].map((bus) => (
            <Card key={bus} className="bg-white">
              <CardContent className="pt-6 space-y-3 ">
                <p className="font-semibold text-foreground">{bus}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Repairs (Month)
                    </span>
                    <span className="font-semibold text-foreground">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Service</span>
                    <span className="font-semibold text-foreground">
                      5 days ago
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition</span>
                    <span className="font-semibold text-primary">Good</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
