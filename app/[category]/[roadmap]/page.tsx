'use client'

import { Video, Roadmap, data } from "@/app/data/YouTubeData";
import SearchBar from "@/components/ui/SearchBar";
import { useEffect, useState } from "react";

interface RoadmapPageProps {
    params: { category: string; roadmap: string };
}

const getRoadmapData = (category: string, roadmap: string): Roadmap => {
    return data[category]?.[roadmap] || { title: 'Not Found', videos: [] };
};

const RoadmapPage: React.FC<RoadmapPageProps> = ({ params }) => {
    const { category, roadmap } = params;
    const initialData = getRoadmapData(category, roadmap);

    const [roadmapData, setRoadmapData] = useState<Roadmap>(initialData);
    const [filteredVideos, setFilteredVideos] = useState<Video[]>(initialData.videos);

    useEffect(() => {
        const fetchedData = getRoadmapData(category, roadmap);
        setRoadmapData(fetchedData);
        setFilteredVideos(fetchedData.videos);
    }, [category, roadmap]);

    const chunkArray = (array: Video[], size: number) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    const videoRows = chunkArray(filteredVideos, 3);

    return (
        <div className="flex flex-col justify-center text-center gap-6">
            <h1 className="mt-10 text-2xl">{roadmapData.title}</h1>
            <SearchBar videos={roadmapData.videos} onFilter={setFilteredVideos} />
            <div className="flex flex-col justify-center gap-6">
                {videoRows.map((videoRow, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-6">
                        {videoRow.map((video) => (
                            <div key={video.id} className="flex flex-col items-center">
                                <h2 className="text-lg">{video.title}</h2>
                                <iframe
                                    width="360"
                                    height="215"
                                    src={video.url}
                                    allowFullScreen
                                    className="rounded-lg shadow-lg"
                                ></iframe>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoadmapPage;
