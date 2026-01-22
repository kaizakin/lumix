import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Using type instead of interface to avoid ESLint warning
type ChatInputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null)

    const setRefs = (el: HTMLTextAreaElement) => {
      innerRef.current = el
      if (typeof ref === "function") ref(el)
      else if (ref) ref.current = el
    }

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const el = innerRef.current
      if (!el) return

      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }

    return <Textarea
      autoComplete="off"
      rows={1}
      ref={setRefs}
      onInput={handleInput}
      name="message"
      className={cn(
        "px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center max-h-40 resize-none overflow-auto",
        className,
      )}
      {...props}
    />
  },
);
ChatInput.displayName = "ChatInput";

export { ChatInput };