"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputFile } from "./input-file";
import { InputCover } from "./input-cover";
import { useState } from "react";

interface ErrorResponse {
  error: string;
}

const imageFileTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "The name must be at least 4 characters." })
    .max(32),
  file: z
    .any()
    .refine(
      (file) =>
        file instanceof File &&
        (file.name.endsWith(".zip") || file.name.endsWith(".rar")),
      {
        message: "You must upload a .zip or .rar file.",
      }
    ),
  cover: z
    .any()
    .refine(
      (file) => file instanceof File && imageFileTypes.includes(file.type),
      {
        message: "You must upload a valid image file (jpg, png, gif, webp).",
      }
    ),
});

export function CursorForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      file: undefined,
      cover: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true); // Activar el estado de envío
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("file", values.file);
    formData.append("cover", values.cover);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success(response.data.msg);
        router.push("/");
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.data) {
        const responseData = axiosError.response.data as ErrorResponse;
        toast.error(responseData.error);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false); // Desactivar el estado de envío
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name of the cursor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload File</FormLabel>
              <FormControl>
                <InputFile
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>
                Note: your cursor must be compressed in a .zip or .rar file
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cover"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Cover Image</FormLabel>
              <FormControl>
                <InputCover
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
