"use client";

import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableWidgetProps {
id: string;
children: ReactNode;
}

export default function SortableWidget({
id,
children,
}: SortableWidgetProps) {
const {
attributes,
listeners,
setNodeRef,
transform,
transition,
isDragging,
} = useSortable({ id });

const style = {
transform: CSS.Transform.toString(transform),
transition,
opacity: isDragging ? 0.5 : 1,
position: "relative" as const,
zIndex: isDragging ? 10 : 1,
};

return ( <div
   ref={setNodeRef}
   style={style}
   className="min-w-0"
 > <div className="mb-2 flex justify-end">
<button
type="button"
{...attributes}
{...listeners}
aria-label={`Drag ${id} widget`}
className="touch-none cursor-grab rounded-lg border border-white/10 bg-white/[0.03] p-2 text-slate-500 transition hover:bg-white/10 hover:text-white active:cursor-grabbing"
> <GripVertical size={17} /> </button> </div>


  {children}
</div>


);
}