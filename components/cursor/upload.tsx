"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useRouter } from "next/navigation";

type UploadCursorForm = {
  name: string;
  description?: string;
  cover: FileList;
  file: FileList;
};

export default function UploadCursor() {
  const { register, handleSubmit, reset } = useForm<UploadCursorForm>();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: UploadCursorForm) => {
      const res = await api.cursor.post.post({
        name: data.name,
        description: data.description,
        cover: data.cover[0],
        file: data.file[0],
      });

      const result = res.data;

      if (!result) {
        throw new Error("No data returned from server");
      }

      if ("error" in result) {
        throw new Error(result.error || "Upload failed");
      }

      return result;
    },
    onSuccess: (data) => {
      reset();
      router.push(`/cursor/${data.id}`);
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="flex flex-col gap-5"
    >
      <div className="space-y-1 w-full">
        <Label htmlFor="name" className="text-lg font-bold">
          Name
        </Label>
        <Input
          id="name"
          placeholder="MacOS Monterey"
          {...register("name", { required: true })}
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-1 w-full">
        <Label htmlFor="description" className="text-lg font-bold">
          Description
        </Label>
        <Input
          id="description"
          placeholder="Clean MacOS style cursor"
          {...register("description")}
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="cover" className="text-lg font-bold">
          Cover image
        </Label>
        <Input
          id="cover"
          type="file"
          accept="image/*"
          {...register("cover", { required: true })}
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="file" className="text-lg font-bold">
          Cursor file (.zip / .rar)
        </Label>
        <Input
          id="file"
          type="file"
          accept=".zip,.rar"
          {...register("file", { required: true })}
          className="h-12 text-base"
        />
      </div>

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full"
        size={"lg"}
      >
        {mutation.isPending ? "Uploading..." : "Upload cursor"}
      </Button>

      {mutation.isError && (
        <p className="text-sm text-red-500">
          {(mutation.error as Error).message}
        </p>
      )}
    </form>
  );
}
