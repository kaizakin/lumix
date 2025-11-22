import { IconArrowBackUp } from "@tabler/icons-react"

export const BackButton = () => {
    return <button className="flex items-center bg-gradient-to-b from-gray-500 to-gray-600 hover:to-gray-50/50 text-white p-1 rounded-sm cursor-pointer w-max justify-center px-2 gap-2 shadow-xs">
        <IconArrowBackUp size={20} className="text-black" />
        Dashboard
    </button>
}
