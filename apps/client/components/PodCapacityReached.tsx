"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowRight, Home, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export interface PodCapacityReachedProps {
  podName: string;
  description: string;
  membersList?: Array<{ name: string; initials: string; avatar?: string }>;
  members: number;
  maxMembers: number;
}

export function PodCapacityReached({
  podName,
  description,
  members = 10,
  maxMembers = 10,
  membersList = [
    { "avatar": "/monkey.jpg", "initials": "M", "name": "Monkey" },
    { "avatar": "/placeholder.jpg", "initials": "P", "name": "Shadcn" },
    { "avatar": "/owl.jpg", "initials": "O", "name": "Owl" }
  ],
}: PodCapacityReachedProps) {
  const router = useRouter();


  const handleReturnHome = () => {
    router.push("/dashboard");
  }

  // Get first 3 members for display
  const displayMembers = membersList.slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm">
              <div className="border-2 border-teal-light rounded-2xl bg-card/50 p-8 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex -space-x-3">
                    {displayMembers.length > 0 ? (
                      displayMembers.map((member, index) => (
                        <Avatar
                          key={index}
                          className="h-12 w-12 border-2 border-card ring-2 ring-teal-light"
                        >
                          {member.avatar && (
                            <AvatarImage
                              src={member.avatar}
                              alt={member.name}
                              className="object-cover"
                            />
                          )}
                          <AvatarFallback className="bg-sidebar-primary text-primary-foreground text-sm font-semibold">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                      ))
                    ) : (
                      // Fallback avatars
                      <>
                        {[
                          { initials: "U1" },
                          { initials: "U2" },
                          { initials: "U3" },
                        ].map((item, index) => (
                          <Avatar
                            key={index}
                            className="h-12 w-12 border-2 border-card ring-2 ring-teal-light"
                          >
                            <AvatarFallback className="bg-sidebar-primary text-primary-foreground text-sm font-semibold">
                              {item.initials}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-teal-light mb-2">
                      CAPACITY: 100%
                    </p>

                    <div className="w-48 h-8 bg-muted rounded-lg flex items-center justify-center border border-teal-light/30 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-r from-sidebar-primary to-teal-light flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">
                          100%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4">
                  <Badge
                    variant="destructive"
                    className="px-3 py-1 text-xs font-bold"
                  >
                    FULL
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-teal-light border-teal-light/50">
                POD FULL
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight font-maple">
                This pod is at{" "}
                <span className="text-teal-light">max capacity</span>
              </h1>
            </div>

            <div className="space-y-4 border-l-2 border-teal-light/30 pl-4">
              <div>
                <p className="text-teal-light font-semibold text-lg">
                  {podName}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                  {description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">
                    MEMBERS
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {members} / {maxMembers}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">
                    STATUS
                  </p>
                  <p className="text-2xl font-bold text-destructive">FULL</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={handleReturnHome}
                className="text-foreground hover:text-foreground bg-muted/50 hover:bg-muted h-11 gap-2"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            </div>

              <div className="flex gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20 mt-4">
                <AlertCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-accent">Pro tip:</span> Create your own pod and start inviting friends.
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
