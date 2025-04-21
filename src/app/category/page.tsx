

import CategoriesPage from '@/components/category/categories-page'
import Navbar from '@/components/ui/navbar'
import React from 'react'

const index = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto py-40 px-4">
        <CategoriesPage />
      </main>
    </>
  )
}

export default index
