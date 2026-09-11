import React, { useState, useEffect } from 'react';

function ContestTimer({ endTime, onTimeUp }) {
    const [timeLeft, setTimeLeft] = useState("Loading...");
    const [isTimeUp, setIsTimeUp] = useState(false);

    useEffect(() => {
        if (!endTime) return;

        // Contest timestamps are stored in UTC but may be returned without an offset.
        const normalizedEndTime = /(?:Z|[+-]\d{2}:?\d{2})$/.test(endTime)
            ? endTime
            : `${endTime}Z`;

        const timer = setInterval(() => {
            const end = new Date(normalizedEndTime).getTime();
            const now = new Date().getTime();
            const distance = end - now;

            if (distance <= 0) {
                clearInterval(timer);
                setTimeLeft("00:00:00");
                setIsTimeUp(true);
                if (onTimeUp) onTimeUp(); // Tell the workspace to lock the button!
            } else {
                const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distance % (1000 * 60)) / 1000);

                setTimeLeft(
                    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
                );
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime, onTimeUp]);

    return (
        <div style={{ 
            padding: '6px 15px', 
            backgroundColor: isTimeUp ? '#dc3545' : '#222', 
            color: isTimeUp ? 'white' : '#00ff00', 
            borderRadius: '4px', 
            fontFamily: 'monospace',
            fontWeight: 'bold',
            border: '1px solid #444'
        }}>
            {isTimeUp ? "TIME UP" : `⏱ ${timeLeft}`}
        </div>
    );
}

export default ContestTimer;