import { File, FolderPlus, Image as ImageIcon, Upload } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  createMediaFolderAction,
  deleteMediaAction,
  renameMediaAction,
  uploadMediaAction,
} from "@/lib/admin/actions";
import { createClient } from "@/lib/supabase/server";

export default async function MediaPage() {
  const supabase = await createClient();
  const [{ data: folders }, { data: assets }] = await Promise.all([
    supabase.from("media_folders").select("*").order("path"),
    supabase
      .from("media_assets")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);
  const publicBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}/storage/v1/object/public/platform-media`;
  return (
    <div>
      <PageHeader
        title="Media manager"
        description="Upload, validate, organize, rename, preview, and remove platform media stored in Supabase Storage."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
          <h2 className="flex items-center gap-2 font-semibold">
            <Upload className="size-5 text-blue-700" /> Upload media
          </h2>
          <form action={uploadMediaAction} className="mt-5 grid gap-4">
            <label className="text-sm font-semibold">
              File
              <input
                name="file"
                type="file"
                required
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                className="mt-2 block w-full rounded-lg border bg-slate-50 p-3 text-sm dark:bg-slate-900"
              />
            </label>
            <label className="text-sm font-semibold">
              Folder
              <select
                name="folder"
                className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
              >
                <option value="uploads">Uploads</option>
                {folders?.map((folder) => (
                  <option key={folder.id} value={folder.path}>
                    {folder.path}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Alt text
              <input
                name="alt_text"
                className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
              />
            </label>
            <p className="text-xs text-slate-500">
              JPEG, PNG, WebP, GIF, or PDF. Maximum 10 MB.
            </p>
            <SubmitButton pending="Uploading…">Upload file</SubmitButton>
          </form>
        </section>
        <section className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
          <h2 className="flex items-center gap-2 font-semibold">
            <FolderPlus className="size-5 text-blue-700" /> Folders
          </h2>
          <form
            action={createMediaFolderAction}
            className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <input
              name="name"
              required
              placeholder="Folder name"
              className="rounded-lg border bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900"
            />
            <input
              name="parent_path"
              placeholder="Parent path (optional)"
              className="rounded-lg border bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900"
            />
            <button className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white">
              Create
            </button>
          </form>
          <div className="mt-5 flex flex-wrap gap-2">
            {folders?.map((folder) => (
              <span
                key={folder.id}
                className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium dark:bg-slate-800"
              >
                {folder.path}
              </span>
            ))}
          </div>
        </section>
      </div>
      <section className="mt-6">
        <h2 className="font-semibold">Media library</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {assets?.map((asset) => {
            const previewUrl = `${publicBase}/${asset.storage_path}`;
            return (
              <article
                key={asset.id}
                className="overflow-hidden rounded-2xl border bg-white dark:bg-slate-950"
              >
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-36 place-items-center bg-slate-100 dark:bg-slate-900"
                >
                  {asset.mime_type.startsWith("image/") ? (
                    <ImageIcon className="size-10 text-blue-600" />
                  ) : (
                    <File className="size-10 text-slate-500" />
                  )}
                  <span className="sr-only">Preview {asset.name}</span>
                </a>
                <div className="p-4">
                  <p className="truncate text-sm font-semibold">{asset.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {asset.mime_type} ·{" "}
                    {(Number(asset.size_bytes) / 1024).toFixed(1)} KB
                  </p>
                  <form action={renameMediaAction} className="mt-4 flex gap-2">
                    <input type="hidden" name="id" value={asset.id} />
                    <input
                      name="name"
                      defaultValue={asset.name}
                      className="min-w-0 flex-1 rounded-lg border bg-slate-50 px-2 py-1.5 text-xs dark:bg-slate-900"
                    />
                    <SubmitButton
                      pending="Renaming…"
                      className="text-xs font-semibold text-blue-700 disabled:opacity-50"
                    >
                      Rename
                    </SubmitButton>
                  </form>
                  <form action={deleteMediaAction} className="mt-3">
                    <input type="hidden" name="id" value={asset.id} />
                    <input
                      type="hidden"
                      name="path"
                      value={asset.storage_path}
                    />
                    <SubmitButton
                      pending="Deleting…"
                      className="text-xs font-semibold text-red-600 disabled:opacity-50"
                    >
                      Delete media
                    </SubmitButton>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
        {!assets?.length ? (
          <p className="mt-4 rounded-2xl border border-dashed p-10 text-center text-sm text-slate-500">
            No media uploaded.
          </p>
        ) : null}
      </section>
    </div>
  );
}
