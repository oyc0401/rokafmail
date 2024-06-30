import crypto from "crypto";

export function sha256(text: string) {
  const encryptedText = crypto
    .createHash("sha256")
    .update(text)
    .digest("hex");

  return encryptedText;
}