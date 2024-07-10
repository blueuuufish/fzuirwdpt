export default function convertImageToBase64(
  image: File,
  callback: (result: string) => void,
  errorCallback: (error: string) => void
): void {
  const reader = new FileReader();
  reader.readAsDataURL(image);

  reader.onload = () => {
    if (reader.result) {
      callback(reader.result.toString());
    } else {
      errorCallback("File conversion failed.");
    }
  };

  reader.onerror = () => {
    errorCallback("File conversion failed.");
  };
}
