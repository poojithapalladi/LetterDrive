import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Type
} from "lucide-react";

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

// Font size options for the dropdown
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96];

export default function TextEditor({ content, onChange }: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [fontSize, setFontSize] = useState<number>(14);

  // Initialize editor with content
  useEffect(() => {
    if (editorRef.current && content) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  // Handle content change
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Format text with document.execCommand
  const formatText = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    
    // Update state for toolbar buttons
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      
      // Update format states based on current selection
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      
      // Check alignment
      if (document.queryCommandState('justifyLeft')) {
        setAlignment('left');
      } else if (document.queryCommandState('justifyCenter')) {
        setAlignment('center');
      } else if (document.queryCommandState('justifyRight')) {
        setAlignment('right');
      }
    }
    
    // Make sure to update the content after formatting
    handleInput();
  };

  // Handle font size change
  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
    formatText('fontSize', Math.ceil(value / 16).toString());
  };

  return (
    <div className="border border-[#dadce0] rounded-md flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="flex items-center border-b border-[#dadce0] p-2 overflow-x-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-sm h-9 gap-2"
            >
              <Type size={16} />
              <span>{fontSize}px</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Font Size: {fontSize}px</span>
              </div>
              <Slider
                value={[fontSize]}
                min={8}
                max={96}
                step={1}
                onValueChange={(value) => handleFontSizeChange(value[0])}
              />
              <div className="grid grid-cols-5 gap-1 mt-2">
                {FONT_SIZES.map(size => (
                  <Button
                    key={size}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-auto"
                    onClick={() => handleFontSizeChange(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="flex items-center space-x-1 ml-2">
          <Button
            variant={isBold ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('bold')}
          >
            <Bold size={16} />
          </Button>
          <Button
            variant={isItalic ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('italic')}
          >
            <Italic size={16} />
          </Button>
          <Button
            variant={isUnderline ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('underline')}
          >
            <Underline size={16} />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-[#dadce0] mx-2" />
        
        <div className="flex items-center space-x-1">
          <Button
            variant={alignment === 'left' ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('justifyLeft')}
          >
            <AlignLeft size={16} />
          </Button>
          <Button
            variant={alignment === 'center' ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('justifyCenter')}
          >
            <AlignCenter size={16} />
          </Button>
          <Button
            variant={alignment === 'right' ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('justifyRight')}
          >
            <AlignRight size={16} />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-[#dadce0] mx-2" />
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('insertUnorderedList')}
          >
            <List size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => formatText('insertOrderedList')}
          >
            <ListOrdered size={16} />
          </Button>
        </div>
      </div>
      
      {/* Editor Content */}
      <div
        ref={editorRef}
        className="flex-1 p-4 overflow-y-auto"
        contentEditable
        onInput={handleInput}
        onMouseUp={() => {
          // Update button states on selection change
          setIsBold(document.queryCommandState('bold'));
          setIsItalic(document.queryCommandState('italic'));
          setIsUnderline(document.queryCommandState('underline'));
        }}
        style={{ minHeight: '300px' }}
      />
    </div>
  );
}