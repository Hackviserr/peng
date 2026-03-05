import { useMemo, useState } from 'react';
import type { Severity } from '../../types';
import {
    type CvssBaseMetrics,
    DEFAULT_CVSS_METRICS,
    calculateCvssScore,
    buildCvssVector,
    mapCvssScoreToSeverity,
} from '../../lib/cvss';

interface CvssCalculatorModalProps {
    open: boolean;
    onClose: () => void;
    onApply: (result: { score: string; severity: Severity; vector: string; applySeverity: boolean }) => void;
}

export default function CvssCalculatorModal({ open, onClose, onApply }: CvssCalculatorModalProps) {
    const [metrics, setMetrics] = useState<CvssBaseMetrics>(DEFAULT_CVSS_METRICS);
    const [applySeverity, setApplySeverity] = useState(true);

    const { score, vector, severity } = useMemo(() => {
        const s = calculateCvssScore(metrics);
        const v = buildCvssVector(metrics);
        const sev = mapCvssScoreToSeverity(s);
        return {
            score: s,
            vector: v,
            severity: sev,
        };
    }, [metrics]);

    if (!open) return null;

    const handleSelect =
        (field: keyof CvssBaseMetrics) =>
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value as CvssBaseMetrics[typeof field];
            setMetrics((prev) => ({
                ...prev,
                [field]: value,
            }));
        };

    const handleApply = () => {
        onApply({
            score: score.toFixed(1),
            severity,
            vector,
            applySeverity,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-xl mx-4">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                    <div>
                        <h2 className="text-sm font-semibold text-zinc-100">CVSS v3.x Calculator</h2>
                        <p className="text-[11px] text-zinc-500">Base score &amp; severity will be calculated from the selected metrics.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-300 text-sm px-2 py-1"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-4 py-3 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Attack Vector (AV)</label>
                            <select
                                value={metrics.AV}
                                onChange={handleSelect('AV')}
                                className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                            >
                                <option value="N">Network (N)</option>
                                <option value="A">Adjacent (A)</option>
                                <option value="L">Local (L)</option>
                                <option value="P">Physical (P)</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Attack Complexity (AC)</label>
                            <select
                                value={metrics.AC}
                                onChange={handleSelect('AC')}
                                className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                            >
                                <option value="L">Low (L)</option>
                                <option value="H">High (H)</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Privileges Required (PR)</label>
                            <select
                                value={metrics.PR}
                                onChange={handleSelect('PR')}
                                className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                            >
                                <option value="N">None (N)</option>
                                <option value="L">Low (L)</option>
                                <option value="H">High (H)</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">User Interaction (UI)</label>
                            <select
                                value={metrics.UI}
                                onChange={handleSelect('UI')}
                                className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                            >
                                <option value="N">None (N)</option>
                                <option value="R">Required (R)</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Scope (S)</label>
                            <select
                                value={metrics.S}
                                onChange={handleSelect('S')}
                                className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                            >
                                <option value="U">Unchanged (U)</option>
                                <option value="C">Changed (C)</option>
                            </select>
                        </div>

                        <div />

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Confidentiality (C)</label>
                            <select
                                value={metrics.C}
                                onChange={handleSelect('C')}
                                className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                            >
                                <option value="N">None (N)</option>
                                <option value="L">Low (L)</option>
                                <option value="H">High (H)</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Integrity (I)</label>
                            <select
                                value={metrics.I}
                                onChange={handleSelect('I')}
                                className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                            >
                                <option value="N">None (N)</option>
                                <option value="L">Low (L)</option>
                                <option value="H">High (H)</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Availability (A)</label>
                            <select
                                value={metrics.A}
                                onChange={handleSelect('A')}
                                className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                            >
                                <option value="N">None (N)</option>
                                <option value="L">Low (L)</option>
                                <option value="H">High (H)</option>
                            </select>
                        </div>
                    </div>

                    <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-950/60">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[11px] text-zinc-500 uppercase tracking-wide mb-1">Base Score</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-semibold text-zinc-50">{score.toFixed(1)}</span>
                                    <span className="text-xs text-zinc-500">/ 10.0</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[11px] text-zinc-500 uppercase tracking-wide mb-1">Severity</div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium bg-zinc-800/80 text-zinc-100">
                                    {severity}
                                </span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="text-[11px] text-zinc-500 uppercase tracking-wide mb-1">Vector</div>
                            <div className="text-[11px] font-mono text-zinc-300 break-all bg-zinc-900/80 border border-zinc-800 rounded px-2 py-1.5">
                                {vector}
                            </div>
                        </div>
                        <label className="mt-3 flex items-center gap-2 text-[11px] text-zinc-400">
                            <input
                                type="checkbox"
                                checked={applySeverity}
                                onChange={(e) => setApplySeverity(e.target.checked)}
                                className="w-3 h-3 rounded border-zinc-700 bg-zinc-950 text-zinc-50"
                            />
                            Also update Risk Level to match this CVSS severity
                        </label>
                    </div>
                </div>

                <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-1.5 text-xs rounded-md border border-zinc-700 text-zinc-300 hover:bg-zinc-800/60 hover:border-zinc-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleApply}
                        className="px-3 py-1.5 text-xs rounded-md bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition-colors"
                    >
                        Apply to finding
                    </button>
                </div>
            </div>
        </div>
    );
}

