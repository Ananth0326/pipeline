'use client';

import { motion } from 'framer-motion';

export default function AmbientOrbs() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            <motion.div
                className="absolute -top-24 -left-24 w-[400px] h-[400px] rounded-full blur-[120px]"
                style={{ backgroundColor: '#00F2FE', opacity: 0.05 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full blur-[120px]"
                style={{ backgroundColor: '#A16EFF', opacity: 0.05 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
        </div>
    );
}
