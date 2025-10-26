import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import Image from "next/image";
import { Phone } from "lucide-react";

const DriverDetails = () => {
  return (
    <Dialog>
      <DialogTrigger className="">
        <Button variant="outline" className="w-[100%]  bg-transparent">
          <Phone className="w-4 h-4 mr-2" />
          Contact Driver
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="w-20 h-20 rounded-full mx-auto">
          <Image
            src="https://imgs.search.brave.com/Va59nOCLxzhYrxei6EnmhDuO-h9fj3EkEt6W-ZXY0hg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cy4x/MjNyZi5jb20vNDUw/d20vam92YW5tYW5k/aWMvam92YW5tYW5k/aWMyMzA2L2pvdmFu/bWFuZGljMjMwNjAw/MDAzLzIwNjAzNjkw/OC1wcm9mZXNzaW9u/YWwtZHJpdmVyLWRy/aXZpbmctYS10cnVj/ay1vbi10aGUtcm9h/ZC5qcGc_dmVyPTY"
            alt="logo"
            width={100}
            height={50}
            className="w-20 h-20 object-cover rounded-full"
          />
        </div>
        <div className="space-y-3 pb-4 border-b border-border  w-full">
          <p className="text-sm font-semibold text-foreground">Driver Name:</p>
          <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
            <p className="text-xs font-bold text-black"> Modna Mohon</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-6">
          <div className="space-y-3 pb-4 border-b border-border w-[47%]">
            <p className="text-sm font-semibold text-foreground">
              Phone Number:
            </p>
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
              <p className="text-xs font-bold text-black"> +88015678090 </p>
            </div>
          </div>
          <div className="space-y-3 pb-4 border-b border-border w-[47%]">
            <p className="text-sm font-semibold text-foreground">
              Blood Group:
            </p>
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
              <p className="text-xs font-bold text-black">AB+</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-6">
          <div className="space-y-3 pb-4 border-b border-border w-[47%]">
            <p className="text-sm font-semibold text-foreground">
              Driving Licence No:
            </p>
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
              <p className="text-xs font-bold text-black">4679403290897</p>
            </div>
          </div>
          <div className="space-y-3 pb-4 border-b border-border w-[47%]">
            <p className="text-sm font-semibold text-foreground">
              Licence Expire:
            </p>
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
              <p className="text-xs font-bold text-black">10/05/2027</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DriverDetails;
