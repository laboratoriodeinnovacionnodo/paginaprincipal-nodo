export function LoadingIndicator() {
  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-[80%] items-start flex flex-col">
        <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-900 rounded-bl-sm">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  )
}
