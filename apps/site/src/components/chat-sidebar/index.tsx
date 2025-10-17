"use client"
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar"

const ChatSidebar = () => {
  const { open, toggleSidebar } = useSidebar()
  
  return (
    <div>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex justify-between">AI Agent
              <button className="sm:hidden" onClick={toggleSidebar}>
                <XIcon size={16} />
              </button>
            </SidebarGroupLabel>
            <SidebarGroupContent>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Toggle button for medium - large screens */}
      <button
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
        className="hidden sm:block sticky top-1/2 left-full -mr-5 z-40 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary-light shadow-lg cursor-pointer"
      >
        {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Toggle button for small screens */}
      <button
        aria-label="Toggle sidebar"
        onClick={toggleSidebar}
        className="block sm:hidden fixed top-1/2 z-40 bg-primary -ml-2 text-primary-foreground rounded-e-full py-2 pl-2 pr-1 hover:bg-primary-light shadow-lg cursor-pointer"
      >
        {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  )
}

export default ChatSidebar