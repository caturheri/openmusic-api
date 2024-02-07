const autoBind = require('auto-bind');

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const songId = await this._service.addSong(request.payload);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(req, h) {
    const { title = null, performer = null } = req.query;
    const songs = await this._service.getSongs(title, performer);
    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  }

  async getSongByIdHandler(req, h) {
    const { id } = req.params;
    const song = await this._service.getSongById(id);
    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });
    response.code(200);
    return response;
  }

  async putSongByIdHandler(req, h) {
    this._validator.validateSongPayload(req.payload);
    const { id } = req.params;
    await this._service.editSongById(id, req.payload);
    const response = h.response({
      status: 'success',
      message: 'Song berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  async deleteSongByIdHandler(req, h) {
    const { id } = req.params;
    await this._service.deleteSongById(id);
    const response = h.response({
      status: 'success',
      message: 'Song berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = SongHandler;
