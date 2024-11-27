const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './music_streaming.proto';

// Carregando o arquivo proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const musicProto = grpc.loadPackageDefinition(packageDefinition).musicstreaming;

// Dados fictícios
const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
];

const songs = [
  { id: 1, name: 'Song A', artist: 'Artist X' },
  { id: 2, name: 'Song B', artist: 'Artist Y' },
];

const playlists = [
  { id: 1, name: 'Playlist 1', userId: 1, songIds: [1, 2] },
  { id: 2, name: 'Playlist 2', userId: 2, songIds: [1] },
];

// Implementação dos métodos
const server = new grpc.Server();

server.addService(musicProto.MusicService.service, {
  ListUsers: (_, callback) => {
    callback(null, { users });
  },
  ListSongs: (_, callback) => {
    callback(null, { songs });
  },
  ListPlaylistsByUser: (call, callback) => {
    const userId = call.request.id;
    const userPlaylists = playlists.filter(p => p.userId === userId);
    callback(null, { playlists: userPlaylists });
  },
  ListSongsByPlaylist: (call, callback) => {
    const playlistId = call.request.id;
    const playlist = playlists.find(p => p.id === playlistId);
    const playlistSongs = songs.filter(s => playlist.songIds.includes(s.id));
    callback(null, { songs: playlistSongs });
  },
  ListPlaylistsBySong: (call, callback) => {
    const songId = call.request.id;
    const relatedPlaylists = playlists.filter(p => p.songIds.includes(songId));
    callback(null, { playlists: relatedPlaylists });
  },
});

// Inicializando o servidor
const PORT = 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Servidor rodando em 0.0.0.0:${PORT}`);
  server.start();
});
