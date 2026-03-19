using Microsoft.AspNetCore.Mvc;
using WhatsappQrApi.DTO.Requests;
using WhatsappQrApi.Services;

namespace WhatsappQrApi.Controllers
{
    [ApiController]
    [Route("api/qrcode")]
    public class QrCodeController : ControllerBase
    {
        private readonly IQrCodeService _qrCodeService;

        public QrCodeController(IQrCodeService qrCodeService)
        {
            _qrCodeService = qrCodeService;
        }

        [HttpPost]
        public IActionResult Generate([FromBody] GenerateQrCodeRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.PhoneNumber) ||
                string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("Número ou mensagem inválidos");
            }

            var result = _qrCodeService.GenerateQrCode(request);

            return Ok(result);
        }
    }
}
