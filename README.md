# Smart Bookmark Manager

## Problems i faced

# After deploying to vercel, google oauth authentication redirected users back to localhost:3000 instead of the production URL, had to manually setup redirect url , i had forgotten to do this
# Had some problem regarding displaying updates where the ui would update immediately upon user action, but this caused duplicate bookmarks to appear when real-time events arrived shortly after, since ai generated code wasn't doing it, had to manually setup some conditional checks to make sure it doesnt display duplicate lists
# Other than that most of it worked seamlessly.
