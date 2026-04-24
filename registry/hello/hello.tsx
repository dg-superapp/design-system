import * as React from "react";

export interface HelloProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
}

export function Hello({ name = "world", className, ...props }: HelloProps) {
  return (
    <div
      className={["rounded-md border bg-background p-4 text-foreground", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <p className="text-sm">hello, {name} — dgc miniapp registry is live.</p>
    </div>
  );
}
