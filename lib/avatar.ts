export const randomUserImage = () => {
  const seed = crypto.randomUUID();
  return `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${seed}`;
};
