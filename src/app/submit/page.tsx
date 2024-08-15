import { CursorForm } from "@/components/submit-cursor";

export default async function SubmitPage() {
  return (
    <div className="flex flex-col gap-10 items-center justify-center h-[60dvh]">
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-medium">Submit your cursor.</h2>
        <p className="text-sm dark:text-stone-300 text-stone-700">
          Help expand the community by uploading your cursors
        </p>
      </div>
      <CursorForm />
    </div>
  );
}
