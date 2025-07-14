import React from "react";

export default function Steps({
  current,
  length,
  circleSize = 32,
  fontSize = 14,
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length }).map((_, stepNum) => (
        <React.Fragment key={stepNum}>
          {/* Step Circle */}
          <div
            style={{ width: circleSize, height: circleSize, fontSize }}
            className={`rounded-full flex items-center justify-center transition-colors ${
              current >= stepNum
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}
          >
            {stepNum + 1}
          </div>

          {/* Tail (Line) - only if not the last step */}
          {stepNum < length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 transition-colors ${
                current > stepNum ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
