'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export const AdUnit = () => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className="ad-container my-8 w-full overflow-hidden flex justify-center">
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-8057450154530877"
                data-ad-slot="7201552066"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
};
