export default function Steps({ current, length }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length: length }).map((_, stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              current >= stepNum
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {stepNum + 1}
          </div>
          {stepNum < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                current > stepNum ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
