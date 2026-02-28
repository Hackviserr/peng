import { useState, useEffect } from 'react';
import ConfirmModal from './components/ui/ConfirmModal';
import Sidebar from './components/sidebar/Sidebar';
import Editor from './components/editor/Editor';
import ProjectSettings from './components/settings/ProjectSettings';
import ProjectDashboard from './components/dashboard/ProjectDashboard';
import ReportPreview from './components/report/ReportPreview';
import TemplateBrowser from './components/templates/TemplateBrowser';
import { useProjects } from './hooks/useProjects';
import { useFindings } from './hooks/useFindings';
import type { Finding, Project } from './types';
import { createDefaultFinding } from './types';
import type { FindingTemplate } from './constants';

type ActiveView = 'editor' | 'settings';

export default function App() {
  const { projects, isLoading: projectsLoading, createProject, updateProject, deleteProject } = useProjects();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const { findings, setFindings, isLoading: findingsLoading, lastSaved } = useFindings(activeProjectId);
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<ActiveView>('editor');
  const [showReport, setShowReport] = useState(false);
  const [showTemplateBrowser, setShowTemplateBrowser] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+T / Ctrl+T → Toggle template browser
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        if (activeProjectId) setShowTemplateBrowser((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProjectId]);

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null;

  // --- Finding handlers ---

  const handleAddFinding = (template: FindingTemplate | null = null) => {
    if (!activeProjectId) return;
    const base = createDefaultFinding(activeProjectId);
    const newFinding: Finding = template
      ? {
        ...base,
        title: template.title,
        severity: template.severity,
        description: template.description,
        impact: template.impact,
        remediation: template.remediation,
        cwe: template.cwe ?? '',
        cvss: template.cvss ?? '',
        references: template.references ?? '',
        url: template.url ?? '',
        method: template.method ?? '',
        parameter: template.parameter ?? '',
        affectedHost: template.affectedHost ?? '',
        port: template.port ?? '',
      }
      : base;
    setFindings((prev) => [newFinding, ...prev]);
    setSelectedFindingId(newFinding.id);
    setActiveView('editor');
  };

  const handleSelectFinding = (id: string) => {
    setSelectedFindingId(id);
    setActiveView('editor');
  };

  const [pendingDeleteFindingId, setPendingDeleteFindingId] = useState<string | null>(null);

  const handleDeleteFinding = (id: string) => {
    setPendingDeleteFindingId(id);
  };

  const confirmDeleteFinding = () => {
    if (pendingDeleteFindingId) {
      setFindings((prev) => prev.filter((f) => f.id !== pendingDeleteFindingId));
      if (selectedFindingId === pendingDeleteFindingId) setSelectedFindingId(null);
      setPendingDeleteFindingId(null);
    }
  };

  const handleDuplicateFinding = (id: string) => {
    const original = findings.find((f) => f.id === id);
    if (!original) return;
    const duplicate: Finding = {
      ...original,
      id: crypto.randomUUID(),
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    setFindings((prev) => [duplicate, ...prev]);
    setSelectedFindingId(duplicate.id);
  };

  const handleUpdateFinding = (field: keyof Finding, value: string) => {
    setFindings((prev) =>
      prev.map((f) =>
        f.id === selectedFindingId ? { ...f, [field]: value } : f
      )
    );
  };

  // --- Project handlers ---

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    setSelectedFindingId(null);
    setSearchTerm('');
    setActiveView('editor');
  };

  const handleBackToProjects = () => {
    setActiveProjectId(null);
    setSelectedFindingId(null);
    setSearchTerm('');
  };

  const handleUpdateProject = (field: keyof Project, value: string) => {
    if (!activeProject) return;
    const updated = { ...activeProject, [field]: value };
    updateProject(updated);
  };

  const handleCreateProject = (name: string) => {
    const project = createProject(name);
    handleSelectProject(project.id);
  };

  // --- Export / Import ---

  const exportData = () => {
    if (!activeProject) return;
    const exportPayload = { project: activeProject, findings };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const name = activeProject.name || 'peng-report';
    link.download = `${name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.project && parsed.findings) {
          // Create a new project from imported data
          const imported = createProject(parsed.project.name || 'Imported Project');
          // Update imported project fields
          const full: Project = { ...imported, ...parsed.project, id: imported.id, createdAt: imported.createdAt, updatedAt: imported.updatedAt };
          updateProject(full);
          // Assign findings to the new project
          const importedFindings: Finding[] = parsed.findings.map((f: Finding) => ({
            ...f,
            id: crypto.randomUUID(),
            projectId: imported.id,
            status: f.status || 'Open',
            createdAt: f.createdAt || new Date().toISOString(),
          }));
          // We need to select the project first, then set findings
          setActiveProjectId(imported.id);
          setTimeout(() => setFindings(importedFindings), 100);
        }
      } catch {
        alert('Invalid or corrupted JSON file!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- Loading ---

  if (projectsLoading) {
    return (
      <div className="flex h-screen bg-[#09090b] items-center justify-center">
        <div className="text-zinc-500 text-sm">Loading...</div>
      </div>
    );
  }

  // --- Dashboard (no project selected) ---

  if (!activeProjectId || !activeProject) {
    return (
      <ProjectDashboard
        projects={projects}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onDeleteProject={deleteProject}
        onImport={importData}
      />
    );
  }

  // --- Project View ---

  if (findingsLoading) {
    return (
      <div className="flex h-screen bg-[#09090b] items-center justify-center">
        <div className="text-zinc-500 text-sm">Loading project...</div>
      </div>
    );
  }

  const filteredFindings = findings.filter((f) =>
    f.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedFinding = findings.find((f) => f.id === selectedFindingId) ?? null;

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-emerald-500/30">
      <Sidebar
        projectName={activeProject.name}
        findings={filteredFindings}
        selectedFindingId={activeView === 'editor' ? selectedFindingId : null}
        activeView={activeView}
        searchTerm={searchTerm}
        lastSaved={lastSaved}
        onSearchChange={setSearchTerm}
        onSelectFinding={handleSelectFinding}
        onAddFinding={() => handleAddFinding()}
        onBrowseTemplates={() => setShowTemplateBrowser(true)}
        onOpenSettings={() => setActiveView('settings')}
        onExport={exportData}
        onBackToProjects={handleBackToProjects}
        onGenerateReport={() => setShowReport(true)}
        onDeleteFinding={handleDeleteFinding}
        onDuplicateFinding={handleDuplicateFinding}
      />
      {activeView === 'settings' ? (
        <ProjectSettings
          project={activeProject}
          onUpdate={handleUpdateProject}
        />
      ) : (
        <Editor
          selectedFinding={selectedFinding}
          onUpdateField={handleUpdateFinding}
          onDelete={handleDeleteFinding}
          onDuplicate={handleDuplicateFinding}
        />
      )}
      {showReport && (
        <ReportPreview
          project={activeProject}
          findings={findings}
          onClose={() => setShowReport(false)}
        />
      )}
      {showTemplateBrowser && (
        <TemplateBrowser
          onSelect={(template) => handleAddFinding(template)}
          onClose={() => setShowTemplateBrowser(false)}
        />
      )}
      <ConfirmModal
        open={!!pendingDeleteFindingId}
        title="Delete Finding"
        message="This finding will be permanently deleted. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDeleteFinding}
        onCancel={() => setPendingDeleteFindingId(null)}
      />
    </div>
  );
}
