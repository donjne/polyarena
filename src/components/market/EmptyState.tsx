// components/EmptyState.tsx
export function EmptyState() {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-purple-900 mb-2">No arenas found</h3>
        <p className="text-purple-600">Try adjusting your filters or check back later</p>
      </div>
    );
  }