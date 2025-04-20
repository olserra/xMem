"use client";

import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import ContentAnalysis from "@/app/components/ContentAnalysis";

export default function AnalysisPage() {

    return (
        <MaxWidthWrapper>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-6">Content Analysis & Organization</h1>
                <ContentAnalysis />
            </div>
        </MaxWidthWrapper>
    );
} 