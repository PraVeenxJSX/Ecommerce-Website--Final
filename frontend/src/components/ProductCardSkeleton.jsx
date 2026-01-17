import React from 'react';
import Skeleton from './Skeleton';

const ProductCardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
            {/* Image Placeholder */}
            <Skeleton className="h-36 w-full mb-3 rounded-lg" />

            {/* Title Placeholder */}
            <Skeleton className="h-4 w-3/4 mb-2" />

            {/* Price Placeholder */}
            <Skeleton className="h-6 w-1/3" />
        </div>
    );
};

export default ProductCardSkeleton;
