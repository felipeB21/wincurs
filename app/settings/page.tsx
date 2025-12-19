import EditProfile from "@/components/auth/edit-profile";
import { SettingsIcon } from "@/components/settings-icon";

export default function SettingsPage() {
  const title = "Settings";
  const description = "Edit your profile";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h2 className="text-4xl font-bold lg:text-6xl">{title}</h2>
        <SettingsIcon />
      </div>

      <p className="max-w-3xl text-muted-foreground lg:text-xl">
        {description}
      </p>

      <EditProfile />
    </div>
  );
}
