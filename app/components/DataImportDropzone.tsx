import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2 } from 'lucide-react';

interface DataImportDropzoneProps {
    onImport: (files: File[]) => Promise<void>;
    isImporting: boolean;
}

const DataImportDropzone = ({ onImport, isImporting }: DataImportDropzoneProps) => {
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        try {
            setError(null);
            await onImport(acceptedFiles);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import files');
        }
    }, [onImport]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/*': ['.txt', '.csv', '.json', '.md', '.log'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
            'application/json': ['.json'],
            'text/csv': ['.csv'],
        },
        multiple: true,
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}
            >
                <input {...getInputProps()} />
                {isImporting ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p className="text-gray-600">Importing files...</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-lg font-medium">
                            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                        </p>
                        <p className="text-sm text-gray-500">
                            or click to select files
                        </p>
                        <p className="text-xs text-gray-400">
                            Supported formats: TXT, CSV, JSON, PDF, DOC, DOCX, Images
                        </p>
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default DataImportDropzone; 