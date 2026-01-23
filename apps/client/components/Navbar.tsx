
import Image from "next/image";
import Link from "next/link";
import ArrowNarrowRightDashedIcon from "./ui/arrow-narrow-right-dashed-icon";

export const Navbar = () => {
    return (
        <nav className="w-full py-2 px-8 md:px-50 fixed left-0 right-0 top-0 bg-[#faf7f3]/70 backdrop-blur-xl flex items-center justify-between z-50 border-b border-neutral-200">
            <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center">
                    <Image src={"/lumixlogo.png"} alt="L" width={"30"} height={"30"}></Image>
                </div>
                <span className="text-neutral-500 text-2xl">Lumix</span>
            </Link>


            <div className="flex items-center space-x-4">
                <Link href="/login" className="text-sm font-medium text-neutral-600 transition-colors">
                    Log in
                </Link>
                <Link
                    href="/signup"
                    className="inline-flex items-center gap-1 text-sm font-medium bg-white text-black px-4 py-2 rounded-md hover:bg-teal-200 group hover:text-black transition-all"
                >
                    Create Profile
                    <ArrowNarrowRightDashedIcon />
                </Link>
            </div>
        </nav>
    );
};

