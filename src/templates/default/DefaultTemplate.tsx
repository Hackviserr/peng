import type { ReportData } from '../reportTypes';
import { CoverPage } from './CoverPage';
import { TableOfContents } from './TableOfContents';
import { ExecutiveSummary } from './ExecutiveSummary';
import { ScopeSection } from './ScopeSection';
import { FindingSummary } from './FindingSummary';
import { FindingDetail } from './FindingDetail';

export function DefaultTemplate({ data }: { data: ReportData }) {
    return (
        <div className="report-document">
            <CoverPage data={data} />
            <TableOfContents data={data} />
            <ExecutiveSummary data={data} />
            <ScopeSection data={data} />
            <FindingSummary data={data} />
            {data.findings.map((finding, index) => (
                <FindingDetail key={finding.id} finding={finding} index={index} />
            ))}
        </div>
    );
}
