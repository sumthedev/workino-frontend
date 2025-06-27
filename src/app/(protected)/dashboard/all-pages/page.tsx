"use client"
import api from '@/api/auth'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import PagesList from '@/components/organisms/PageList/PageList'
import { Page } from '@/lib/constant/type'


function PagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPages = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")

      const res = await api.get("/pages/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setPages(res.data)
      toast.success("Pages fetched successfully")
    } catch (error) {
      toast.error("Error fetching pages")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageDeleted = (pageId: string) => {
    setPages(prevPages => prevPages.filter(page => page.id !== pageId))
  }

  const handleRefresh = () => {
    fetchPages()
  }

  useEffect(() => {
    fetchPages()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-gray-600">Loading your pages...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PagesList 
          pages={pages} 
          onPageDeleted={handlePageDeleted}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  )
}

export default PagesPage