import { authenticator } from "otplib";
import QRCode from "qrcode";

export function generateTwoFactorSecret(email: string) {
  const secret = authenticator.generateSecret();

  const otpauthUrl = authenticator.keyuri(
    email,
    "Nutrição em Movimento",
    secret
  );

  return {
    secret,
    otpauthUrl,
  };
}

export async function generateQRCodeDataUrl(otpauthUrl: string) {
  return QRCode.toDataURL(otpauthUrl);
}

export function verifyTwoFactorToken(token: string, secret: string) {
  return authenticator.check(token, secret);
}