import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmModalProps) {
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (open) cancelRef.current?.focus();
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            {/* Modal */}
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
                <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/10 shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">{message}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        ref={cancelRef}
                        onClick={onCancel}
                        className="px-3.5 py-2 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-3.5 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
