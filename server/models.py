from sqlalchemy_serializer import SerializerMixin

from config import db

from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import db, bcrypt

# Models go here!


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-_password_hash', '-song.users',
                       '-file.users', '-tag.users', '-taggedsong.users',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user_songs = db.relationship('Song', backref='user')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    @validates('username')
    def validate_username(self, key, value):
        if not value or len(value) < 6 or len(value) > 15:
            raise ValueError('Name is required to be between 6 and 16 char.')
        return value

    def __repr__(self):
        return f'<User {self.username}>'


class Song(db.Model, SerializerMixin):
    __tablename__ = 'songs'

    serialize_rules = ('-tag.songs', '-taggedsong.songs', '-file.songs',
                       '-user_id', '-song_files', '-tagged_songs', '-user', 'tags', '-tags.tagged_songs')

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    lyrics = db.Column(db.String)
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    song_files = db.relationship('File', backref='song')
    tagged_songs = db.relationship('TaggedSong', backref='song')

    tags = association_proxy('tagged_songs', 'tag')

    @validates('title')
    def validates_title(self, key, value):
        if not value or len(value) > 20 or len(value) < 1:
            raise ValueError('Titles must be between 1 and 20 characters.')
        return value

    def __repr__(self):
        return f'<Song {self.title}>'


class File(db.Model, SerializerMixin):
    __tablename__ = 'files'

    serialize_rules = ('-song.files', '-user.files',
                       '-taggedsong.files', '-tag.files')

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    mp3 = db.Column(db.String, nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey(
        'songs.id', ondelete='CASCADE'), nullable=False)

    def __repr__(self):
        return f'<file location: {self.mp3}>'


class TaggedSong(db.Model, SerializerMixin):
    __tablename__ = 'tagged_songs'

    serialize_rules = ('-tag.tagged_songs', '-song.tagged_songs',
                       '-file.tagged_songs', '-user.tagged_songs')

    id = db.Column(db.Integer, primary_key=True)
    songs_key = db.Column(
        db.Integer, db.ForeignKey('songs.id', ondelete='CASCADE'), nullable=False)
    tag_key = db.Column(db.Integer, db.ForeignKey('tags.id'), nullable=False)


class Tag(db.Model, SerializerMixin):
    __tablename__ = 'tags'

    serialize_rules = ('-song.tag', '-taggedsong.tags',
                       '-file.tags', '-user.tags','-tagged_songs','-songs')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    tagged_songs = db.relationship('TaggedSong', backref='tag')

    @validates('name')
    def validate_name(self,key,value):
        if not value or len(value) > 13 or len(value)<1:
            raise ValueError('Tags must be between 1-12 characters')
        return value

    def __repr__(self):
        return f'<{self.name}>'
