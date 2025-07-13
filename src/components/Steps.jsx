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
            className={`rounded-full flex items-center justify-center ${
              current >= stepNum
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {stepNum + 1}
          </div>

          {/* Tail (Line) - only if not the last step */}
          {stepNum < length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 ${
                current > stepNum ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
