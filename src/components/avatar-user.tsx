import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarUser({
  image,
  name,
  w = "w-8",
  h = "h-8",
}: {
  image: string;
  name: string;
  w?: string;
  h?: string;
}) {
  return (
    <Avatar w={w} h={h}>
      <AvatarImage src={image} />
      <AvatarFallback>{name ? name.charAt(0) : "?"}</AvatarFallback>
    </Avatar>
  );
}
