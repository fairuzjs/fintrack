'use client';

import { motion } from 'framer-motion';

export default function TypewriterText({ text, delayOffset = 0 }: { text: string; delayOffset?: number }) {
    // Split text into characters
    const words = text.split(" ");

    return (
        <span className="inline-block">
            {words.map((word, i) => (
                <span key={`${word}-${i}`} className="inline-block mr-[0.25em]">
                    {word.split("").map((char, j) => (
                        <motion.span
                            key={`${char}-${j}`}
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{
                                duration: 0.4,
                                ease: [0.22, 1, 0.36, 1],
                                // Delay each word significantly, and each character slightly
                                delay: delayOffset + (i * 0.15) + (j * 0.03),
                                repeat: Infinity,
                                repeatType: "reverse",
                                repeatDelay: 2,
                            }}
                            className="inline-block"
                        >
                            {char}
                        </motion.span>
                    ))}
                </span>
            ))}
        </span>
    );
}
