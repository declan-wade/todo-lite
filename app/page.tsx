"use client";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import Menu from "@/components/Menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ellipsis } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Calendar as CalendarIcon } from "lucide-react"
import { format, parseISO  } from "date-fns";
import { putTask, toggleTask, getTasks, deleteTask } from "./db";
import {
  saveObjectToCookie,
  getObjectFromCookie,
  clearCookie,
} from "../lib/cookieService";

export default function Home() {
  const [tasks, setTasks] = React.useState<any>([]);
  const [taskName, setTaskName] = React.useState("");
  const [showPin, setShowPin] = React.useState<any>(false);
  const [pin, setPin] = React.useState<any>(null);
  const [dueDate, setDueDate] = React.useState<Date | undefined>(new Date())

  async function handleDeleteData(id: number) {
    const response = await deleteTask(id);
    console.log(response);
    handleGetData();
  }

  async function handleAdd() {
    const response = await putTask(taskName, dueDate);
    console.log(response)
    if(response === "success"){handleGetData()}
  }

  async function handleCheck(id: number) {
    const index = tasks.findIndex((obj: any) => obj.id === id)
    tasks[index].complete = !tasks[index].complete
    const response = await toggleTask(id);
    console.log(response);
    handleGetData();
  }

  async function handleGetData() {
    const response: any = await getTasks();
    setTasks(response.rows);
  }

  React.useEffect(() => {
    handleGetData();
  }, []);

  React.useEffect(() => {
    const cookie = getObjectFromCookie("auth")
    if(cookie != true){
      setShowPin(true)
    }else{
    handleGetData();
    }
  }, []);

  React.useEffect(() => {
    console.log(pin)
    if(pin == 123456) {
      handleGetData();
      setShowPin(false)
      saveObjectToCookie(true, "auth")
    }
  },[pin])

  React.useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  return (
    <div>
      <Menu />
      <Dialog open={showPin}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unlock</DialogTitle>
            <DialogDescription>Enter PIN</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <div className="flex-child justify-evenly">
              <InputOTP
                maxLength={6}
                value={pin}
                data-lpignore="true"
                data-1p-ignore="true"
                onChange={(value) => setPin(value)}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} />
                    ))}{" "}
                  </InputOTPGroup>
                )}
              />
              <br></br>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="ms-3 mt-3 mb-3 me-3">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          My Tasks
        </h2>
        <br></br>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Add Task</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Add Task</h4>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Name:</Label>
              <Input
                id="maxWidth"
                defaultValue=""
                className="col-span-2 h-8"
                onChange={(e)=>setTaskName(e.target.value)}
              />
              <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !dueDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={dueDate}
          onSelect={setDueDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <Button onClick={handleAdd}>Add</Button>
            </div>
            </div>
          </PopoverContent>
        </Popover>
        <br></br>
        <br></br>
        <hr></hr>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Task</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length > 0 ? (
              tasks.map((task: any) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    <Checkbox checked={task.complete} onCheckedChange={()=> handleCheck(task.id) }/>
                  </TableCell>
                  <TableCell className={task.complete ? 'text-muted-foreground line-through ' : ''} style={{ textDecoration: task.complete ? 'line-through text-muted-foreground' : 'none' }}>{task.taskname}</TableCell>
                  <TableCell classNamw={task.complete ? 'text-muted-foreground line-through ' : ''}>{format((task.duedate), 'dd MMMM')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="me-4">
                      <Ellipsis className="ml-auto h-4 w-4 opacity-50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleDeleteData(task.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                        <Link href={`/${task.id}`} legacyBehavior passHref>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} style={{ textAlign: "center" }}>
                  No Tasks.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
