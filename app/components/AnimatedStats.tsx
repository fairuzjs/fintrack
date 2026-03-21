'use client';

import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function AnimatedStats({
    value,
    className = '',
}: {
    value: string;
    className?: string;
}) {
    // Parse the value, e.g., '50K+' -> 50, 'K+', or '$2.4B' -> 2.4, '$', 'B'
    const match = value.match(/^([^0-9]*)([0-9.]+)([^0-9]*)$/);
    const prefix = match ? match[1] : '';
    const numberStr = match ? match[2] : value;
    const suffix = match ? match[3] : '';

    const number = parseFloat(numberStr);
    const hasDecimal = numberStr.includes('.');

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    // Use a spring for counting up
    const springValue = useSpring(0, {
        stiffness: 40,
        damping: 15,
        mass: 1,
    });

    useEffect(() => {
        if (isInView && !isNaN(number)) {
            springValue.set(number);
        }
    }, [isInView, number, springValue]);

    // Format the number back to string with appropriate decimal places
    const displayValue = useTransform(springValue, (current: number) => {
        if (isNaN(number)) return numberStr;
        return current.toFixed(hasDecimal ? 1 : 0);
    });

    return (
        <span ref={ref} className={className}>
            {prefix}
            {!isNaN(number) ? <motion.span>{displayValue}</motion.span> : numberStr}
            <span className="text-[#A8D44C]">{suffix}</span>
        </span>
    );
}
