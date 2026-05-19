import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTrigger,
} from "./ui/popover";
import { SignOutIcon } from "@phosphor-icons/react";

export default function UserProfile() {
  return (
    <Popover>
      <PopoverTrigger>
        <Avatar size="sm">
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent align="end" className={"gap-0 p-1"}>
        <div className="flex items-center justify-betweeen w-full hover:bg-gray-300 p-1 py-1.5 rounded-sm cursor-pointer">
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start justify-start">
              <p className="text-sm">John Doe</p>
              <span className="text-sm -mt-1 opacity-60">
                jonhdoe@gmail.com
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-betweeen w-full hover:bg-red-300 text-red-500 text-center p-1 py-1.5 rounded-sm cursor-pointer">
          <div className="flex items-center justify-center gap-2 flex-1">
            <SignOutIcon className="size-5" />
            <PopoverDescription className={"text-center text-red-500"}>
              Logout
            </PopoverDescription>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
