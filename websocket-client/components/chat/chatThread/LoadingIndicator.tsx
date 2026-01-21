'use client'

const BubbleLoader = () => {
    return (
        <div className="flex items-center justify-center gap-1.5 h-6">
            {[0, 1, 2].map((index) => (
                <div
                    key={index}
                    className="w-2 h-2 bg-gray-700 rounded-full animate-bubble"
                    style={{
                        animationDelay: `${index * 0.2}s`,
                    }}
                />
            ))}
        </div>
    )
}

export const LoadingIndicator = () => {
    return (
        <div className="flex justify-start w-full px-4 mb-1">
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl px-4 py-3">
                <BubbleLoader />
            </div>
        </div>
    )
}

