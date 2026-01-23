// components/StarButton.tsx
import { getRepoStars } from '@/lib/get-repo-stars';
import GithubIcon from './ui/github-icon';
import { Star } from 'lucide-react';

export default async function GithubButton() {
    const stars = await getRepoStars('kaizakin', 'lumix');

    return (
        <a
            href="https://github.com/kaizakin/lumix"
            target="_blank"
            className="flex items-center gap-2 h-12 bg-neutral-900 px-4 py-2 text-white rounded-md hover:bg-gray-800 transition-colors"
        >
            <GithubIcon />
            <span>Open Source</span>


            <span className="inline-flex gap-1  items-center pl-2 border-l border-gray-700 ml-1 font-mono text-yellow-400">
                {stars.toLocaleString()}
                <Star className='h-4 w-4' />
            </span>
        </a>
    );
}