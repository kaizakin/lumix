import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"

export const PodSidebarSchedule = () => {

    const schedule = [
        {
            id: "1",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
        {
            id: "2",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
        {
            id: "3",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
        {
            id: "4",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
        {
            id: "5",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
        {
            id: "6",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
        {
            id: "7",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
        {
            id: "8",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
        {
            id: "9",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
        {
            id: "10",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
        {
            id: "11",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
        {
            id: "12",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
        {
            id: "13",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
        {
            id: "14",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
        {
            id: "15",
            task: "design review",
            date: "17/6/2025",
            time: "3.00 pm"
        },
    ]

    return <div className="flex flex-col h-full">
        <div className="flex flex-col items-center justify-center mt-2">
            <h1 className="text-md font-semibold text-foreground">Schedule Planner</h1>
            <h3 className="text-sm text-muted-foreground">Upcoming sessions and deadlines</h3>
        </div>
        <ScrollArea className="overflow-auto scrollbar-custom-thin h-full">
            {schedule.map(s => (
                <Card key={s.id} className="my-2 p-3">
                    <div className="flex space-x-3 items-center ">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <div className="space-y-1">
                            <div className="text-sm font-semibold">
                                {s.task}
                            </div>
                            <div className="text-xs flex gap-2">
                                <span>
                                    {s.date}
                                </span>
                                <span>
                                    {s.time}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </ScrollArea>
        <Button variant="outline" className="flex mt-3 hover:bg-green-500/50 dark:hover:bg-green-500/50 cursor-pointer">
            <Plus />
            Add event
        </Button>
    </div>
}