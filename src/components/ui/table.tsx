import React from "react";
import { cn } from "@/lib/utils";

// Root table component
const Root = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    size?: "1" | "2" | "3";
    variant?: "surface" | "ghost";
    layout?: "auto" | "fixed";
  }
>(({ className, size = "2", variant = "ghost", layout, ...props }, ref) => {
  return (
    <div className="w-full overflow-auto">
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom",
          size === "1" && "text-sm",
          size === "2" && "text-base",
          size === "3" && "text-lg",
          variant === "surface" && "border bg-card shadow-sm",
          layout === "fixed" && "table-fixed",
          className
        )}
        {...props}
      />
    </div>
  );
});
Root.displayName = "Table";

// Header component
const Header = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-muted/50", className)} {...props} />
));
Header.displayName = "TableHeader";

// Body component
const Body = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
Body.displayName = "TableBody";

// Row component
const Row = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    align?: "start" | "center" | "end" | "baseline";
  }
>(({ className, align, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      align === "start" && "align-top",
      align === "center" && "align-middle",
      align === "end" && "align-bottom",
      align === "baseline" && "align-baseline",
      className
    )}
    {...props}
  />
));
Row.displayName = "TableRow";

// Cell props type
type CellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  justify?: "start" | "center" | "end";
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  p?: string;
  px?: string;
  py?: string;
  pt?: string;
  pr?: string;
  pb?: string;
  pl?: string;
};

// Cell component
const Cell = React.forwardRef<HTMLTableCellElement, CellProps>(
  ({ className, justify = "start", style, ...props }, ref) => {
    const cellStyle: React.CSSProperties = {
      ...style,
      textAlign: justify === "start" ? "left" : justify === "center" ? "center" : "right",
      width: props.width,
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
      padding: props.p,
      paddingTop: props.pt,
      paddingRight: props.pr,
      paddingBottom: props.pb,
      paddingLeft: props.pl,
      paddingInline: props.px,
      paddingBlock: props.py,
    };

    // Remove custom props
    const { width, minWidth, maxWidth, p, px, py, pt, pr, pb, pl, ...rest } = props;

    return (
      <td
        ref={ref}
        className={cn("p-3", className)}
        style={cellStyle}
        {...rest}
      />
    );
  }
);
Cell.displayName = "TableCell";

// Column header cell component
const ColumnHeaderCell = React.forwardRef<HTMLTableCellElement, CellProps>(
  ({ className, justify = "start", style, ...props }, ref) => {
    const cellStyle: React.CSSProperties = {
      ...style,
      textAlign: justify === "start" ? "left" : justify === "center" ? "center" : "right",
      width: props.width,
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
      padding: props.p,
      paddingTop: props.pt,
      paddingRight: props.pr,
      paddingBottom: props.pb,
      paddingLeft: props.pl,
      paddingInline: props.px,
      paddingBlock: props.py,
    };

    // Remove custom props
    const { width, minWidth, maxWidth, p, px, py, pt, pr, pb, pl, ...rest } = props;

    return (
      <th
        ref={ref}
        className={cn(
          "p-3 text-left align-middle font-medium text-muted-foreground",
          className
        )}
        style={cellStyle}
        {...rest}
      />
    );
  }
);
ColumnHeaderCell.displayName = "TableColumnHeaderCell";

// Row header cell component
const RowHeaderCell = React.forwardRef<HTMLTableCellElement, CellProps>(
  ({ className, justify = "start", style, ...props }, ref) => {
    const cellStyle: React.CSSProperties = {
      ...style,
      textAlign: justify === "start" ? "left" : justify === "center" ? "center" : "right",
      width: props.width,
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
      padding: props.p,
      paddingTop: props.pt,
      paddingRight: props.pr,
      paddingBottom: props.pb,
      paddingLeft: props.pl,
      paddingInline: props.px,
      paddingBlock: props.py,
    };

    // Remove custom props
    const { width, minWidth, maxWidth, p, px, py, pt, pr, pb, pl, ...rest } = props;

    return (
      <th
        ref={ref}
        className={cn(
          "p-3 text-left align-middle font-medium",
          className
        )}
        style={cellStyle}
        {...rest}
      />
    );
  }
);
RowHeaderCell.displayName = "TableRowHeaderCell";

export const Table = {
  Root,
  Header,
  Body,
  Row,
  Cell,
  ColumnHeaderCell,
  RowHeaderCell,
};
