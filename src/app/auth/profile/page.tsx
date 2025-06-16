import ProfileCard from '@/components/auth/profileCard'
import Navbar from '@/components/ui/navbar'
import React from 'react'

const page = () => {
  return (
    <div >
   
   <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-10">
         <ProfileCard />
      </main>
    </div> 
  </div>
  )
}

export default page
