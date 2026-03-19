using QRCoder;
using WhatsappQrApi.DTO.Requests;
using WhatsappQrApi.DTO.Responses;

namespace WhatsappQrApi.Services
{
    public class QrCodeService : IQrCodeService
    {
        public GenerateQrCodeResponse GenerateQrCode(GenerateQrCodeRequest request) 
        {
            string encodedMessage = Uri.EscapeDataString(request.Message);

            string whatsappUrl = $"https://wa.me/{request.PhoneNumber}?text={encodedMessage}";

            QRCodeGenerator generator = new QRCodeGenerator();

            QRCodeData data = generator.CreateQrCode(whatsappUrl, QRCodeGenerator.ECCLevel.Q);

            PngByteQRCode qrCode = new PngByteQRCode(data);

            byte[] qrImage = qrCode.GetGraphic(20);

            string base64 = Convert.ToBase64String(qrImage);

            return new GenerateQrCodeResponse
            {
                ImageBase64 = base64
            };
        }
    }
}
