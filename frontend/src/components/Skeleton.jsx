export function SkeletonCard() {
  return <div className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse"><div className="h-3 bg-gray-200 rounded w-1/3 mb-4" /><div className="h-8 bg-gray-200 rounded w-1/2 mb-3" /><div className="h-3 bg-gray-200 rounded w-2/3" /></div>;
}
export function SkeletonRow() {
  return <div className="grid grid-cols-12 gap-4 px-6 py-4 animate-pulse"><div className="col-span-3 h-6 bg-gray-200 rounded-full" /><div className="col-span-4 h-4 bg-gray-200 rounded" /><div className="col-span-2 h-4 bg-gray-200 rounded" /><div className="col-span-3 h-4 bg-gray-200 rounded" /></div>;
}
