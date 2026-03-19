namespace WhatsappQrApi.DTO.Requests
{
    public class GenerateQrCodeRequest
    {
        public string PhoneNumber { get; set; }
        public string Message { get; set; }
    }
}
