const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './music_streaming.proto';

// Carregando o arquivo proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const musicProto = grpc.loadPackageDefinition(packageDefinition).musicstreaming;

const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
];

const songs = [
  { id: 1, name: 'musica A', artist: 'Artista X' },
  { id: 2, name: 'musica B', artist: 'Artista Y' },
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
    const userId = 2; //call.request.id;
    const userPlaylists = playlists.filter(p => p.userId === userId);
    callback(null, { playlists: userPlaylists });
  },
  ListSongsByPlaylist: (call, callback) => {
    const playlistId = 1; //call.request.id;
    //const playlist = [];
    const playlistSongs = [];
    while(true)
      {
        if(playlists[i].id == playlistId)
        {
          for(let j = 0; j < playlists[i].songIds.length; j++)
          {
            var songId = playlists[i].songIds[j];
            var song = songs[songId].name;
            playlistSongs.push(song);
          }
        }
        i++;
        if(i > 3) break;
      }
    callback(null, { songs: playlistSongs });
  },
  ListPlaylistsBySong: (call, callback) => {
    const songId = 1; //call.request.id;
    var relatedPlaylists = [];
    var i = 0;
    while(true)
    {
      if(playlists[i].id == songId)
      {
        relatedPlaylists[0] = playlists[i];
        break;
      }
      i++;
      if(i > 3) break;
    }
    console.log(relatedPlaylists);
    callback(null, { playlists: relatedPlaylists });
  },
});

// Inicializando o servidor
const PORT = 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Servidor rodando em 0.0.0.0:${PORT}`);
  server.start();
});
