export default function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center w-full py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-600 border-t-white" />
    </div>
  );
}
