import { IconArrowBackUp } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

export const BackButton = () => {
    const router = useRouter();

    return <div className="flex items-center w-max justify-center">
        <button
            className="relative overflow-hidden group flex bg-linear-to-r from-white to-teal-600 hover:to-white text-black p-1 rounded-sm cursor-pointer px-2 gap-2 shadow-xs"
            onClick={() => router.push("/dashboard")}>

            <IconArrowBackUp size={20} className="text-black" />
            Dashboard
        </button>
    </div>
}
