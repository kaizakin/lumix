CREATE TABLE "editor_documents" (
    "pod_id" UUID NOT NULL,
    "yjs_state" BYTEA NOT NULL DEFAULT ''::bytea,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "editor_documents_pkey" PRIMARY KEY ("pod_id")
);

ALTER TABLE "editor_documents"
ADD CONSTRAINT "editor_documents_pod_id_fkey"
FOREIGN KEY ("pod_id") REFERENCES "pods"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
