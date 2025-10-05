'use client';

export default function PageSkeleton() {
    return (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory transition-colors">
            {/* ThemeToggle Skeleton */}
            <div className="fixed top-4 right-4 z-50">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>

            {/* Section Indicators Skeleton */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600 animate-pulse" />
                ))}
            </div>

            {/* Multiple Section Skeletons */}
            {[1, 2, 3, 4, 5].map((sectionIndex) => (
                <section
                    key={sectionIndex}
                    className="min-h-screen w-full flex flex-col items-center justify-center snap-start snap-always px-6 py-12"
                >
                    <div className="max-w-4xl w-full space-y-6 animate-pulse">
                        {/* Heading Skeleton */}
                        <div className="space-y-4">
                            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg w-3/4 mx-auto" />
                        </div>

                        {/* Content Skeleton */}
                        <div className="space-y-4 mt-8">
                            {/* Paragraphs */}
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mx-auto" />
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5 mx-auto" />
                            
                            {/* List items */}
                            {sectionIndex % 2 === 0 && (
                                <div className="space-y-2 mt-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full" />
                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded flex-1" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full" />
                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded flex-1" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full" />
                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded flex-1" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
}
