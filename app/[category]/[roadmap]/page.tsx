// src/app/[category]/[roadmap]/page.tsx
interface Video {
    id: number;
    title: string;
    url: string;
}

interface Roadmap {
    title: string;
    videos: Video[];
}

interface RoadmapPageProps {
    params: { category: string; roadmap: string };
}

const RoadmapPage = async ({ params }: RoadmapPageProps) => {
    const roadmap: Roadmap = {
        title: 'Learn React',
        videos: [
            { id: 1, title: 'Intro to React', url: 'https://www.youtube.com/embed/dGcsHMXbSOA' },
            { id: 2, title: 'React Components', url: 'https://www.youtube.com/embed/MhkGQAoc7bc' },
        ],
    };

    return (
        <div>
            <h1>{roadmap.title}</h1>
            <div>
                {roadmap.videos.map((video) => (
                    <div key={video.id}>
                        <h2>{video.title}</h2>
                        <iframe
                            width="560"
                            height="315"
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
