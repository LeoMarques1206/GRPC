import grpc
from locust import HttpUser, task, between
import music_streaming_pb2
import music_streaming_pb2_grpc

class MusicStreamingUser(HttpUser):
    # Intervalo entre as tarefas
    wait_time = between(1, 3)

    def on_start(self):
        # Cria o canal gRPC e o stub para comunicação com o servidor
        self.channel = grpc.insecure_channel('localhost:50051')
        self.stub = music_streaming_pb2_grpc.MusicServiceStub(self.channel)

    @task
    def list_users(self):
        # Chama o método ListUsers do gRPC
        request = music_streaming_pb2.ListUsersRequest()
        self.stub.ListUsers(request)

    @task
    def list_songs(self):
        # Chama o método ListSongs do gRPC
        request = music_streaming_pb2.ListSongsRequest()
        self.stub.ListSongs(request)

    @task
    def list_playlists_by_user(self):
        # Chama o método ListPlaylistsByUser do gRPC
        request = music_streaming_pb2.ListPlaylistsByUserRequest(id=2)
        self.stub.ListPlaylistsByUser(request)

    @task
    def list_songs_by_playlist(self):
        # Chama o método ListSongsByPlaylist do gRPC
        request = music_streaming_pb2.ListSongsByPlaylistRequest(id=1)
        self.stub.ListSongsByPlaylist(request)

    @task
    def list_playlists_by_song(self):
        # Chama o método ListPlaylistsBySong do gRPC
        request = music_streaming_pb2.ListPlaylistsBySongRequest(id=1)
        self.stub.ListPlaylistsBySong(request)

    def on_stop(self):
        self.channel.close()
