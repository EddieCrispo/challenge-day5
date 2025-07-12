import React from "react"

function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                {children}
            </div>
        </div>
    )
}

export default PublicLayout;