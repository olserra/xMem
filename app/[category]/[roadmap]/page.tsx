'use client'

import { Video, Roadmap, data } from "@/app/data/youtube";
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

    return (
        <div className="flex flex-col justify-center text-center gap-6 mx-8 md:mx-40">
            <h1 className="mt-10 text-2xl">{roadmapData.title}</h1>
            <SearchBar videos={roadmapData.videos} onFilterVideos={setFilteredVideos} />
            <div className="video-container grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                    <div key={video.id} className="video-item flex flex-col items-center mb-6 border border-1 border-gray-400 rounded-lg gap-5">
                        <iframe
                            width="100%"
                            height="215"
                            src={video.url}
                            allowFullScreen
                            className="mx-8 rounded-t-lg shadow-lg"
                        ></iframe>
                        <h2 className="text-base pb-4">{video.title}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoadmapPage;
