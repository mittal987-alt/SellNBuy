"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBar() {
  return (
    <div className="flex gap-2">
      <Input placeholder="Search products..." />
      <Button size="icon">
        <Search size={18} />
      </Button>
    </div>
  );
}
