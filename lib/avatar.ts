export const randomUserImage = () => {
  const randomSeed = Math.floor(Math.random() * 6);
  return `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=avatar-${randomSeed}`;
};
