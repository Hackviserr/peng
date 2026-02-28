import type { Project, Finding, Severity, FindingStatus } from '../types';

export interface ReportStats {
    total: number;
    bySeverity: Record<Severity, number>;
    byStatus: Record<FindingStatus, number>;
}

export interface ReportData {
    project: Project;
    findings: Finding[];
    generatedAt: string;
    stats: ReportStats;
}

export interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    component: React.ComponentType<{ data: ReportData }>;
}

export function buildReportData(project: Project, findings: Finding[]): ReportData {
    const severityOrder: Record<Severity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3, Info: 4 };

    // Sort by severity, exclude notes from output
    const sorted = [...findings].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    const stats: ReportStats = {
        total: sorted.length,
        bySeverity: { Critical: 0, High: 0, Medium: 0, Low: 0, Info: 0 },
        byStatus: { Open: 0, Fixed: 0, 'Accepted Risk': 0 },
    };
    for (const f of sorted) {
        stats.bySeverity[f.severity]++;
        stats.byStatus[f.status]++;
    }

    return {
        project,
        findings: sorted,
        generatedAt: new Date().toISOString(),
        stats,
    };
}
