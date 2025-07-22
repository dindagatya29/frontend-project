

export default function TaskDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-6">
        {/* Main Content Skeleton */}
        <div className="flex-1 space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-8 w-80 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Progress Skeleton */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-3 w-full bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* Activity Skeleton */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-4">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-16 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="w-80 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
