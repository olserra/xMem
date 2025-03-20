"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { FaRegCopy, FaTrash, FaPen } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { useUser } from "@/app/contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Data, DataType } from "@/app/types/_data";
import { useSession } from 'next-auth/react';
import DataCard from '@/app/components/DataCard';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import DataImportDropzone from '@/app/components/DataImportDropzone';

const Data = () => {
    const {
        data = [],
        filterLabel,
        bearerToken,
        userId,
        updateData,
        refreshData,
        isLoading
    } = useUser();

    useEffect(() => {
        console.log('Current data:', data);
        console.log('Loading state:', isLoading);
    }, [data, isLoading]);

    const { status } = useSession();
    const router = useRouter();
    const [importedData, setImportedData] = useState<string>("");
    const [isCopied, setIsCopied] = useState(false);
    const [selectedData, setSelectedData] = useState<Set<string>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
    const [allTags, setAllTags] = useState<string[]>([]);
    const [isImporting, setIsImporting] = useState(false);

    // Extract all unique tags from data
    useEffect(() => {
        const tags = new Set<string>();
        if (Array.isArray(data)) {
            data.forEach(_data => {
                if (_data.metadata?.tags) {
                    _data.metadata.tags.forEach(tag => tags.add(tag));
                }
            });
        }
        setAllTags(Array.from(tags));
    }, [data]);

    const handleCopyToClipboard = useCallback(() => {
        setIsCopied(true);
        const allUserData = JSON.stringify(data);
        navigator.clipboard.writeText(allUserData)
            .then(() => console.log('User data copied to clipboard'))
            .catch(err => console.error('Failed to copy user data:', err));

        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }, [data]);

    const handleDeleteData = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/data/${id}?userId=${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
            });

            if (response.ok) {
                // Only update local state, don't trigger refresh
                updateData(data.filter((m) => m.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete data.");
        }
    }, [data, userId, bearerToken, updateData]);

    const handleDeleteSelectedData = useCallback(async () => {
        try {
            const deletePromises = Array.from(selectedData).map((id) =>
                fetch(`/api/data/${id}?userId=${userId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                    },
                })
            );
            const responses = await Promise.all(deletePromises);

            if (responses.every((response) => response.ok)) {
                // Only update local state, don't trigger refresh
                updateData(data.filter((m) => !selectedData.has(m.id)));
                setSelectedData(new Set());
            }
        } catch (err) {
            console.error("Failed to delete selected data.");
        }
    }, [data, selectedData, userId, bearerToken, updateData]);

    const handleImportData = useCallback(async (files: File[]) => {
        setIsImporting(true);
        setIsModalOpen(false);

        try {
            const importPromises = files.map(async (file) => {
                const content = await file.text();
                const type = getDataTypeFromFile(file);

                return {
                    content,
                    type,
                    userId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    version: 1,
                    isArchived: false,
                    metadata: {
                        mimeType: file.type,
                        size: file.size,
                        fileName: file.name
                    }
                };
            });

            const newData = await Promise.all(importPromises);

            const response = await fetch("/api/_data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({ data: newData, userId }),
            });

            if (response.ok) {
                const responseData = await response.json();
                updateData([...(Array.isArray(data) ? data : []), ...responseData]);
            } else {
                throw new Error('Failed to import data');
            }
        } catch (err) {
            console.error("Failed to import data:", err);
            throw err;
        } finally {
            setIsImporting(false);
        }
    }, [userId, bearerToken, data, updateData]);

    const getDataTypeFromFile = (file: File): DataType => {
        const mimeType = file.type;
        if (mimeType.startsWith('image/')) return 'IMAGE';
        if (mimeType === 'application/pdf') return 'DOCUMENT';
        if (mimeType === 'application/msword' ||
            mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return 'DOCUMENT';
        }
        if (mimeType === 'text/csv') return 'TEXT';
        if (mimeType === 'application/json') return 'TEXT';
        return 'TEXT'; // Default to TEXT for other file types
    };

    const handleEditData = useCallback((_data: Data) => {
        const queryParams = new URLSearchParams({
            id: _data.id,
            content: _data.content,
            projectId: _data.projectId || "",
            tags: _data.metadata?.tags?.join(',') || "",
        }).toString();

        router.push(`/dashboard/data/create?${queryParams}`);
    }, [router]);

    const filteredData = useMemo(() => {
        if (!Array.isArray(data)) return [];
        return data.filter(_data => {
            const searchTerm = filterLabel.toLowerCase();
            const contentMatch = _data.content.toLowerCase().includes(searchTerm);
            const tagsMatch = _data.metadata?.tags?.some(tag =>
                tag.toLowerCase().includes(searchTerm)
            );
            return contentMatch || tagsMatch;
        });
    }, [data, filterLabel]);

    const toggleSelection = useCallback((id: string) => {
        setSelectedData(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    }, []);

    const toggleSelectAll = useCallback(() => {
        if (selectedData.size === filteredData.length) {
            setSelectedData(new Set());
        } else {
            setSelectedData(new Set(filteredData.map(_data => _data.id)));
        }
    }, [filteredData, selectedData]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tag)) {
                newSet.delete(tag);
            } else {
                newSet.add(tag);
            }
            return newSet;
        });
    };

    if (status === 'loading') {
        return (
            <MaxWidthWrapper>
                <div className="py-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="border border-gray-300 rounded-lg p-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
        );
    }

    return (
        <MaxWidthWrapper>
            <div className="py-6">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Data</h1>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/dashboard/data/create"
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
                        >
                            Create Data
                        </Link>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Import Data
                        </button>
                        <button
                            onClick={handleCopyToClipboard}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            title="Copy all data to clipboard"
                        >
                            <FaRegCopy />
                            {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                        {selectedData.size > 0 && (
                            <button
                                onClick={handleDeleteSelectedData}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                <FaTrash />
                                Delete Selected ({selectedData.size})
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData.map((_data) => (
                        <DataCard
                            key={_data.id}
                            _data={_data}
                            onClick={() => handleEditData(_data)}
                            isSelected={selectedData.has(_data.id)}
                            onSelect={(checked) => toggleSelection(_data.id)}
                            onDelete={handleDeleteData}
                        />
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">Import Data</h2>
                        <DataImportDropzone
                            onImport={handleImportData}
                            isImporting={isImporting}
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-black"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MaxWidthWrapper>
    );
};

export default Data;
