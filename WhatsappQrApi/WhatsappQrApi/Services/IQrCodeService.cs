using WhatsappQrApi.DTO.Requests;
using WhatsappQrApi.DTO.Responses;

namespace WhatsappQrApi.Services
{
    public interface IQrCodeService
    {
        GenerateQrCodeResponse GenerateQrCode(GenerateQrCodeRequest request);
    }
}
