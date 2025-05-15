
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/components/ThemeProvider';
import { 
  Bold, 
  Italic, 
  ListOrdered, 
  List, 
  Heading,
  Link,
  Code,
  FileText,
  Save,
  Eye,
  EyeOff,
  Moon,
  Sun
} from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Set up marked options
marked.setOptions({
  gfm: true,
  breaks: true
});

// Sample default markdown content
const DEFAULT_MARKDOWN = `# GitHub-Style Markdown Editor

## Features
- 📝 Real-time preview with GitHub styling
- 🎯 Toolbar for common formatting
- 💾 Save and load markdown files
- 📱 Responsive design that works on all devices
- 🌓 Dark mode support

## Code Example
\`\`\`javascript
function sayHello() {
  console.log("Hello, Markdown!");
}
\`\`\`

## Lists
### Unordered
- Item 1
- Item 2
  - Nested item

### Ordered
1. First item
2. Second item
   1. Nested item

## Table
| Name | Description |
| ---- | ----------- |
| Markdown | Text formatting syntax |
| Preview | Real-time rendering |

## Quote
> This is a blockquote. It's quite handy for quoting text.

## Task List
- [x] Create markdown editor
- [x] Add dark mode
- [ ] Add more features
- [ ] Publish project

---

Made with ❤️ using React
`;

const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [html, setHtml] = useState<string>('');
  const [view, setView] = useState<'split' | 'edit' | 'preview'>('split');
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const renderMarkdown = () => {
      const rawHtml = marked(markdown);
      const cleanHtml = DOMPurify.sanitize(rawHtml);
      setHtml(cleanHtml);
    };

    renderMarkdown();
  }, [markdown]);

  // Toolbar actions
  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText = markdown.substring(0, start) + before + selectedText + after + markdown.substring(end);
    
    setMarkdown(newText);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const handleBoldClick = () => insertText('**', '**');
  const handleItalicClick = () => insertText('*', '*');
  const handleHeadingClick = () => insertText('## ');
  const handleLinkClick = () => insertText('[', '](url)');
  const handleCodeClick = () => insertText('`', '`');
  const handleUnorderedListClick = () => insertText('- ');
  const handleOrderedListClick = () => insertText('1. ');

  const handleSave = () => {
    try {
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.md';
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Saved!",
        description: "Your markdown file has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error saving file",
        description: "There was a problem saving your file.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result;
      // Fixed: Add proper type checking for the FileReader result
      if (typeof content === 'string') {
        setMarkdown(content);
        toast({
          title: "File loaded",
          description: `${file.name} has been loaded successfully.`,
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the file input
    event.target.value = '';
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-github-fg dark:text-white mb-4 lg:mb-0">GitHub-Style Markdown Editor</h1>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={toggleTheme}
            className="text-sm"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button 
            variant="outline" 
            onClick={() => setView(view === 'edit' ? 'split' : 'edit')}
            className="text-sm"
          >
            {view === 'edit' ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
            {view === 'edit' ? 'Show Preview' : 'Hide Preview'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleSave}
            className="text-sm"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          
          <div className="relative">
            <input
              type="file"
              accept=".md,.markdown,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="file-upload"
            />
            <Button 
              variant="outline"
              className="text-sm"
            >
              <FileText className="h-4 w-4 mr-1" />
              Load
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full border rounded-lg overflow-hidden shadow-sm dark:border-gray-700">
        <div className="bg-github-muted dark:bg-gray-800 border-b border-github-border dark:border-gray-700 p-2 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={handleBoldClick}><Bold className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={handleItalicClick}><Italic className="h-4 w-4" /></Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button variant="ghost" size="sm" onClick={handleHeadingClick}><Heading className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={handleLinkClick}><Link className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={handleCodeClick}><Code className="h-4 w-4" /></Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button variant="ghost" size="sm" onClick={handleUnorderedListClick}><List className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={handleOrderedListClick}><ListOrdered className="h-4 w-4" /></Button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {view !== 'preview' && (
            <div className={`${view === 'split' ? 'lg:w-1/2' : 'w-full'} border-r border-github-border dark:border-gray-700`}>
              <textarea
                id="markdown-editor"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-[600px] p-4 font-mono text-sm editor-textarea border-none bg-white dark:bg-gray-900 dark:text-white"
                placeholder="Type your markdown here..."
              />
            </div>
          )}
          
          {view !== 'edit' && (
            <div className={`${view === 'split' ? 'lg:w-1/2' : 'w-full'} overflow-auto dark:bg-gray-900`}>
              <div 
                className="markdown-preview p-4 h-[600px] overflow-auto dark:text-white"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
