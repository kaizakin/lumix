CREATE TABLE "canvas_documents" (
    "pod_id" UUID NOT NULL,
    "canvas_state" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "canvas_documents_pkey" PRIMARY KEY ("pod_id")
);

ALTER TABLE "canvas_documents"
ADD CONSTRAINT "canvas_documents_pod_id_fkey"
FOREIGN KEY ("pod_id") REFERENCES "pods"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
