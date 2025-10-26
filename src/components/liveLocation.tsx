import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";
import Image from "next/image";

const LiveLocation = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-[100%] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          <MapPin className="w-4 h-4 mr-2" />
          Track Live
        </Button>
      </DialogTrigger>

      <DialogContent>
        <p className="text-2xl font-bold text-center">Live Location of Bus</p>
        <div className="w-[90%] h-[90%] rounded-full mx-auto">
          <Image
            src="https://imgs.search.brave.com/HJm2QUzeKaMuMP0IDMwdzR6p2cptk_YY-AZv5buNNck/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9saDMu/Z29vZ2xldXNlcmNv/bnRlbnQuY29tL1ZL/RUl2dm9rWkhGazdT/dzFwTms5VkNoZ2tY/ek5fSno4b1lyNUpI/SUs0cWVIWnRDRHdE/VXV5X3FoNk80UzNR/YjJveUdlNmtCU3Zt/T3c1eGxEZ3Vlbmpl/RU5vc004VFRmRFVz/WnZJZVk9dzYwOQ"
            alt="logo"
            width={100}
            height={50}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LiveLocation;
