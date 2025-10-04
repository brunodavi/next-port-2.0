import { MDXRemote } from "next-mdx-remote/rsc";
import { Suspense } from "react";

import { GITHUB_PROFILE_README_URL } from "../lib/constants";

const components = {
    h1: (props: any) => <h1 className="text-3xl font-bold my-4" {...props} />,
    h2: (props: any) => <h2 className="text-2xl font-bold my-4" {...props} />,
    h3: (props: any) => <h3 className="text-xl font-bold my-4" {...props} />,
    h4: (props: any) => <h4 className="text-lg font-bold my-4" {...props} />,
    h5: (props: any) => <h5 className="text-base font-bold my-4" {...props} />,
    h6: (props: any) => <h6 className="text-sm font-bold my-4" {...props} />,
    p: (props: any) => <p className="m-1" {...props} />,
    a: (props: any) => <a className="text-blue-500 hover:underline" {...props} />,
    ul: (props: any) => <ul className="list-disc list-inside my-2" {...props} />,
    ol: (props: any) => <ol className="list-decimal list-inside my-2" {...props} />,
    li: (props: any) => <li className="list-item list-inside my-2" {...props} />,
    blockquote: (props: any) => <blockquote className="border-l-4 border-gray-300 pl-4 my-4" {...props} />,
    code: (props: any) => <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />,
    pre: (props: any) => <pre className="bg-gray-100 rounded p-4 my-4 overflow-x-auto" {...props} />,
    img: (props: any) => <img className="my-4 rounded" {...props} />,
    strong: (props: any) => <strong className="font-bold" {...props} />,
    em: (props: any) => <em className="italic" {...props} />,
    table: (props: any) => <table className="table-auto border-collapse border border-gray-300 my-4" {...props} />,
    th: (props: any) => <th className="border border-gray-300 px-4 py-2 bg-gray-200" {...props} />,
    td: (props: any) => <td className="border border-gray-300 px-4 py-2" {...props} />,
    tr: (props: any) => <tr className="hover:bg-gray-100" {...props} />,
    hr: (props: any) => <hr className="my-4 border-t border-gray-300" {...props} />,
    details: (props: any) => <details className="my-2" {...props} />,
    summary: (props: any) => <summary className="cursor-pointer font-bold" {...props} />,
    video: (props: any) => <video className="my-4 w-full" controls {...props} />,
    audio: (props: any) => <audio className="my-4 w-full" controls {...props} />,
}

function MarkdownSkeleton() {
    return (
        <div className="animate-pulse space-y-6 p-6 bg-gray-800 rounded-lg">
            {/* Título principal */}
            <div className="h-8 bg-gray-700 rounded w-2/3"></div>
            
            {/* Parágrafos */}
            <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-4/5"></div>
            </div>

            {/* Subtítulo */}
            <div className="h-6 bg-gray-700 rounded w-1/2"></div>

            {/* Mais parágrafos */}
            <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
        </div>
    );
}

export default async function ProfileMarkdown() {
    const res = await fetch(GITHUB_PROFILE_README_URL, {
        headers: {
            'Cache-Control': 'no-cache'
        }
    });

    const source = await res.text();

    return (
        <Suspense fallback={<MarkdownSkeleton />}>
            <MDXRemote source={source} components={components} />
        </Suspense>
    );
}