import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type MultiSelectorProps = {
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  allowCustomOptions?: boolean;
  customOptionPlaceholder?: string;
};

export function MultiSelector({ 
  options, 
  selectedOptions, 
  onChange,
  className = "",
  allowCustomOptions = true,
  customOptionPlaceholder = "Type to add custom option..."
}: MultiSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customOption, setCustomOption] = useState("");
  
  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter(item => item !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };
  
  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedOptions.filter(item => item !== option));
  };
  
  const addCustomOption = () => {
    if (!customOption.trim()) return;
    
    // Don't add duplicates (case insensitive check)
    if (!selectedOptions.some(op => op.toLowerCase() === customOption.toLowerCase()) &&
        !options.some(op => op.toLowerCase() === customOption.toLowerCase())) {
      onChange([...selectedOptions, customOption.trim()]);
      setCustomOption("");
    }
  };

  const handleCustomOptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomOption();
    }
  };
  
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedOptions.includes(option)
  );

  return (
    <div className={`flex flex-col w-full gap-2 ${className}`}>
      {/* Selected options pills */}
      <div className="flex flex-wrap gap-2">
        {selectedOptions.map(option => (
          <div
            key={option}
            className="flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-[#2F6868]/10 text-[#2F6868] border border-[#2F6868]/20"
          >
            <span>{option}</span>
            <button
              type="button"
              className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#2F6868]/20"
              onClick={(e) => removeOption(option, e)}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Filter input */}
      <input
        type="text"
        className="w-full p-2 border rounded-md"
        placeholder="Type to filter options..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {/* Custom option input */}
      {allowCustomOptions && (
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md"
            placeholder={customOptionPlaceholder}
            value={customOption}
            onChange={(e) => setCustomOption(e.target.value)}
            onKeyDown={handleCustomOptionKeyDown}
          />
          <Button
            type="button"
            variant="outline"
            className="shrink-0"
            onClick={addCustomOption}
            disabled={!customOption.trim()}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      )}
      
      {/* Options list */}
      <div className="max-h-60 overflow-y-auto border rounded-md">
        {filteredOptions.length > 0 ? (
          filteredOptions.map(option => (
            <div
              key={option}
              className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              onClick={() => toggleOption(option)}
            >
              <span>{option}</span>
              <Button 
                type="button" 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <div className="p-2 text-center text-gray-500">
            {searchTerm && !filteredOptions.length ? "No matching options" : "No options available"}
          </div>
        )}
      </div>
    </div>
  );
}
