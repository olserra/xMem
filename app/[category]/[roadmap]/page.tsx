'use client'

import SearchBar from "@/components/ui/SearchBar";
import { useEffect, useState } from "react";

interface Video {
    id: number;
    title: string;
    url: string;
}

interface Roadmap {
    title: string;
    videos: Video[];
}

interface RoadmapData {
    [key: string]: {
        [key: string]: Roadmap;
    };
}

const data: RoadmapData = {
    technical: {
        basic: {
            title: 'Top Technical Skills',
            videos: [
                { id: 1, title: 'Intro to Technical Skills', url: 'https://www.youtube.com/embed/dGcsHMXbSOA' },
                { id: 2, title: 'Advanced Technical Skills', url: 'https://www.youtube.com/embed/MhkGQAoc7bc' },
            ],
        },
    },
    social: {
        basic: {
            title: 'Top Social Skills',
            videos: [
                { id: 1, title: 'Intro to Social Skills', url: 'https://www.youtube.com/embed/dGcsHMXbSOA' },
                { id: 2, title: 'Advanced Social Skills', url: 'https://www.youtube.com/embed/MhkGQAoc7bc' },
            ],
        },
    },
    leadership: {
        basic: {
            title: 'Top Leadership Skills',
            videos: [
                { id: 1, title: 'Intro to Leadership Skills', url: 'https://www.youtube.com/embed/dGcsHMXbSOA' },
                { id: 2, title: 'Advanced Leadership Skills', url: 'https://www.youtube.com/embed/MhkGQAoc7bc' },
            ],
        },
    },
    communication: {
        basic: {
            title: 'Top Communication Skills',
            videos: [
                { id: 1, title: 'Intro to Communication Skills', url: 'https://www.youtube.com/embed/dGcsHMXbSOA' },
                { id: 2, title: 'Advanced Communication Skills', url: 'https://www.youtube.com/embed/MhkGQAoc7bc' },
            ],
        },
    },
    management: {
        basic: {
            title: 'Top Management Skills',
            videos: [
                { id: 1, title: 'Intro to Management Skills', url: 'https://www.youtube.com/embed/dGcsHMXbSOA' },
                { id: 2, title: 'Advanced Management Skills', url: 'https://www.youtube.com/embed/MhkGQAoc7bc' },
            ],
        },
    },
    analytical: {
        basic: {
            title: 'Top Analytical Skills',
            videos: [
                { id: 1, title: 'Intro to Analytical Skills', url: 'https://www.youtube.com/embed/dGcsHMXbSOA' },
                { id: 2, title: 'Advanced Analytical Skills', url: 'https://www.youtube.com/embed/MhkGQAoc7bc' },
            ],
        },
    },
    creative: {
        basic: {
            title: 'Top Creative Skills',
            videos: [
                { id: 1, title: 'Intro to Creative Skills', url: 'https://www.youtube.com/embed/dGcsHMXbSOA' },
                { id: 2, title: 'Advanced Creative Skills', url: 'https://www.youtube.com/embed/MhkGQAoc7bc' },
            ],
        },
    },
    interpersonal: {
        basic: {
            title: 'Top Interpersonal Skills',
            videos: [
                { id: 1, title: 'Intro to Interpersonal Skills', url: 'https://www.youtube.com/embed/dGcsHMXbSOA' },
                { id: 2, title: 'Advanced Interpersonal Skills', url: 'https://www.youtube.com/embed/MhkGQAoc7bc' },
            ],
        },
    },
    'self-management': {
        basic: {
            title: 'Top Self-Management Skills',
            videos: [
                { id: 1, title: 'Intro to Self-Management Skills', url: 'https://www.youtube.com/embed/dGcsHMXbSOA' },
                { id: 2, title: 'Advanced Self-Management Skills', url: 'https://www.youtube.com/embed/MhkGQAoc7bc' },
            ],
        },
    },
    adaptive: {
        basic: {
            title: 'Top Adaptive Skills',
            videos: [
                { id: 1, title: 'Intro to Adaptive Skills', url: 'https://www.youtube.com/embed/dGcsHMXbSOA' },
                { id: 2, title: 'Advanced Adaptive Skills', url: 'https://www.youtube.com/embed/MhkGQAoc7bc' },
            ],
        },
    },
    negotiation: {
        basic: {
            title: 'Top Negotiation Skills',
            videos: [
                { id: 1, title: 'Intro to Negotiation Skills', url: 'https://www.youtube.com/embed/dGcsHMXbSOA' },
                { id: 2, title: 'Advanced Negotiation Skills', url: 'https://www.youtube.com/embed/MhkGQAoc7bc' },
            ],
        },
    },
    'customer-service': {
        basic: {
            title: 'Top Customer Service Skills',
            videos: [
                { id: 1, title: 'Intro to Customer Service Skills', url: 'https://www.youtube.com/embed/dGcsHMXbSOA' },
                { id: 2, title: 'Advanced Customer Service Skills', url: 'https://www.youtube.com/embed/MhkGQAoc7bc' },
            ],
        },
    },
};

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
        <div className="flex flex-col justify-center text-center gap-6">
            <h1 className="mt-10 text-2xl">{roadmapData.title}</h1>
            <SearchBar videos={roadmapData.videos} onFilter={setFilteredVideos} />
            <div className="flex flex-col justify-center gap-6 md:flex-row flex-wrap">
                {filteredVideos.map((video) => (
                    <div key={video.id}>
                        <h2>{video.title}</h2>
                        <iframe
                            width="360"
                            height="215"
                            src={video.url}
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoadmapPage;