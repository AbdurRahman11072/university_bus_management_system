"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Logo from "../../../../public/GUBLogo.svg";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  CircleUser,
  LayoutDashboard,
  HandCoins,
  BadgeDollarSign,
  Cog,
  LogOut,
  SearchIcon,
  MapPin,
  Clock,
  Users,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";

const menu = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Schedule",
    path: "/schedule",
  },
  {
    name: "Contact Us",
    path: "/contact-us",
  },
  {
    name: "Notice",
    path: "/notice",
  },
];

interface BusSearchResult {
  id: string;
  busNumber: string;
  busName: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  busImage?: string;
  busRoute?: string;
  startingPoint?: string;
  rating?: number;
}

const TopNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BusSearchResult[]>([]);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchError("Please enter a destination name");
      return;
    }

    setIsLoading(true);
    setSearchError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/bus/search/${encodeURIComponent(
          searchQuery
        )}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.data);
      setSearchResults(data.data);
      setIsSearchDialogOpen(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Failed to search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeSearchDialog = () => {
    setIsSearchDialogOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSearchError("");
  };

  const getBusImage = (bus: BusSearchResult) => {
    return bus.busImage || "/api/placeholder/300/200";
  };

  const formatTime = (time: string) => {
    return time; // You can add time formatting logic here
  };

  return (
    <>
      <nav className="w-full flex bg-white justify-between items-center p-4 border-b-[1px] border-slate-500/20 z-50">
        {/* ... (keep your existing navbar code exactly the same) ... */}
        <div className="flex gap-5 justify-center items-center">
          <div className="logo-container">
            <Image
              src={Logo}
              alt="logo"
              width={100}
              height={50}
              className="w-48 h-12 -ml-5 lg:ml-0"
              priority
            />
          </div>

          {/* Desktop search field */}
          <form onSubmit={handleSearch} className="hidden lg:block">
            <InputGroup className="rounded-3xl pl-2">
              <InputGroupInput
                placeholder="Search by destination..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <InputGroupAddon></InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="submit"
                  className="absolute top-1.5 right-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  ) : (
                    <SearchIcon />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </div>

        <div className="flex items-center gap-3 text-xl">
          <button
            onClick={() => setIsSearchDialogOpen(true)}
            className="lg:hidden"
          >
            <SearchIcon
              strokeWidth="2px"
              className="stroke-accent-foreground"
            />
          </button>

          <ul className="gap-4 hidden font-sans lg:flex">
            {menu.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="flex justify-center items-center gap-1 text-sm font-semibold"
              >
                {item.name}
              </Link>
            ))}
          </ul>

          <Link href={`/auth/login`}>
            <button
              className="px-1 py-1.5 rounded-sm w-18 h-9
                bg-accent hover:bg-primary-foreground hover:text-black hover:border-2 hover:border-accent text-sm text-primary-foreground font-bold"
            >
              Log in
            </button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="hidden lg:block">
              <CircleUser
                size={30}
                strokeWidth={1}
                className="stroke-accent-foreground"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-md border shadow-lg">
              <DropdownMenuLabel className="justify-center">
                <div className="justify-center items-center text-center">
                  <Image
                    src="https://imgs.search.brave.com/i3nbvjda_fdWRr5oZ7OKctN61jXv332ZzEL3kPFijOM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL3ByZW1p/dW0vcG5nLTI1Ni10/aHVtYi91c2VyLWlj/b24tc3ZnLWRvd25s/b2FkLXBuZy05NzUz/MTQ4LnBuZz9mPXdl/YnAmdz0xMjg"
                    alt="User image"
                    width={50}
                    height={50}
                    className="mx-auto"
                  />
                  <h3>Md. Abdur Rahmna</h3>
                  <h3>rjrahman019@gmail.com</h3>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <DropdownMenuItem className="group group-hover:text-gray-100">
                <LayoutDashboard className="text-black group-hover:text-gray-100" />
                <span className="group-hover:text-gray-100">Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="group group-hover:text-gray-100">
                <HandCoins className="text-black group-hover:text-gray-100" />{" "}
                <span className="group-hover:text-gray-100">Reward</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="group group-hover:text-gray-100 ">
                <BadgeDollarSign className="text-black group-hover:text-gray-100" />{" "}
                <span className="group-hover:text-gray-100">Transation</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="group group-hover:text-gray-100">
                <Cog className="text-black group-hover:text-gray-100" />{" "}
                <span className="group-hover:text-gray-100">Setting</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <DropdownMenuItem className="group group-hover:text-gray-100">
                <LogOut className="text-red-600 " />{" "}
                <span className="group-hover:text-gray-100">Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Improved Search Dialog */}
      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Search Buses
              </DialogTitle>
            </DialogHeader>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <InputGroup className="rounded-xl">
                  <InputGroupInput
                    placeholder="Enter destination (e.g., City Mall, Airport, Downtown)"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pr-12"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      ) : (
                        <SearchIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </form>
          </div>

          {/* Content */}
          <div className="p-6">
            {searchError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-center">{searchError}</p>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">
                    Found {searchResults.length} buses to{" "}
                    <span className="font-semibold">"{searchQuery}"</span>
                  </p>
                </div>

                {searchResults.map((bus: any) => (
                  <div
                    key={bus.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Bus Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={bus.busImg}
                            alt={bus.busName}
                            width={80}
                            height={80}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Bus Details */}
                      <div className="flex-1 min-w-0">
                        {/* Bus Name and Rating */}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg truncate">
                              {bus.busName || bus.busNumber}
                            </h3>
                          </div>
                        </div>

                        {/* Route */}
                        <div className="mb-3">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">
                              Destinations
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {bus.busDestination.map(
                                (dest: string, i: number) => (
                                  <span
                                    key={i}
                                    className="text-xs bg-secondary/30 text-foreground px-2 py-1 rounded"
                                  >
                                    {dest}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/*   View Details */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        href={`/schedule/${bus.busRoute}`}
                        onClick={() => setIsSearchDialogOpen(false)}
                      >
                        <Button className="w-full bg-accent text-white font-semibold py-2.5 rounded-lg">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isLoading &&
              !searchError && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <SearchIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Search for buses
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Enter a destination above to find available buses, routes,
                    and schedules.
                  </p>
                </div>
              )
            )}
          </div>

          {/* Footer */}
          {searchResults.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {searchResults.length} results
                </p>
                <Button
                  variant="outline"
                  onClick={closeSearchDialog}
                  className="border-gray-300 text-gray-700 hover:bg-white"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TopNavbar;
