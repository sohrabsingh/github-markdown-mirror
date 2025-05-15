
import MarkdownEditor from "@/components/MarkdownEditor";
import { useTheme } from "@/components/ThemeProvider";

const Index = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <MarkdownEditor />
    </div>
  );
};

export default Index;
