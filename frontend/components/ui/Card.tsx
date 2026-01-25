import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: 'default' | 'glass' | 'surface';
}

export default function Card({
    children,
    className,
    onClick,
    variant = 'default'
}: CardProps) {
    const variants = {
        default: 'bg-bg-card border border-white/[0.05]',
        glass: 'bg-bg-card/60 backdrop-blur-md border border-white/10',
        surface: 'bg-bg-surface border border-white/[0.03]'
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                'rounded-3xl p-6 transition-all duration-300',
                variants[variant],
                onClick && 'cursor-pointer hover:border-white/10 active:scale-[0.99]',
                className
            )}
        >
            {children}
        </div>
    );
}
