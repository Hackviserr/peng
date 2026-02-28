import type { FindingTemplate, TemplateCategory } from '../constants';
import { ALL_TEMPLATES } from '../data/templates';

export function getAllTemplates(): FindingTemplate[] {
    return ALL_TEMPLATES;
}

export function searchTemplates(query: string, category?: TemplateCategory | 'All'): FindingTemplate[] {
    let results = ALL_TEMPLATES;

    if (category && category !== 'All') {
        results = results.filter((t) => t.category === category);
    }

    if (query.trim()) {
        const q = query.toLowerCase();
        results = results.filter((t) =>
            t.title.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.includes(q)) ||
            (t.cwe && t.cwe.toLowerCase().includes(q)) ||
            (t.owasp && t.owasp.toLowerCase().includes(q))
        );
    }

    return results;
}

export interface CategoryCount {
    name: TemplateCategory | 'All';
    count: number;
}

export function getCategoriesWithCounts(): CategoryCount[] {
    const counts = new Map<string, number>();
    for (const t of ALL_TEMPLATES) {
        counts.set(t.category, (counts.get(t.category) || 0) + 1);
    }

    const categories: CategoryCount[] = [
        { name: 'All', count: ALL_TEMPLATES.length },
    ];

    // Sort categories alphabetically, but keep order consistent
    const sorted = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    for (const [name, count] of sorted) {
        categories.push({ name: name as TemplateCategory, count });
    }

    return categories;
}
