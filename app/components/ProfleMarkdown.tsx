import { MDXRemote } from "next-mdx-remote/rsc";
import { Suspense } from "react";

import { astToMarkdown, headingToText } from "../lib/markdown-sections";
import { fetchMarkdownSections } from "../lib/fetch-markdown";

// Componentes MDX padrão (sem os headings, que serão tratados separadamente)
const components = {
    p: (props: any) => <p className="my-3 text-lg leading-relaxed [&>*]:inline-block [&>*]:align-baseline [&>*]:mx-1" {...props} />,
    a: (props: any) => <a className="text-blue-500 hover:underline transition-colors" {...props} />,
    ul: (props: any) => <ul className="list-disc my-4 ml-6 space-y-2" {...props} />,
    ol: (props: any) => <ol className="list-decimal my-4 ml-6 space-y-2" {...props} />,
    li: (props: any) => <li className="my-2 text-lg [&>*]:inline [&>*]:mx-1" {...props} />,
    blockquote: (props: any) => <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic" {...props} />,
    code: (props: any) => <code className="bg-gray-200 dark:bg-gray-700 rounded px-2 py-1 text-sm" {...props} />,
    pre: (props: any) => <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-4 overflow-x-auto" {...props} />,
    img: (props: any) => <img className="my-4 rounded-lg max-w-full h-auto" {...props} />,
    strong: (props: any) => <strong className="font-bold" {...props} />,
    em: (props: any) => <em className="italic" {...props} />,
    table: (props: any) => <table className="table-auto border-collapse border border-gray-300 my-4 w-full" {...props} />,
    th: (props: any) => <th className="border border-gray-300 px-4 py-2 bg-gray-200 dark:bg-gray-700" {...props} />,
    td: (props: any) => <td className="border border-gray-300 px-4 py-2" {...props} />,
    tr: (props: any) => <tr className="hover:bg-gray-100 dark:hover:bg-gray-800" {...props} />,
    hr: (props: any) => <hr className="my-8 border-t border-gray-300 dark:border-gray-700" {...props} />,
    details: (props: any) => <details className="my-2" {...props} />,
    summary: (props: any) => <summary className="cursor-pointer font-bold" {...props} />,
    video: (props: any) => <video className="my-4 w-full rounded-lg" controls {...props} />,
    audio: (props: any) => <audio className="my-4 w-full" controls {...props} />,
}

function MarkdownSkeleton() {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-pulse space-y-6 p-8 max-w-4xl w-full">
                {/* Título principal */}
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                
                {/* Parágrafos */}
                <div className="space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mx-auto"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5 mx-auto"></div>
                </div>
            </div>
        </div>
    );
}

// Componente para renderizar uma seção individual
function MarkdownSection({ section, index }: { section: any; index: number }) {
    const headingText = headingToText(section.heading);
    const contentMarkdown = astToMarkdown(section.content);
    const level = section.level as 1 | 2 | 3 | 4 | 5 | 6;
    
    // Determina o tamanho do heading baseado no nível
    const headingClasses: Record<number, string> = {
        1: "text-5xl md:text-6xl font-bold mb-8",
        2: "text-4xl md:text-5xl font-bold mb-6",
        3: "text-3xl md:text-4xl font-bold mb-6",
        4: "text-2xl md:text-3xl font-bold mb-5",
        5: "text-xl md:text-2xl font-bold mb-4",
        6: "text-lg md:text-xl font-bold mb-4",
    };
    
    const headingClass = headingClasses[level] || "text-3xl font-bold mb-6";
    
    return (
        <section 
            className="min-h-screen w-full flex flex-col items-center justify-center snap-start snap-always px-6 py-12"
            id={`section-${index}`}
        >
            <div className="max-w-4xl w-full space-y-6">
                {/* Renderiza o heading */}
                {headingText && (
                    <h2 className={`${headingClass} text-center`}>
                        {headingText}
                    </h2>
                )}
                
                {/* Renderiza o conteúdo da seção */}
                {contentMarkdown && (
                    <div className="prose prose-lg dark:prose-invert mx-auto max-w-none">
                        <MDXRemote source={contentMarkdown} components={components} />
                    </div>
                )}
            </div>
        </section>
    );
}

export default async function ProfileMarkdown() {
    // Busca as seções do markdown
    const sections = await fetchMarkdownSections();

    return (
        <Suspense fallback={<MarkdownSkeleton />}>
            {sections.map((section, index) => (
                <MarkdownSection key={index} section={section} index={index} />
            ))}
        </Suspense>
    );
}