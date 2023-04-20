#!/usr/bin/env python3
import os
# Remote library imports
from flask import request, session, make_response, send_from_directory, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from werkzeug.utils import secure_filename

# Local imports
from config import app, db, api
from models import User, Song, Tag, TaggedSong, File


app.config['ALLOWED_EXTENSIONS'] = {'.mp3'}
app.config['UPLOAD_FOLDER'] = 'Static'

# Routes for Users/Login handling


@app.route('/user/<int:id>')
def userById(id):
    user = User.query.filter(User.id == id).first()
    response = make_response(user.to_dict(), 200)
    return response


@app.route('/check_session', endpoint='check_session')
def checkSession():
    if session.get('user_id'):
        user = User.query.filter(User.id == session['user_id']).first()
        return make_response(user.to_dict(), 200)

    return {'error': '401 Unauthorized'}, 401


@app.route('/login', methods=['post',])
def post():
    if request.method == 'POST':

        request_json = request.get_json()

        username = request_json.get('username')
        password = request_json.get('password')

        user = User.query.filter(User.username == username).first()

        if user:
            if user.authenticate(password):
                session['user_id'] = user.id
                response = make_response(user.to_dict(), 200)
                return response

        return {'error': '401 Unauthorized'}, 401


@app.route('/logout', methods=['DELETE'])
def delete():
    if session.get('user_id'):
        session['user_id'] = None
        return {}, 204
    return {'error': '401 Unauthorized'}, 401


@app.route('/signup', methods=['post',])
def signup():
    if request.method == 'POST':
        print(request.get_json())
        request_json = request.get_json()

        username = request_json.get('username')
        password = request_json.get('password')

        user = User(
            username=username,
        )
        user.password_hash = password

        try:
            db.session.add(user)
            db.session.commit()

            session['user_id'] = user.id

            return user.to_dict(), 201

        except IntegrityError:
            return {'error': '422 Unprocessable Entity'}, 422


# Routes for users songs
@app.route('/songs', methods=['GET', 'POST'])
def allSongs():
    if session.get('user_id'):

        if request.method == 'GET':
            user = session.get('user_id')
            songs = user.user_songs
            return make_response(songs.to_dict(), 200)

        elif request.method == 'POST':
            user = session.get('user_id')
            title = request.get_json()['title']
            newSong = Song(title=title, user_id=user)
            db.session.add(newSong)
            db.session.commit()
            return make_response(newSong.to_dict(), 201)
    else:
        return {'error': '401 Unauthorized'}, 401


@app.route('/songs/<int:id>', methods=['DELETE', 'PATCH'])
def songById(id):
    if session.get('user_id'):

        if request.method == 'DELETE':
            user = session.get('user_id')
            song = Song.query.filter(Song.id == id).first()
            if user == song.user_id:
                for file in song.song_files:
                    os.remove(os.path.join(app.config['UPLOAD_FOLDER'], file.mp3[7:len(file.mp3)]))
                    db.session.delete(file)

                for link in song.tagged_songs:
                    db.session.delete(link)

                db.session.delete(song)

                db.session.commit()
                return make_response(song.to_dict(), 204)

        elif request.method == 'PATCH':
            user = session.get('user_id')
            song = Song.query.filter(Song.id == id).first()
            if user == song.user_id:

                if not song:
                    return make_response({'error': 'Song not found!'}, 404)

                for attr in request.get_json():
                    setattr(song, attr, request.get_json()[attr])
                db.session.add(song)
                db.session.commit()

                return make_response(song.to_dict(), 204)
    else:
        return {'error': '401 Unauthorized'}, 401


@app.route('/tags', methods=['GET',])
def tags():
    tags = Tag.query.all()
    tags_names = [tag.name for tag in tags]
    return make_response(jsonify(tags_names), 200)



@app.route('/newtag', methods=['POST'])
def newTag():
    if session.get('user_id'):
        if request.method == 'POST':
            newtag = Tag(name=request.get_json()['name'])
            session.add(newtag)
            session.commit()
            response = make_response(newtag, 201)
            return response


@app.route('/songtag/<int:songid>/<string:tag>', methods=['POST'])
def addTagToSong(songid, tag):
    if session.get('user_id'):
        if request.method == 'POST':
            tag_key = Tag.query.filter(Tag.name == tag).first().id
            newtag = TaggedSong(songs_key=songid, tag_key=tag_key)
            db.session.add(newtag)
            db.session.commit()
            response = make_response('success', 201)
            return response


@app.route('/fileupload/<int:id>', methods=['POST',])
def upload(id):
    file = request.files['file']
    extension = os.path.splitext(file.filename)[1]
    new_file = File(
        title=request.form['title'],
        song_id=id,
        mp3=os.path.join(
            app.config['UPLOAD_FOLDER'],
            secure_filename(file.filename)
        )
    )

    if file:
        if extension not in app.config['ALLOWED_EXTENSIONS']:
            return 'File is not an mp3.'
        file.save(os.path.join(
            app.config['UPLOAD_FOLDER'],
            secure_filename(file.filename)
        ))

        db.session.add(new_file)
        db.session.commit()

        return make_response(
            new_file.to_dict(),
            201
        )

@app.route('/serve_file/<filename>', methods = ["GET",])
def get(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/files/<int:id>', methods=['GET',])
def file_route_get(id):
    if request.method == 'GET':
        files = File.query.filter(File.song_id == id).all()
        sent_files = []
        for file in files:
            sent_files.append(file.mp3)
        return make_response(sent_files)
    else:
        return {'error': '404 Bad Request'}, 404


if __name__ == '__main__':
    app.run(port=5555, debug=True)
