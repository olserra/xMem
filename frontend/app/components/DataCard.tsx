import { FaPen, FaTrash } from 'react-icons/fa';
import { Data } from '@/app/types/_data';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Checkbox } from '@radix-ui/react-checkbox';

interface DataCardProps {
    _data: Data;
    onClick: () => void;
    isSelected?: boolean;
    onSelect?: (checked: boolean) => void;
    onDelete?: (id: string) => void;
}

const DataCard = ({ _data, onClick, isSelected = false, onSelect, onDelete }: DataCardProps) => {
    // Ensure the data has the correct type
    if (!_data || typeof _data !== 'object') {
        return null;
    }

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect?.(!isSelected);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(_data.id);
    };

    return (
        <div
            className={cn(
                "bg-white border rounded-lg p-4 cursor-pointer flex flex-col transition-all duration-200",
                "hover:border-black hover:scale-[1.02]",
                isSelected && "border-black bg-gray-50"
            )}
            onClick={onClick}
        >
            <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                    <Checkbox
                        checked={isSelected}
                        onClick={handleCheckboxClick}
                        className="mt-1"
                    />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-medium truncate">{_data.content.substring(0, 100)}...</h3>
                            <div className="flex gap-2">
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <FaPen className="text-gray-600" />
                                </button>
                                <button
                                    className="p-1 hover:bg-gray-100 rounded"
                                    onClick={handleDeleteClick}
                                >
                                    <FaTrash className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t items-center justify-between">
                <div className="flex flex-wrap gap-1">
                    {_data.metadata?.tags && _data.metadata.tags.length > 0 && (
                        _data.metadata.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                            >
                                {tag}
                            </Badge>
                        ))
                    )}
                </div>
                <div className="text-xs text-gray-500">
                    {new Date(_data.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default DataCard; 