export default function convertImageToBase64(
  image: File,
  callback: (result: string | null) => void,
  errorCallback: (error: string) => void
): void {
  const reader = new FileReader();
  reader.readAsDataURL(image);

  reader.onload = () => {
    callback(reader.result?.toString() || null);
  };
  reader.onerror = () => {
    errorCallback("File conversion failed.");
  };
}
