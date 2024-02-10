const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(service, playslistService, validator) {
    this._service = service;
    this._playslistService = playslistService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playslistService.verifyPlaylistAccess(id, credentialId);

    const message = {
      playlistId: id,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage(
      'export:playlists',
      JSON.stringify(message),
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
