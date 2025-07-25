"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { useState, useEffect, JSX } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Loader2, 
  Save, 
  FileText, 
  Bold, 
  Italic, 
  Underline,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react"
import api from "@/api/auth"
import { toast } from "sonner"

interface MessageState {
  type: "success" | "error" | ""
  text: string
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
  title: string
}

function CreateNewPage(): JSX.Element {
  const [title, setTitle] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<MessageState>({ type: "", text: "" })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your page content here...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-6',
      },
    },
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        handleSave()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [editor, title])

  const handleSave = async (): Promise<void> => {
    const content: string = editor?.getHTML() || ""

    if (!title.trim() || content === "<p></p>") {
      setMessage({ type: "error", text: "Please fill in both title and content." })
      return
    }

    setIsLoading(true)
    setMessage({ type: "", text: "" })

    const payload = {
       title: title.trim(),
       content: content.trim(),


    }
       const token = localStorage.getItem("token")

    try {
     
       await api.post("/pages/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        }})
 

      toast.success("Post created successfully ")
      
        // setTitle("")
        // editor?.commands.clearContent()
      
    } catch {
     toast.error("Error creating page")
     
    } finally {
      setIsLoading(false)
    }
  }

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, isActive = false, children, title }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded transition-colors ${
        isActive ? ' text-blue-600' : 'text-gray-600'
      }`}
      title={title}
      type="button"
    >
      {children}
    </button>
  )

  return (
    <div className="min-h-screen">
      <div className=" border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <Input
                type="text"
                placeholder="Untitled Document"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                className="text-lg font-medium border-none shadow-none focus-visible:ring-0 bg-transparent px-0"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={isLoading || !title.trim() || editor?.isEmpty}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Page
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="border-b">
        <div className="max-w-5xl  mx-auto px-6 py-2">
          <div className="flex items-center gap-1 flex-wrap">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-6mx-2" />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <Underline className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-6 mx-2" />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-6 mx-2" />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
            <select
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const level = parseInt(e.target.value)
                if (level === 0) {
                  editor.chain().focus().setParagraph().run()
                } else {
                  editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()
                }
              }}
              className="px-3 py-1 bg-gray-600  text-sm border rounded"
              value={
                editor.isActive('heading', { level: 1 }) ? 1 :
                editor.isActive('heading', { level: 2 }) ? 2 :
                editor.isActive('heading', { level: 3 }) ? 3 : 0
              }
            >
              <option value={0}>Normal</option>
              <option value={1}>Heading 1</option>
              <option value={2}>Heading 2</option>
              <option value={3}>Heading 3</option>
            </select>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto bg-[#28282880]">
        <div className="mx-6 mt-6 shadow-sm rounded-lg  min-h-[600px]">
          <div className="p-8">
            <EditorContent 
              editor={editor}
              className="min-h-[500px]"
            />
          </div>
        </div>
      </div>
      {message.text && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className={`${
            message.type === "error" 
              ? "border-red-500 bg-red-50" 
              : "border-green-500 bg-green-50"
          } shadow-lg`}>
            <AlertDescription className={
              message.type === "error" ? "text-red-700" : "text-green-700"
            }>
              {message.text}
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="text-sm text-gray-500 text-center">
          <span className="font-medium">Tip:</span> Use Ctrl+S to save quickly, Ctrl+B for bold, Ctrl+I for italic
        </div>
      </div>
    </div>
  )
}

export default CreateNewPage