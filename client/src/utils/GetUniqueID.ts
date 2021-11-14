export default function getUniqueID() {
  const id = (
    Date.now().toString(36) + Math.random().toString(36).slice(2)
  ).toUpperCase();
  return id;
}
