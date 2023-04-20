#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db
from models import Song, User, File, Tag, TaggedSong

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        User.query.delete()
        File.query.delete()
        Song.query.delete()
        Tag.query.delete()
        TaggedSong.query.delete()

        user1 = User(
            username='nick',
        )
        user1.password_hash = 'pass'

        db.session.add(user1)
        db.session.commit()

        song = Song(title='all star', lyrics='ggggg', user_id=user1.id)
        db.session.add(song)
        db.session.commit()
        file = File(title='kug', mp3='pop', song_id=song.id)
        db.session.add(file)
        db.session.commit()
        tag = Tag(name='tug')
        db.session.add(tag)
        db.session.commit()
        tagged_song = TaggedSong(tag_key=tag.id, songs_key=song.id)
        db.session.add(tagged_song)
        db.session.commit()
