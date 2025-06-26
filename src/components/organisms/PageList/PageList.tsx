"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Edit, 
  Trash2, 
  Calendar,
  FileText,
  MoreVertical,
  Plus
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import api from "@/api/auth"
import { useRouter } from "next/navigation"

interface Page {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: string
  updatedAt: string
}

interface PagesListProps {
  pages: Page[]
  onPageDeleted: (pageId: string) => void
  onRefresh: () => void
}

function PagesList({ pages, onPageDeleted, onRefresh }: PagesListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const handleEdit = (pageId: string) => {
    router.push(`/edit-page/${pageId}`)
  }

  const handleDelete = async (pageId: string) => {
    setDeletingId(pageId)
    
    try {
      const token = localStorage.getItem("token")
      
      await api.delete(`/pages/${pageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      toast.success("Page deleted successfully")
      onPageDeleted(pageId)
    } catch (error) {
      toast.error("Error deleting page")
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  const getPreview = (content: string, maxLength: number = 150) => {
    const text = stripHtml(content)
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No pages yet</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          You haven't created any pages yet. Start by creating your first page to share your thoughts and ideas.
        </p>
        <Button 
          onClick={() => router.push('/new-page')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Your First Page
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold ">Your Pages</h2>
          <p className=" mt-1">
            {pages.length} of 3 pages created
          </p>
        </div>
        <Button 
          onClick={() => router.push('/new-page')}
          disabled={pages.length >= 3}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Page
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Card key={page.id} className="group hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold truncate">
                    {page.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {formatDate(page.createdAt)}
                    </span>
                    {page.createdAt !== page.updatedAt && (
                      <Badge variant="secondary" className="text-xs">
                        Updated
                      </Badge>
                    )}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => handleEdit(page.id)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          onSelect={(e) => e.preventDefault()}
                          className="flex items-center gap-2 text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the page
                            "{page.title}" and remove all its content.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(page.id)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deletingId === page.id}
                          >
                            {deletingId === page.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed">
                {getPreview(page.content)}
              </p>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {stripHtml(page.content).length} characters
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(page.id)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {pages.length >= 3 && (
        <div className="text-center py-4">
          <Badge variant="outline" className="text-amber-600 border-amber-200">
            You've reached the maximum of 3 pages
          </Badge>
        </div>
      )}
    </div>
  )
}

export default PagesList