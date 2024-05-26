// src/app/[category]/page.tsx
import Link from 'next/link';

interface Roadmap {
    id: number;
    slug: string;
    title: string;
    category: string;
}

interface CategoryPageProps {
    params: { category: string };
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
    const roadmaps: Roadmap[] = [
        { id: 1, slug: 'react', title: 'Learn React', category: params.category },
        { id: 2, slug: 'vue', title: 'Learn Vue', category: params.category },
    ];

    return (
        <div>
            <h1>Category: {params.category}</h1>
            <div>
                {roadmaps.map((roadmap) => (
                    <Link key={roadmap.id} href={`/${roadmap.category}/${roadmap.slug}`}>
                        <div className="card">{roadmap.title}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;
