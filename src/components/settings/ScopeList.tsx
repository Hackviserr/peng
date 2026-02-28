import { useState } from 'react';
import { Plus, X, Globe, Server, Wifi, Smartphone, MoreHorizontal, ShieldCheck, ShieldOff } from 'lucide-react';
import type { ScopeItem, ScopeType } from '../../types';
import { parseScopeItems, stringifyScopeItems } from '../../types';

const SCOPE_TYPES: { value: ScopeType; label: string; icon: typeof Globe }[] = [
    { value: 'Web App', label: 'Web App', icon: Globe },
    { value: 'API', label: 'API', icon: Server },
    { value: 'Network', label: 'Network', icon: Wifi },
    { value: 'Mobile', label: 'Mobile', icon: Smartphone },
    { value: 'Other', label: 'Other', icon: MoreHorizontal },
];

interface ScopeListProps {
    value: string; // JSON string
    onChange: (value: string) => void;
}

export default function ScopeList({ value, onChange }: ScopeListProps) {
    const items = parseScopeItems(value);
    const inScope = items.filter((i) => i.included);
    const outOfScope = items.filter((i) => !i.included);

    const addItem = (included: boolean) => {
        const newItem: ScopeItem = {
            id: crypto.randomUUID(),
            value: '',
            type: 'Web App',
            included,
        };
        onChange(stringifyScopeItems([...items, newItem]));
    };

    const updateItem = (id: string, field: keyof ScopeItem, val: string | boolean) => {
        const updated = items.map((item) =>
            item.id === id ? { ...item, [field]: val } : item
        );
        onChange(stringifyScopeItems(updated));
    };

    const removeItem = (id: string) => {
        onChange(stringifyScopeItems(items.filter((i) => i.id !== id)));
    };

    return (
        <div className="space-y-8">
            {/* In Scope */}
            <div>
                <h4 className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-3">
                    <ShieldCheck className="w-4 h-4" />
                    In Scope
                </h4>
                <div className="space-y-1.5">
                    {inScope.map((item) => (
                        <ScopeRow key={item.id} item={item} onUpdate={updateItem} onRemove={removeItem} />
                    ))}
                    <button
                        onClick={() => addItem(true)}
                        className="w-full flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 px-3 py-2 rounded-lg border border-dashed border-zinc-800 hover:border-zinc-600 transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add scope item...
                    </button>
                </div>
            </div>

            {/* Out of Scope */}
            <div>
                <h4 className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-3">
                    <ShieldOff className="w-4 h-4" />
                    Out of Scope
                </h4>
                <div className="space-y-1.5">
                    {outOfScope.map((item) => (
                        <ScopeRow key={item.id} item={item} onUpdate={updateItem} onRemove={removeItem} />
                    ))}
                    <button
                        onClick={() => addItem(false)}
                        className="w-full flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 px-3 py-2 rounded-lg border border-dashed border-zinc-800 hover:border-zinc-600 transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add exclusion...
                    </button>
                </div>
            </div>
        </div>
    );
}

function ScopeRow({
    item,
    onUpdate,
    onRemove,
}: {
    item: ScopeItem;
    onUpdate: (id: string, field: keyof ScopeItem, val: string | boolean) => void;
    onRemove: (id: string) => void;
}) {
    const [typeOpen, setTypeOpen] = useState(false);
    const currentType = SCOPE_TYPES.find((t) => t.value === item.type) ?? SCOPE_TYPES[0];
    const Icon = currentType.icon;

    return (
        <div className="group flex items-center gap-2 bg-zinc-900/50 rounded-lg border border-zinc-800/50 hover:border-zinc-700 transition-colors">
            {/* Type selector */}
            <div className="relative shrink-0">
                <button
                    onClick={() => setTypeOpen(!typeOpen)}
                    className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 px-3 py-2.5 transition-colors font-medium min-w-[100px]"
                >
                    <Icon className="w-3.5 h-3.5" />
                    {currentType.label}
                </button>
                {typeOpen && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl py-1 min-w-[130px]">
                        {SCOPE_TYPES.map((t) => {
                            const TIcon = t.icon;
                            return (
                                <button
                                    key={t.value}
                                    onClick={() => { onUpdate(item.id, 'type', t.value); setTypeOpen(false); }}
                                    className={`w-full flex items-center gap-2 text-left text-xs px-2.5 py-1.5 transition-colors ${t.value === item.type ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'}`}
                                >
                                    <TIcon className="w-3.5 h-3.5" />
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Divider */}
            <span className="w-px h-5 bg-zinc-800 shrink-0" />

            {/* Value input */}
            <input
                type="text"
                value={item.value}
                onChange={(e) => onUpdate(item.id, 'value', e.target.value)}
                placeholder="e.g. https://app.example.com, 192.168.1.0/24"
                className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none py-2.5 min-w-0"
            />

            {/* Remove */}
            <button
                onClick={() => onRemove(item.id)}
                className="p-1.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all mr-1"
                title="Remove"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
