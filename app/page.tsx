import { createClient } from '@/lib/supabase/server'
import LoginButton from '@/components/LoginButton'
import BookmarkList from '@/components/BookmarkList'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      {!user ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Smart Bookmark
              </h1>
              <p className="text-gray-600">
                Save and organize your favorite links
              </p>
            </div>
            <div className="flex justify-center">
              <LoginButton />
            </div> <br/>
            <div className="flex justify-center" >
    <p>Submitted by : Shivaprasad M S</p><br></br>
    <p>Contact No: 9449194477</p><br></br>
    <p>Github : <a href='https://www.github.com/shivaprasadms' target='#'>Click here</a></p>
    </div>
          </div>
        </div>
      ) : (
        <BookmarkList user={user} />
      )}
    </>
  )
}
