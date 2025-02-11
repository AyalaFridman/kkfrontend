
import React from 'react';

export default function Home() {
    return (
        <div
            style={{
                position: 'relative',
                height: '90vh', // גובה הקומפוננטה
                width: '80%', // רוחב הקומפוננטה
                margin: '0 auto',
            }}
        >
            {/* שכבת התמונה */}
            <div
                style={{
                    backgroundImage: `url(/logo.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100%',
                    width: '100%',
                    opacity: 0.6, // רמת שקיפות
                    zIndex: 1,
                }}
            />
        </div>
    );
}

