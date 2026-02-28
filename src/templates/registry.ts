import type { ReportTemplate } from './reportTypes';
import { DefaultTemplate } from './default/DefaultTemplate.js';

const templates: ReportTemplate[] = [
    {
        id: 'default',
        name: 'Professional Report',
        description: 'Standard penetration test report with cover page, executive summary, findings table, and detailed findings.',
        component: DefaultTemplate,
    },
];

export function listTemplates(): ReportTemplate[] {
    return templates;
}

export function getTemplate(id: string): ReportTemplate | undefined {
    return templates.find((t) => t.id === id);
}
