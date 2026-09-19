import React from 'react';

const MiniLoading = () => {
    return (
        <div className="flex items-start justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );
};

export default MiniLoading;