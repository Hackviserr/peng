import type { ReportData } from '../reportTypes';

export function CoverPage({ data }: { data: ReportData }) {
    const { project } = data;

    return (
        <div className="report-page flex flex-col justify-between min-h-[100vh] px-16 py-20">
            {/* Classification */}
            <div className="text-center">
                <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] border-2 border-black rounded">
                    {project.classification}
                </span>
            </div>

            {/* Center content */}
            <div className="text-center flex-1 flex flex-col justify-center">
                <h1 className="text-5xl font-bold mb-6 leading-tight">{project.name || 'Penetration Test Report'}</h1>
                {project.clientName && (
                    <p className="text-xl text-gray-600 mb-2">Prepared for: <span className="font-semibold text-black">{project.clientName}</span></p>
                )}
                {project.assessorName && (
                    <p className="text-lg text-gray-500">By: {project.assessorName}</p>
                )}
            </div>

            {/* Bottom metadata */}
            <div className="border-t-2 border-black pt-6">
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500 uppercase text-xs tracking-wider mb-1">Report Date</p>
                        <p className="font-semibold">{project.reportDate || '—'}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-500 uppercase text-xs tracking-wider mb-1">Version</p>
                        <p className="font-semibold">{project.reportVersion}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 uppercase text-xs tracking-wider mb-1">Assessment Period</p>
                        <p className="font-semibold">
                            {project.assessmentDateStart && project.assessmentDateEnd
                                ? `${project.assessmentDateStart} — ${project.assessmentDateEnd}`
                                : project.assessmentDateStart || '—'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
