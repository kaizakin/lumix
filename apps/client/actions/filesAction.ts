"use server"

import { v4 as uuid } from "uuid"
import { prisma } from "@repo/db"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function uploadFileAction(formData: FormData) {
    const file = formData.get("file") as File
    const podId = formData.get("pod") as string


    if (!file) {
        return { success: false, message: "No file!" }
    }

    const fileId = uuid()
    const path = `pods/${podId}/${fileId}-${file.name}`

    const { error } = await supabase.storage
        .from("pod-files")
        .upload(path, file, {
            contentType: file.type
        })

    if (error) return { success: false, message: "upload failed" }


    try {
        const res = await prisma.podFile.create({
            data: {
                podId: podId,
                fileName: file.name,
                fileSize: file.size.toString(),
                fileId: fileId
            }
        })

        return { success: true, message: "file Uploaded successfully!" }
    } catch (err) {
        console.log(err)
        return { success: false, message: "upload failed in db!" }
    }
}

export async function downloadFileAction(fileId: string, podId: string) {
    const file = await prisma.podFile.findUnique({
        where: {
            id: fileId
        }
    })

    if (!file) return;

    const filePath = `pods/${podId}/${file.fileId}-${file.fileName}`

    const { data, error } = await supabase.storage
        .from("pod-files")
        .createSignedUrl(filePath, 60, {
            download: file.fileName
        }) // valid for 60 secs

    if (error) {
        console.log(error);
        return null;
    }

    return data.signedUrl
}
