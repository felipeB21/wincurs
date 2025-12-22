import React from "react";

export default function RelatedContent() {
  return (
    <aside className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground">
        Related cursors
      </h3>

      <ul className="space-y-3">
        <li className="flex items-center gap-3">
          <img
            src="/cursor-preview.png"
            alt="Cursor preview"
            className="h-12 w-12 rounded-md object-cover"
          />
          <a href="#" className="text-sm hover:underline">
            Cursor name
          </a>
        </li>

        {/* repeat for more items */}
      </ul>
    </aside>
  );
}
