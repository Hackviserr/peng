import type { LucideIcon } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface ContentBlockProps {
    icon: LucideIcon;
    iconClassName: string;
    label: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
}

export default function ContentBlock({
    icon: Icon,
    iconClassName,
    label,
    value,
    placeholder,
    onChange,
}: ContentBlockProps) {
    return (
        <div className="group">
            <h3 className="flex items-center text-lg font-semibold text-zinc-100 print:text-black mb-3">
                <Icon className={`w-5 h-5 mr-2 print:hidden ${iconClassName}`} /> {label}
            </h3>
            <RichTextEditor
                content={value}
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
    );
}
