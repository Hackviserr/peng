import { Printer, Trash2, Copy } from 'lucide-react';

interface EditorToolbarProps {
    onPrint: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
}

export default function EditorToolbar({ onPrint, onDelete, onDuplicate }: EditorToolbarProps) {
    return (
        <div className="absolute top-6 right-8 flex items-center gap-3 print:hidden z-10">
            <button
                onClick={onDuplicate}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-zinc-300 bg-zinc-800/50 hover:bg-zinc-700 rounded-md transition-colors border border-zinc-700/50"
                title="Duplicate Finding"
            >
                <Copy className="w-4 h-4 mr-2" /> Duplicate
            </button>
            <button
                onClick={onPrint}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-zinc-300 bg-zinc-800/50 hover:bg-zinc-700 rounded-md transition-colors border border-zinc-700/50"
            >
                <Printer className="w-4 h-4 mr-2" /> Print / PDF
            </button>
            <button
                onClick={onDelete}
                className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                title="Delete Finding"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
}
